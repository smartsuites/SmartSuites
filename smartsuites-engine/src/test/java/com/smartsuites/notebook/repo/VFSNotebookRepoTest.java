/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.notebook.repo;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.smartsuites.interpreter.AbstractInterpreterTest;
import org.apache.commons.io.FileUtils;
import com.smartsuites.conf.SmartsuitesConfiguration.ConfVars;

import com.smartsuites.notebook.JobListenerFactory;
import com.smartsuites.notebook.Note;
import com.smartsuites.notebook.Notebook;
import com.smartsuites.notebook.NotebookAuthorization;
import com.smartsuites.notebook.Paragraph;
import com.smartsuites.notebook.ParagraphJobListener;
import com.smartsuites.scheduler.SchedulerFactory;
import com.smartsuites.search.SearchService;
import com.smartsuites.user.AuthenticationInfo;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.ImmutableMap;

public class VFSNotebookRepoTest extends AbstractInterpreterTest implements JobListenerFactory {

  private static final Logger LOG = LoggerFactory.getLogger(VFSNotebookRepoTest.class);

  private SchedulerFactory schedulerFactory;
  private Notebook notebook;
  private NotebookRepo notebookRepo;
  private NotebookAuthorization notebookAuthorization;

  @Before
  public void setUp() throws Exception {
    System.setProperty(ConfVars.ZEPPELIN_INTERPRETER_GROUP_ORDER.getVarName(), "mock1,mock2");
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_STORAGE.getVarName(), "VFSNotebookRepo");

    super.setUp();

    this.schedulerFactory = SchedulerFactory.singleton();
    SearchService search = mock(SearchService.class);
    notebookRepo = new VFSNotebookRepo(conf);
    notebookAuthorization = NotebookAuthorization.init(conf);
    notebook = new Notebook(conf, notebookRepo, schedulerFactory, interpreterFactory, interpreterSettingManager, this, search,
        notebookAuthorization, null);
  }

  @After
  public void tearDown() throws Exception {
    super.tearDown();
  }

  @Test
  public void testInvalidJsonFile() throws IOException {
    // given
    int numNotes = notebookRepo.list(null).size();

    // when create invalid json file
    File testNoteDir = new File(notebookDir, "interpreter/test");
    testNoteDir.mkdir();
    FileUtils.writeStringToFile(new File(testNoteDir, "note.json"), "");

    // then
    assertEquals(numNotes, notebookRepo.list(null).size());
  }

  @Test
  public void testSaveNotebook() throws IOException, InterruptedException {
    AuthenticationInfo anonymous = new AuthenticationInfo("anonymous");
    Note note = notebook.createNote(anonymous);
    interpreterSettingManager.setInterpreterBinding("user", note.getId(), interpreterSettingManager.getInterpreterSettingIds());

    Paragraph p1 = note.addNewParagraph(AuthenticationInfo.ANONYMOUS);
    Map<String, Object> config = p1.getConfig();
    config.put("enabled", true);
    p1.setConfig(config);
    p1.setText("%mock1 hello world");
    p1.setAuthenticationInfo(anonymous);

    note.run(p1.getId());
    int timeout = 1;
    while (!p1.isTerminated()) {
      Thread.sleep(1000);
      if (timeout++ > 10) {
        break;
      }
    }
    int i = 0;
    int TEST_COUNT = 10;
    while (i++ < TEST_COUNT) {
      p1.setText("%mock1 hello zeppelin");
      new Thread(new NotebookWriter(note)).start();
      p1.setText("%mock1 hello world");
      new Thread(new NotebookWriter(note)).start();
    }

    note.setName("SaveTest");
    notebookRepo.save(note, null);
    assertEquals(note.getName(), "SaveTest");
    notebookRepo.remove(note.getId(), null);
  }
  
  @Test
  public void testUpdateSettings() throws IOException {
    AuthenticationInfo subject = new AuthenticationInfo("anonymous");
    File tmpDir = File.createTempFile("temp", Long.toString(System.nanoTime()));
    Map<String, String> settings = ImmutableMap.of("Notebook Path", tmpDir.getAbsolutePath());
    
    List<NotebookRepoSettingsInfo> repoSettings = notebookRepo.getSettings(subject);
    String originalDir = repoSettings.get(0).selected;
    
    notebookRepo.updateSettings(settings, subject);
    repoSettings = notebookRepo.getSettings(subject);
    assertEquals(repoSettings.get(0).selected, tmpDir.getAbsolutePath());
    
    // restaure
    notebookRepo.updateSettings(ImmutableMap.of("Notebook Path", originalDir), subject);
    FileUtils.deleteQuietly(tmpDir);
  }

  class NotebookWriter implements Runnable {
    Note note;
    public NotebookWriter(Note note) {
      this.note = note;
    }

    @Override
    public void run() {
      try {
        notebookRepo.save(note, null);
      } catch (IOException e) {
        LOG.error(e.toString(), e);
      }
    }
  }

  @Override
  public ParagraphJobListener getParagraphJobListener(Note note) {
    return null;
  }
}
