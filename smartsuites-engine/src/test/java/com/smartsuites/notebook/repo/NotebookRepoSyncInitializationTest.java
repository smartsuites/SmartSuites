/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.notebook.repo;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;

import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.conf.SmartsuitesConfiguration.ConfVars;
import com.smartsuites.notebook.repo.mock.VFSNotebookRepoMock;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NotebookRepoSyncInitializationTest {
  private static final Logger LOG = LoggerFactory.getLogger(NotebookRepoSyncInitializationTest.class);
  private String validFirstStorageClass = "VFSNotebookRepo";
  private String validSecondStorageClass = "com.smartsuites.notebook.repo.mock.VFSNotebookRepoMock";
  private String invalidStorageClass = "com.smartsuites.notebook.repo.DummyNotebookRepo";
  private String validOneStorageConf = validFirstStorageClass;
  private String validTwoStorageConf = validFirstStorageClass + "," + validSecondStorageClass;
  private String invalidTwoStorageConf = validFirstStorageClass + "," + invalidStorageClass;
  private String unsupportedStorageConf = validFirstStorageClass + "," + validSecondStorageClass + "," + validSecondStorageClass;
  private String emptyStorageConf = "";
  
  @Before
  public void setUp(){
    //setup routine
  }
  
  @After
  public void tearDown() {
    //tear-down routine 
  }

  @Test
  public void validInitOneStorageTest() throws IOException {
    // no need to initialize folder due to one storage
    // set confs
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_STORAGE.getVarName(), validOneStorageConf);
    SmartsuitesConfiguration conf = SmartsuitesConfiguration.create();
    // create repo
    NotebookRepoSync notebookRepoSync = new NotebookRepoSync(conf);
    // check proper initialization of one storage
    assertEquals(notebookRepoSync.getRepoCount(), 1);
    assertTrue(notebookRepoSync.getRepo(0) instanceof VFSNotebookRepo);
  }

  @Test
  public void validInitTwoStorageTest() throws IOException {
    // initialize folders for each storage
    String zpath = System.getProperty("java.io.tmpdir") + "/ZeppelinLTest_" + System.currentTimeMillis();
    File mainZepDir = new File(zpath);
    mainZepDir.mkdirs();
    new File(mainZepDir, "conf").mkdirs();
    String mainNotePath = zpath+"/notebook";
    String secNotePath = mainNotePath + "_secondary";
    File mainNotebookDir = new File(mainNotePath);
    File secNotebookDir = new File(secNotePath);
    mainNotebookDir.mkdirs();
    secNotebookDir.mkdirs();
    
    // set confs
    System.setProperty(ConfVars.ZEPPELIN_HOME.getVarName(), mainZepDir.getAbsolutePath());
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_DIR.getVarName(), mainNotebookDir.getAbsolutePath());
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_STORAGE.getVarName(), validTwoStorageConf);
    SmartsuitesConfiguration conf = SmartsuitesConfiguration.create();
    // create repo
    NotebookRepoSync notebookRepoSync = new NotebookRepoSync(conf);
    // check that both initialized
    assertEquals(notebookRepoSync.getRepoCount(), 2);
    assertTrue(notebookRepoSync.getRepo(0) instanceof VFSNotebookRepo);
    assertTrue(notebookRepoSync.getRepo(1) instanceof VFSNotebookRepoMock);
  }
  
  @Test
  public void invalidInitTwoStorageTest() throws IOException {
    // set confs
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_STORAGE.getVarName(), invalidTwoStorageConf);
    SmartsuitesConfiguration conf = SmartsuitesConfiguration.create();
    // create repo
    NotebookRepoSync notebookRepoSync = new NotebookRepoSync(conf);
    // check that second didn't initialize
    LOG.info(" " + notebookRepoSync.getRepoCount());
    assertEquals(notebookRepoSync.getRepoCount(), 1);
    assertTrue(notebookRepoSync.getRepo(0) instanceof VFSNotebookRepo);
  }
  
  @Test
  public void initUnsupportedNumberStoragesTest() throws IOException {
    // initialize folders for each storage, currently for 2 only
    String zpath = System.getProperty("java.io.tmpdir") + "/ZeppelinLTest_" + System.currentTimeMillis();
    File mainZepDir = new File(zpath);
    mainZepDir.mkdirs();
    new File(mainZepDir, "conf").mkdirs();
    String mainNotePath = zpath+"/notebook";
    String secNotePath = mainNotePath + "_secondary";
    File mainNotebookDir = new File(mainNotePath);
    File secNotebookDir = new File(secNotePath);
    mainNotebookDir.mkdirs();
    secNotebookDir.mkdirs();
    
    // set confs
    System.setProperty(ConfVars.ZEPPELIN_HOME.getVarName(), mainZepDir.getAbsolutePath());
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_DIR.getVarName(), mainNotebookDir.getAbsolutePath());
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_STORAGE.getVarName(), unsupportedStorageConf);
    SmartsuitesConfiguration conf = SmartsuitesConfiguration.create();
    // create repo
    NotebookRepoSync notebookRepoSync = new NotebookRepoSync(conf);
    // check that first two storages initialized instead of three 
    assertEquals(notebookRepoSync.getRepoCount(), 2);
    assertTrue(notebookRepoSync.getRepo(0) instanceof VFSNotebookRepo);
    assertTrue(notebookRepoSync.getRepo(1) instanceof VFSNotebookRepoMock);
  }

  @Test
  public void initEmptyStorageTest() throws IOException {
    // set confs
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_STORAGE.getVarName(), emptyStorageConf);
    SmartsuitesConfiguration conf = SmartsuitesConfiguration.create();
    // create repo
    NotebookRepoSync notebookRepoSync = new NotebookRepoSync(conf);
    // check initialization of one default storage
    assertEquals(notebookRepoSync.getRepoCount(), 1);
    assertTrue(notebookRepoSync.getRepo(0) instanceof VFSNotebookRepo);
  }
  
  @Test
  public void initOneDummyStorageTest() throws IOException {
 // set confs
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_STORAGE.getVarName(), invalidStorageClass);
    SmartsuitesConfiguration conf = SmartsuitesConfiguration.create();
    // create repo
    NotebookRepoSync notebookRepoSync = new NotebookRepoSync(conf);
    // check initialization of one default storage instead of invalid one
    assertEquals(notebookRepoSync.getRepoCount(), 1);
    assertTrue(notebookRepoSync.getRepo(0) instanceof VFSNotebookRepo);
  }
}