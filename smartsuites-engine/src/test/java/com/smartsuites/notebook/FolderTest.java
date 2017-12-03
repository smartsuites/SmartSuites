/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.notebook;

import com.smartsuites.notebook.Folder;
import com.smartsuites.notebook.JobListenerFactory;
import com.smartsuites.notebook.Note;
import com.smartsuites.notebook.NoteEventListener;
import com.smartsuites.interpreter.Interpreter;
import com.smartsuites.interpreter.InterpreterFactory;
import com.smartsuites.interpreter.InterpreterSettingManager;
import com.smartsuites.notebook.repo.NotebookRepo;
import com.smartsuites.scheduler.Scheduler;
import com.smartsuites.search.SearchService;
import com.smartsuites.user.Credentials;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

@RunWith(MockitoJUnitRunner.class)
public class FolderTest {
  @Mock
  NotebookRepo repo;

  @Mock
  JobListenerFactory jobListenerFactory;

  @Mock
  SearchService index;

  @Mock
  Credentials credentials;

  @Mock
  Interpreter interpreter;

  @Mock
  Scheduler scheduler;

  @Mock
  NoteEventListener noteEventListener;

  @Mock
  InterpreterFactory interpreterFactory;

  @Mock
  InterpreterSettingManager interpreterSettingManager;

  Folder folder;

  Note note1;
  Note note2;
  Note note3;

  @Before
  public void createFolderAndNotes() {
    note1 = new Note(repo, interpreterFactory, interpreterSettingManager, jobListenerFactory, index, credentials, noteEventListener);
    note1.setName("this/is/a/folder/note1");

    note2 = new Note(repo, interpreterFactory, interpreterSettingManager, jobListenerFactory, index, credentials, noteEventListener);
    note2.setName("this/is/a/folder/note2");

    note3 = new Note(repo, interpreterFactory, interpreterSettingManager, jobListenerFactory, index, credentials, noteEventListener);
    note3.setName("this/is/a/folder/note3");

    folder = new Folder("this/is/a/folder");
    folder.addNote(note1);
    folder.addNote(note2);
    folder.addNote(note3);

    folder.setParent(new Folder("this/is/a"));
  }

  @Test
  public void normalizeFolderIdTest() {
    // The root folder tests
    assertEquals(Folder.ROOT_FOLDER_ID, Folder.normalizeFolderId("/"));
    assertEquals(Folder.ROOT_FOLDER_ID, Folder.normalizeFolderId("//"));
    assertEquals(Folder.ROOT_FOLDER_ID, Folder.normalizeFolderId("///"));
    assertEquals(Folder.ROOT_FOLDER_ID, Folder.normalizeFolderId("\\\\///////////"));

    // Folders under the root
    assertEquals("a", Folder.normalizeFolderId("a"));
    assertEquals("a", Folder.normalizeFolderId("/a"));
    assertEquals("a", Folder.normalizeFolderId("a/"));
    assertEquals("a", Folder.normalizeFolderId("/a/"));

    // Subdirectories
    assertEquals("a/b/c", Folder.normalizeFolderId("a/b/c"));
    assertEquals("a/b/c", Folder.normalizeFolderId("/a/b/c"));
    assertEquals("a/b/c", Folder.normalizeFolderId("a/b/c/"));
    assertEquals("a/b/c", Folder.normalizeFolderId("/a/b/c/"));
  }

  @Test
  public void folderIdTest() {
    assertEquals(note1.getFolderId(), folder.getId());
    assertEquals(note2.getFolderId(), folder.getId());
    assertEquals(note3.getFolderId(), folder.getId());
  }

  @Test
  public void addNoteTest() {
    Note note4 = new Note(repo, interpreterFactory, interpreterSettingManager, jobListenerFactory, index, credentials, noteEventListener);
    note4.setName("this/is/a/folder/note4");

    folder.addNote(note4);

    assert (folder.getNotes().contains(note4));
  }

  @Test
  public void removeNoteTest() {
    folder.removeNote(note3);

    assert (!folder.getNotes().contains(note3));
  }

  @Test
  public void renameTest() {
    // Subdirectory tests
    folder.rename("renamed/folder");

    assertEquals("renamed/folder", note1.getFolderId());
    assertEquals("renamed/folder", note2.getFolderId());
    assertEquals("renamed/folder", note3.getFolderId());

    assertEquals("renamed/folder/note1", note1.getName());
    assertEquals("renamed/folder/note2", note2.getName());
    assertEquals("renamed/folder/note3", note3.getName());

    // Folders under the root tests
    folder.rename("a");

    assertEquals("a", note1.getFolderId());
    assertEquals("a", note2.getFolderId());
    assertEquals("a", note3.getFolderId());

    assertEquals("a/note1", note1.getName());
    assertEquals("a/note2", note2.getName());
    assertEquals("a/note3", note3.getName());
  }

  @Test
  public void renameToRootTest() {
    folder.rename(Folder.ROOT_FOLDER_ID);

    assertEquals(Folder.ROOT_FOLDER_ID, note1.getFolderId());
    assertEquals(Folder.ROOT_FOLDER_ID, note2.getFolderId());
    assertEquals(Folder.ROOT_FOLDER_ID, note3.getFolderId());

    assertEquals("note1", note1.getName());
    assertEquals("note2", note2.getName());
    assertEquals("note3", note3.getName());
  }

  @Test
  public void getParentIdTest() {
    Folder rootFolder = new Folder("/");
    Folder aFolder = new Folder("a");
    Folder abFolder = new Folder("a/b");

    assertEquals("/", rootFolder.getParentFolderId());
    assertEquals("/", aFolder.getParentFolderId());
    assertEquals("a", abFolder.getParentFolderId());
  }

  @Test
  public void getNameTest() {
    Folder rootFolder = new Folder("/");
    Folder aFolder = new Folder("a");
    Folder abFolder = new Folder("a/b");

    assertEquals("/", rootFolder.getName());
    assertEquals("a", aFolder.getName());
    assertEquals("b", abFolder.getName());
  }

  @Test
  public void isTrashTest() {
    Folder folder;
    // Not trash
    folder = new Folder(Folder.ROOT_FOLDER_ID);
    assertFalse(folder.isTrash());
    folder = new Folder("a");
    assertFalse(folder.isTrash());
    folder = new Folder("a/b");
    assertFalse(folder.isTrash());
    // trash
    folder = new Folder(Folder.TRASH_FOLDER_ID);
    assertTrue(folder.isTrash());
    folder = new Folder(Folder.TRASH_FOLDER_ID + "/a");
    assertTrue(folder.isTrash());
    folder = new Folder(Folder.TRASH_FOLDER_ID + "/a/b");
    assertTrue(folder.isTrash());
  }
}
