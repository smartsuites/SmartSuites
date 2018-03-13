/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.notebook.repo;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.notebook.Note;
import com.smartsuites.notebook.NoteInfo;
import com.smartsuites.notebook.Paragraph;
import com.smartsuites.scheduler.Job;
import com.smartsuites.user.AuthenticationInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.microsoft.azure.storage.CloudStorageAccount;
import com.microsoft.azure.storage.StorageException;
import com.microsoft.azure.storage.file.CloudFile;
import com.microsoft.azure.storage.file.CloudFileClient;
import com.microsoft.azure.storage.file.CloudFileDirectory;
import com.microsoft.azure.storage.file.CloudFileShare;
import com.microsoft.azure.storage.file.ListFileItem;

/**
 * Azure storage backend for notebooks
 */
public class AzureNotebookRepo implements NotebookRepo {
  private static final Logger LOG = LoggerFactory.getLogger(S3NotebookRepo.class);

  private final SmartsuitesConfiguration conf;
  private final String user;
  private final String shareName;
  private final CloudFileDirectory rootDir;

  public AzureNotebookRepo(SmartsuitesConfiguration conf)
      throws URISyntaxException, InvalidKeyException, StorageException {
    this.conf = conf;
    user = conf.getString(SmartsuitesConfiguration.ConfVars.SMARTSUITES_NOTEBOOK_AZURE_USER);
    shareName = conf.getString(SmartsuitesConfiguration.ConfVars.SMARTSUITES_NOTEBOOK_AZURE_SHARE);

    CloudStorageAccount account = CloudStorageAccount.parse(
        conf.getString(SmartsuitesConfiguration.ConfVars.SMARTSUITES_NOTEBOOK_AZURE_CONNECTION_STRING));
    CloudFileClient client = account.createCloudFileClient();
    CloudFileShare share = client.getShareReference(shareName);
    share.createIfNotExists();

    CloudFileDirectory userDir = StringUtils.isBlank(user) ?
        share.getRootDirectoryReference() :
        share.getRootDirectoryReference().getDirectoryReference(user);
    userDir.createIfNotExists();

    rootDir = userDir.getDirectoryReference("notebook");
    rootDir.createIfNotExists();
  }

  @Override
  public List<NoteInfo> list(AuthenticationInfo subject) throws IOException {
    List<NoteInfo> infos = new LinkedList<>();
    NoteInfo info = null;

    for (ListFileItem item : rootDir.listFilesAndDirectories()) {
      if (item.getClass() == CloudFileDirectory.class) {
        CloudFileDirectory dir = (CloudFileDirectory) item;

        try {
          if (dir.getFileReference("note.json").exists()) {
            info = new NoteInfo(getNote(dir.getName()));

            if (info != null) {
              infos.add(info);
            }
          }
        } catch (StorageException | URISyntaxException e) {
          String msg = "Error enumerating notebooks from Azure storage";
          LOG.error(msg, e);
        } catch (Exception e) {
          LOG.error(e.getMessage(), e);
        }
      }
    }

    return infos;
  }

  private Note getNote(String noteId) throws IOException {
    InputStream ins = null;

    try {
      CloudFileDirectory dir = rootDir.getDirectoryReference(noteId);
      CloudFile file = dir.getFileReference("note.json");

      ins = file.openRead();
    } catch (URISyntaxException | StorageException e) {
      String msg = String.format("Error reading notebook %s from Azure storage", noteId);

      LOG.error(msg, e);

      throw new IOException(msg, e);
    }

    String json = IOUtils.toString(ins,
        conf.getString(SmartsuitesConfiguration.ConfVars.SMARTSUITES_ENCODING));
    ins.close();
    Note note = Note.fromJson(json);

    for (Paragraph p : note.getParagraphs()) {
      if (p.getStatus() == Job.Status.PENDING || p.getStatus() == Job.Status.RUNNING) {
        p.setStatus(Job.Status.ABORT);
      }
    }

    return note;
  }

  @Override
  public Note get(String noteId, AuthenticationInfo subject) throws IOException {
    return getNote(noteId);
  }

  @Override
  public void save(Note note, AuthenticationInfo subject) throws IOException {
    String json = note.toJson();

    ByteArrayOutputStream output = new ByteArrayOutputStream();
    Writer writer = new OutputStreamWriter(output);
    writer.write(json);
    writer.close();
    output.close();

    byte[] buffer = output.toByteArray();

    try {
      CloudFileDirectory dir = rootDir.getDirectoryReference(note.getId());
      dir.createIfNotExists();

      CloudFile cloudFile = dir.getFileReference("note.json");
      cloudFile.uploadFromByteArray(buffer, 0, buffer.length);
    } catch (URISyntaxException | StorageException e) {
      String msg = String.format("Error saving notebook %s to Azure storage", note.getId());

      LOG.error(msg, e);

      throw new IOException(msg, e);
    }
  }

  // unfortunately, we need to use a recursive delete here
  private void delete(ListFileItem item) throws StorageException {
    if (item.getClass() == CloudFileDirectory.class) {
      CloudFileDirectory dir = (CloudFileDirectory) item;

      for (ListFileItem subItem : dir.listFilesAndDirectories()) {
        delete(subItem);
      }

      dir.deleteIfExists();
    } else if (item.getClass() == CloudFile.class) {
      CloudFile file = (CloudFile) item;

      file.deleteIfExists();
    }
  }

  @Override
  public void remove(String noteId, AuthenticationInfo subject) throws IOException {
    try {
      CloudFileDirectory dir = rootDir.getDirectoryReference(noteId);

      delete(dir);
    } catch (URISyntaxException | StorageException e) {
      String msg = String.format("Error deleting notebook %s from Azure storage", noteId);

      LOG.error(msg, e);

      throw new IOException(msg, e);
    }
  }

  @Override
  public void close() {
  }

  @Override
  public Revision checkpoint(String noteId, String checkpointMsg, AuthenticationInfo subject)
      throws IOException {
    // no-op
    LOG.warn("Checkpoint feature isn't supported in {}", this.getClass().toString());
    return Revision.EMPTY;
  }

  @Override
  public Note get(String noteId, String revId, AuthenticationInfo subject) throws IOException {
    LOG.warn("Get note revision feature isn't supported in {}", this.getClass().toString());
    return null;
  }

  @Override
  public List<Revision> revisionHistory(String noteId, AuthenticationInfo subject) {
    LOG.warn("Get Note revisions feature isn't supported in {}", this.getClass().toString());
    return Collections.emptyList();
  }

  @Override
  public List<NotebookRepoSettingsInfo> getSettings(AuthenticationInfo subject) {
    LOG.warn("Method not implemented");
    return Collections.emptyList();
  }

  @Override
  public void updateSettings(Map<String, String> settings, AuthenticationInfo subject) {
    LOG.warn("Method not implemented");
  }

  @Override
  public Note setNoteRevision(String noteId, String revId, AuthenticationInfo subject)
      throws IOException {
    // Auto-generated method stub
    return null;
  }
}
