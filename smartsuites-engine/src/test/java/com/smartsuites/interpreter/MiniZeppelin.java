/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import org.apache.commons.io.FileUtils;
import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.display.AngularObjectRegistryListener;
import com.smartsuites.helium.ApplicationEventListener;
import com.smartsuites.interpreter.remote.RemoteInterpreterProcessListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;

import static org.mockito.Mockito.mock;

public class MiniZeppelin {

  protected static final Logger LOGGER = LoggerFactory.getLogger(MiniZeppelin.class);

  protected InterpreterSettingManager interpreterSettingManager;
  protected InterpreterFactory interpreterFactory;
  protected File zeppelinHome;
  private File confDir;
  private File notebookDir;
  protected SmartsuitesConfiguration conf;

  public void start() throws IOException {
    zeppelinHome = new File("..");
    System.setProperty(SmartsuitesConfiguration.ConfVars.SMARTSUITES_HOME.getVarName(),
        zeppelinHome.getAbsolutePath());
    confDir = new File(zeppelinHome, "conf_" + getClass().getSimpleName());
    notebookDir = new File(zeppelinHome, "notebook_" + getClass().getSimpleName());
    confDir.mkdirs();
    notebookDir.mkdirs();
    LOGGER.info("ZEPPELIN_HOME: " + zeppelinHome.getAbsolutePath());
    FileUtils.copyFile(new File(zeppelinHome, "conf/log4j.properties"), new File(confDir, "log4j.properties"));
    FileUtils.copyFile(new File(zeppelinHome, "conf/log4j_yarn_cluster.properties"), new File(confDir, "log4j_yarn_cluster.properties"));
    System.setProperty(SmartsuitesConfiguration.ConfVars.SMARTSUITES_CONF_DIR.getVarName(), confDir.getAbsolutePath());
    System.setProperty(SmartsuitesConfiguration.ConfVars.SMARTSUITES_NOTEBOOK_DIR.getVarName(), notebookDir.getAbsolutePath());
    conf = new SmartsuitesConfiguration();
    interpreterSettingManager = new InterpreterSettingManager(conf,
        mock(AngularObjectRegistryListener.class), mock(RemoteInterpreterProcessListener.class), mock(ApplicationEventListener.class));
    interpreterFactory = new InterpreterFactory(interpreterSettingManager);
  }

  public void stop() throws IOException {
    interpreterSettingManager.close();
    FileUtils.deleteDirectory(confDir);
    FileUtils.deleteDirectory(notebookDir);
  }

  public File getZeppelinHome() {
    return zeppelinHome;
  }

  public File getZeppelinConfDir() {
    return confDir;
  }

  public InterpreterFactory getInterpreterFactory() {
    return interpreterFactory;
  }

  public InterpreterSettingManager getInterpreterSettingManager() {
    return interpreterSettingManager;
  }
}
