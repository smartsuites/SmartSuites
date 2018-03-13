/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.notebook.repo;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;

import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.smartsuites.notebook.*;
import org.apache.commons.io.FileUtils;
import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.conf.SmartsuitesConfiguration.ConfVars;
import com.smartsuites.dep.DependencyResolver;
import com.smartsuites.display.AngularObjectRegistryListener;
import com.smartsuites.helium.ApplicationEventListener;
import com.smartsuites.interpreter.InterpreterFactory;
import com.smartsuites.interpreter.InterpreterResultMessage;
import com.smartsuites.interpreter.InterpreterSettingManager;
import com.smartsuites.interpreter.remote.RemoteInterpreterProcessListener;
import com.smartsuites.scheduler.Job;
import com.smartsuites.scheduler.Job.Status;
import com.smartsuites.scheduler.SchedulerFactory;
import com.smartsuites.search.SearchService;
import com.smartsuites.user.AuthenticationInfo;
import com.smartsuites.user.Credentials;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.quartz.SchedulerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class NotebookRepoSyncTest implements JobListenerFactory {

  private File mainZepDir;
  private SmartsuitesConfiguration conf;
  private SchedulerFactory schedulerFactory;
  private File mainNotebookDir;
  private File secNotebookDir;
  private Notebook notebookSync;
  private NotebookRepoSync notebookRepoSync;
  private InterpreterFactory factory;
  private InterpreterSettingManager interpreterSettingManager;
  private DependencyResolver depResolver;
  private SearchService search;
  private NotebookAuthorization notebookAuthorization;
  private Credentials credentials;
  private AuthenticationInfo anonymous;
  private static final Logger LOG = LoggerFactory.getLogger(NotebookRepoSyncTest.class);

  @Before
  public void setUp() throws Exception {
    String zpath = System.getProperty("java.io.tmpdir")+"/ZeppelinLTest_"+System.currentTimeMillis();
    mainZepDir = new File(zpath);
    mainZepDir.mkdirs();
    new File(mainZepDir, "conf").mkdirs();
    String mainNotePath = zpath+"/notebook";
    String secNotePath = mainNotePath + "_secondary";
    mainNotebookDir = new File(mainNotePath);
    secNotebookDir = new File(secNotePath);
    mainNotebookDir.mkdirs();
    secNotebookDir.mkdirs();

    System.setProperty(ConfVars.ZEPPELIN_HOME.getVarName(), mainZepDir.getAbsolutePath());
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_DIR.getVarName(), mainNotebookDir.getAbsolutePath());
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_STORAGE.getVarName(), "VFSNotebookRepo,com.smartsuites.notebook.repo.mock.VFSNotebookRepoMock");
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_ONE_WAY_SYNC.getVarName(), "false");
    LOG.info("main Note dir : " + mainNotePath);
    LOG.info("secondary note dir : " + secNotePath);
    conf = SmartsuitesConfiguration.create();

    this.schedulerFactory = SchedulerFactory.singleton();

    depResolver = new DependencyResolver(mainZepDir.getAbsolutePath() + "/local-repo");
    interpreterSettingManager = new InterpreterSettingManager(conf,
        mock(AngularObjectRegistryListener.class), mock(RemoteInterpreterProcessListener.class), mock(ApplicationEventListener.class));
    factory = new InterpreterFactory(interpreterSettingManager);

    search = mock(SearchService.class);
    notebookRepoSync = new NotebookRepoSync(conf);
    notebookAuthorization = NotebookAuthorization.init(conf);
    credentials = new Credentials(conf.credentialsPersist(), conf.getCredentialsPath(), null);
    notebookSync = new Notebook(conf, notebookRepoSync, schedulerFactory, factory, interpreterSettingManager, this, search,
            notebookAuthorization, credentials);
    anonymous = new AuthenticationInfo("anonymous");
  }

  @After
  public void tearDown() throws Exception {
    delete(mainZepDir);
  }

  @Test
  public void testRepoCount() throws IOException {
    assertTrue(notebookRepoSync.getMaxRepoNum() >= notebookRepoSync.getRepoCount());
  }

  @Test
  public void testSyncOnCreate() throws IOException {
    /* check that both storage systems are empty */
    assertTrue(notebookRepoSync.getRepoCount() > 1);
    assertEquals(0, notebookRepoSync.list(0, anonymous).size());
    assertEquals(0, notebookRepoSync.list(1, anonymous).size());

    /* create note */
    Note note = notebookSync.createNote(anonymous);

    // check that automatically saved on both storages
    assertEquals(1, notebookRepoSync.list(0, anonymous).size());
    assertEquals(1, notebookRepoSync.list(1, anonymous).size());
    assertEquals(notebookRepoSync.list(0, anonymous).get(0).getId(),notebookRepoSync.list(1, anonymous).get(0).getId());

    notebookSync.removeNote(notebookRepoSync.list(0, null).get(0).getId(), anonymous);
  }

  @Test
  public void testSyncOnDelete() throws IOException {
    /* create note */
    assertTrue(notebookRepoSync.getRepoCount() > 1);
    assertEquals(0, notebookRepoSync.list(0, anonymous).size());
    assertEquals(0, notebookRepoSync.list(1, anonymous).size());

    Note note = notebookSync.createNote(anonymous);

    /* check that created in both storage systems */
    assertEquals(1, notebookRepoSync.list(0, anonymous).size());
    assertEquals(1, notebookRepoSync.list(1, anonymous).size());
    assertEquals(notebookRepoSync.list(0, anonymous).get(0).getId(),notebookRepoSync.list(1, anonymous).get(0).getId());

    /* remove Note */
    notebookSync.removeNote(notebookRepoSync.list(0, anonymous).get(0).getId(), anonymous);

    /* check that deleted in both storages */
    assertEquals(0, notebookRepoSync.list(0, anonymous).size());
    assertEquals(0, notebookRepoSync.list(1, anonymous).size());

  }

  @Test
  public void testSyncUpdateMain() throws IOException {

    /* create note */
    Note note = notebookSync.createNote(anonymous);
    Paragraph p1 = note.addNewParagraph(AuthenticationInfo.ANONYMOUS);
    Map config = p1.getConfig();
    config.put("enabled", true);
    p1.setConfig(config);
    p1.setText("hello world");

    /* new paragraph exists in note instance */
    assertEquals(1, note.getParagraphs().size());

    /* new paragraph not yet saved into storages */
    assertEquals(0, notebookRepoSync.get(0,
        notebookRepoSync.list(0, anonymous).get(0).getId(), anonymous).getParagraphs().size());
    assertEquals(0, notebookRepoSync.get(1,
        notebookRepoSync.list(1, anonymous).get(0).getId(), anonymous).getParagraphs().size());

    /* save to storage under index 0 (first storage) */
    notebookRepoSync.save(0, note, anonymous);

    /* check paragraph saved to first storage */
    assertEquals(1, notebookRepoSync.get(0,
        notebookRepoSync.list(0, anonymous).get(0).getId(), anonymous).getParagraphs().size());
    /* check paragraph isn't saved to second storage */
    assertEquals(0, notebookRepoSync.get(1,
        notebookRepoSync.list(1, anonymous).get(0).getId(), anonymous).getParagraphs().size());
    /* apply sync */
    notebookRepoSync.sync(null);
    /* check whether added to second storage */
    assertEquals(1, notebookRepoSync.get(1,
    notebookRepoSync.list(1, anonymous).get(0).getId(), anonymous).getParagraphs().size());
    /* check whether same paragraph id */
    assertEquals(p1.getId(), notebookRepoSync.get(0,
        notebookRepoSync.list(0, anonymous).get(0).getId(), anonymous).getLastParagraph().getId());
    assertEquals(p1.getId(), notebookRepoSync.get(1,
        notebookRepoSync.list(1, anonymous).get(0).getId(), anonymous).getLastParagraph().getId());
    notebookRepoSync.remove(note.getId(), anonymous);
  }

  @Test
  public void testSyncOnReloadedList() throws IOException {
    /* check that both storage repos are empty */
    assertTrue(notebookRepoSync.getRepoCount() > 1);
    assertEquals(0, notebookRepoSync.list(0, anonymous).size());
    assertEquals(0, notebookRepoSync.list(1, anonymous).size());

    File srcDir = new File("src/test/resources/2A94M5J1Z");
    File destDir = new File(secNotebookDir + "/2A94M5J1Z");

    /* copy manually new notebook into secondary storage repo and check repos */
    try {
      FileUtils.copyDirectory(srcDir, destDir);
    } catch (IOException e) {
      LOG.error(e.toString(), e);
    }
    assertEquals(0, notebookRepoSync.list(0, anonymous).size());
    assertEquals(1, notebookRepoSync.list(1, anonymous).size());

    // After reloading notebooks repos should be synchronized
    notebookSync.reloadAllNotes(anonymous);
    assertEquals(1, notebookRepoSync.list(0, anonymous).size());
    assertEquals(1, notebookRepoSync.list(1, anonymous).size());
  }

  @Test
  public void testOneWaySyncOnReloadedList() throws IOException, SchedulerException {
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_DIR.getVarName(), mainNotebookDir.getAbsolutePath());
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_ONE_WAY_SYNC.getVarName(), "true");
    conf = SmartsuitesConfiguration.create();
    notebookRepoSync = new NotebookRepoSync(conf);
    notebookSync = new Notebook(conf, notebookRepoSync, schedulerFactory, factory, interpreterSettingManager, this, search,
            notebookAuthorization, credentials);

    // check that both storage repos are empty
    assertTrue(notebookRepoSync.getRepoCount() > 1);
    assertEquals(0, notebookRepoSync.list(0, null).size());
    assertEquals(0, notebookRepoSync.list(1, null).size());

    File srcDir = new File("src/test/resources/2A94M5J1Z");
    File destDir = new File(secNotebookDir + "/2A94M5J1Z");

    // copy manually new notebook into secondary storage repo and check repos
    try {
      FileUtils.copyDirectory(srcDir, destDir);
    } catch (IOException e) {
      LOG.error(e.toString(), e);
    }
    assertEquals(0, notebookRepoSync.list(0, null).size());
    assertEquals(1, notebookRepoSync.list(1, null).size());

    // after reloading the notebook should be wiped from secondary storage
    notebookSync.reloadAllNotes(null);
    assertEquals(0, notebookRepoSync.list(0, null).size());
    assertEquals(0, notebookRepoSync.list(1, null).size());

    destDir = new File(mainNotebookDir + "/2A94M5J1Z");

    // copy manually new notebook into primary storage repo and check repos
    try {
      FileUtils.copyDirectory(srcDir, destDir);
    } catch (IOException e) {
      LOG.error(e.toString(), e);
    }
    assertEquals(1, notebookRepoSync.list(0, null).size());
    assertEquals(0, notebookRepoSync.list(1, null).size());

    // after reloading notebooks repos should be synchronized
    notebookSync.reloadAllNotes(null);
    assertEquals(1, notebookRepoSync.list(0, null).size());
    assertEquals(1, notebookRepoSync.list(1, null).size());
  }

  @Test
  public void testCheckpointOneStorage() throws IOException, SchedulerException {
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_STORAGE.getVarName(), "GitNotebookRepo");
    SmartsuitesConfiguration vConf = SmartsuitesConfiguration.create();

    NotebookRepoSync vRepoSync = new NotebookRepoSync(vConf);
    Notebook vNotebookSync = new Notebook(vConf, vRepoSync, schedulerFactory, factory, interpreterSettingManager, this, search,
            notebookAuthorization, credentials);

    // one git versioned storage initialized
    assertThat(vRepoSync.getRepoCount()).isEqualTo(1);
    assertThat(vRepoSync.getRepo(0)).isInstanceOf(GitNotebookRepo.class);

    GitNotebookRepo gitRepo = (GitNotebookRepo) vRepoSync.getRepo(0);

    // no notes
    assertThat(vRepoSync.list(anonymous).size()).isEqualTo(0);
    // create note
    Note note = vNotebookSync.createNote(anonymous);
    assertThat(vRepoSync.list(anonymous).size()).isEqualTo(1);

    String noteId = vRepoSync.list(anonymous).get(0).getId();
    // first checkpoint
    vRepoSync.checkpoint(noteId, "checkpoint message", anonymous);
    int vCount = gitRepo.revisionHistory(noteId, anonymous).size();
    assertThat(vCount).isEqualTo(1);

    Paragraph p = note.addNewParagraph(AuthenticationInfo.ANONYMOUS);
    Map<String, Object> config = p.getConfig();
    config.put("enabled", true);
    p.setConfig(config);
    p.setText("%md checkpoint test");

    // save and checkpoint again
    vRepoSync.save(note, anonymous);
    vRepoSync.checkpoint(noteId, "checkpoint message 2", anonymous);
    assertThat(gitRepo.revisionHistory(noteId, anonymous).size()).isEqualTo(vCount + 1);
    notebookRepoSync.remove(note.getId(), anonymous);
  }

  @Test
  public void testSyncWithAcl() throws IOException {
    /* scenario 1 - note exists with acl on main storage */
    AuthenticationInfo user1 = new AuthenticationInfo("user1");
    Note note = notebookSync.createNote(user1);
    assertEquals(0, note.getParagraphs().size());

    // saved on both storages
    assertEquals(1, notebookRepoSync.list(0, null).size());
    assertEquals(1, notebookRepoSync.list(1, null).size());

    /* check that user1 is the only owner */
    NotebookAuthorization authInfo = NotebookAuthorization.getInstance();
    Set<String> entity = new HashSet<String>();
    entity.add(user1.getUser());
    assertEquals(true, authInfo.isOwner(note.getId(), entity));
    assertEquals(1, authInfo.getOwners(note.getId()).size());
    assertEquals(0, authInfo.getReaders(note.getId()).size());
    assertEquals(0, authInfo.getRunners(note.getId()).size());
    assertEquals(0, authInfo.getWriters(note.getId()).size());

    /* update note and save on secondary storage */
    Paragraph p1 = note.addNewParagraph(AuthenticationInfo.ANONYMOUS);
    p1.setText("hello world");
    assertEquals(1, note.getParagraphs().size());
    notebookRepoSync.save(1, note, null);

    /* check paragraph isn't saved into first storage */
    assertEquals(0, notebookRepoSync.get(0,
        notebookRepoSync.list(0, null).get(0).getId(), null).getParagraphs().size());
    /* check paragraph is saved into second storage */
    assertEquals(1, notebookRepoSync.get(1,
        notebookRepoSync.list(1, null).get(0).getId(), null).getParagraphs().size());

    /* now sync by user1 */
    notebookRepoSync.sync(user1);

    /* check that note updated and acl are same on main storage*/
    assertEquals(1, notebookRepoSync.get(0,
        notebookRepoSync.list(0, null).get(0).getId(), null).getParagraphs().size());
    assertEquals(true, authInfo.isOwner(note.getId(), entity));
    assertEquals(1, authInfo.getOwners(note.getId()).size());
    assertEquals(0, authInfo.getReaders(note.getId()).size());
    assertEquals(0, authInfo.getRunners(note.getId()).size());
    assertEquals(0, authInfo.getWriters(note.getId()).size());

    /* scenario 2 - note doesn't exist on main storage */
    /* remove from main storage */
    notebookRepoSync.remove(0, note.getId(), user1);
    assertEquals(0, notebookRepoSync.list(0, null).size());
    assertEquals(1, notebookRepoSync.list(1, null).size());
    authInfo.removeNote(note.getId());
    assertEquals(0, authInfo.getOwners(note.getId()).size());
    assertEquals(0, authInfo.getReaders(note.getId()).size());
    assertEquals(0, authInfo.getRunners(note.getId()).size());
    assertEquals(0, authInfo.getWriters(note.getId()).size());

    /* now sync - should bring note from secondary storage with added acl */
    notebookRepoSync.sync(user1);
    assertEquals(1, notebookRepoSync.list(0, null).size());
    assertEquals(1, notebookRepoSync.list(1, null).size());
    assertEquals(1, authInfo.getOwners(note.getId()).size());
    assertEquals(1, authInfo.getReaders(note.getId()).size());
    assertEquals(1, authInfo.getRunners(note.getId()).size());
    assertEquals(1, authInfo.getWriters(note.getId()).size());
    assertEquals(true, authInfo.isOwner(note.getId(), entity));
    assertEquals(true, authInfo.isReader(note.getId(), entity));
    assertEquals(true, authInfo.isRunner(note.getId(), entity));
    assertEquals(true, authInfo.isWriter(note.getId(), entity));
  }

  static void delete(File file){
    if(file.isFile()) file.delete();
      else if(file.isDirectory()){
        File [] files = file.listFiles();
        if(files!=null && files.length>0){
          for(File f : files){
            delete(f);
          }
        }
        file.delete();
      }
  }

  @Override
  public ParagraphJobListener getParagraphJobListener(Note note) {
    return new ParagraphJobListener(){

      @Override
      public void onOutputAppend(Paragraph paragraph, int idx, String output) {

      }

      @Override
      public void onOutputUpdate(Paragraph paragraph, int idx, InterpreterResultMessage msg) {

      }

      @Override
      public void onOutputUpdateAll(Paragraph paragraph, List<InterpreterResultMessage> msgs) {

      }

      @Override
      public void onProgressUpdate(Job job, int progress) {
      }

      @Override
      public void beforeStatusChange(Job job, Status before, Status after) {
      }

      @Override
      public void afterStatusChange(Job job, Status before, Status after) {
      }
    };
  }

}
