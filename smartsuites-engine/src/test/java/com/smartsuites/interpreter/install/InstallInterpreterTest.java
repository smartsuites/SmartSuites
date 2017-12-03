/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.install;

import com.smartsuites.interpreter.install.InstallInterpreter;
import org.apache.commons.io.FileUtils;
import com.smartsuites.conf.ZeppelinConfiguration;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class InstallInterpreterTest {
  private File tmpDir;
  private InstallInterpreter installer;
  private File interpreterBaseDir;

  @Before
  public void setUp() throws IOException {
    tmpDir = new File(System.getProperty("java.io.tmpdir")+"/ZeppelinLTest_"+System.currentTimeMillis());
    new File(tmpDir, "conf").mkdirs();
    interpreterBaseDir = new File(tmpDir, "interpreter");
    File localRepoDir = new File(tmpDir, "local-repo");
    interpreterBaseDir.mkdir();
    localRepoDir.mkdir();

    File interpreterListFile = new File(tmpDir, "conf/interpreter-list");


    // create interpreter list file
    System.setProperty(ZeppelinConfiguration.ConfVars.ZEPPELIN_HOME.getVarName(), tmpDir.getAbsolutePath());

    String interpreterList = "";
    interpreterList += "intp1   org.apache.commons:commons-csv:1.1   test interpreter 1\n";
    interpreterList += "intp2   org.apache.commons:commons-math3:3.6.1 test interpreter 2\n";

    FileUtils.writeStringToFile(new File(tmpDir, "conf/interpreter-list"), interpreterList);

    installer = new InstallInterpreter(interpreterListFile, interpreterBaseDir, localRepoDir
        .getAbsolutePath());
  }

  @After
  public void tearDown() throws IOException {
    FileUtils.deleteDirectory(tmpDir);
  }


  @Test
  public void testList() {
    assertEquals(2, installer.list().size());
  }

  @Test
  public void install() {
    assertEquals(0, interpreterBaseDir.listFiles().length);

    installer.install("intp1");
    assertTrue(new File(interpreterBaseDir, "intp1").isDirectory());
  }

  @Test
  public void installAll() {
    installer.installAll();
    assertTrue(new File(interpreterBaseDir, "intp1").isDirectory());
    assertTrue(new File(interpreterBaseDir, "intp2").isDirectory());
  }
}
