/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import org.apache.commons.io.FileUtils;
import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.display.AngularObjectRegistryListener;
import com.smartsuites.helium.ApplicationEventListener;
import com.smartsuites.interpreter.remote.RemoteInterpreterProcessListener;
import org.junit.After;
import org.junit.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;

import static org.mockito.Mockito.mock;


/**
 * This class will load configuration files under
 *   src/test/resources/interpreter
 *   src/test/resources/conf
 *
 * to construct InterpreterSettingManager and InterpreterFactory properly
 *
 */
public abstract class AbstractInterpreterTest {
  protected static final Logger LOGGER = LoggerFactory.getLogger(AbstractInterpreterTest.class);

  protected InterpreterSettingManager interpreterSettingManager;
  protected InterpreterFactory interpreterFactory;
  protected File zeppelinHome;
  protected File interpreterDir;
  protected File confDir;
  protected File notebookDir;
  protected SmartsuitesConfiguration conf = new SmartsuitesConfiguration();

  @Before
  public void setUp() throws Exception {
    // copy the resources files to a temp folder
    zeppelinHome = new File("..");
    LOGGER.info("ZEPPELIN_HOME: " + zeppelinHome.getAbsolutePath());
    interpreterDir = new File(zeppelinHome, "interpreter_" + getClass().getSimpleName());
    confDir = new File(zeppelinHome, "conf_" + getClass().getSimpleName());
    notebookDir = new File(zeppelinHome, "notebook_" + getClass().getSimpleName());

    interpreterDir.mkdirs();
    confDir.mkdirs();
    notebookDir.mkdirs();

    FileUtils.copyDirectory(new File("src/test/resources/interpreter"), interpreterDir);
    FileUtils.copyDirectory(new File("src/test/resources/conf"), confDir);

    System.setProperty(SmartsuitesConfiguration.ConfVars.SMARTSUITES_HOME.getVarName(), zeppelinHome.getAbsolutePath());
    System.setProperty(SmartsuitesConfiguration.ConfVars.SMARTSUITES_CONF_DIR.getVarName(), confDir.getAbsolutePath());
    System.setProperty(SmartsuitesConfiguration.ConfVars.SMARTSUITES_INTERPRETER_DIR.getVarName(), interpreterDir.getAbsolutePath());
    System.setProperty(SmartsuitesConfiguration.ConfVars.SMARTSUITES_NOTEBOOK_DIR.getVarName(), notebookDir.getAbsolutePath());
    System.setProperty(SmartsuitesConfiguration.ConfVars.SMARTSUITES_INTERPRETER_GROUP_ORDER.getVarName(), "test,mock1,mock2,mock_resource_pool");

    conf = new SmartsuitesConfiguration();
    interpreterSettingManager = new InterpreterSettingManager(conf,
        mock(AngularObjectRegistryListener.class), mock(RemoteInterpreterProcessListener.class), mock(ApplicationEventListener.class));
    interpreterFactory = new InterpreterFactory(interpreterSettingManager);
  }

  @After
  public void tearDown() throws Exception {
    interpreterSettingManager.close();
    FileUtils.deleteDirectory(interpreterDir);
    FileUtils.deleteDirectory(confDir);
    FileUtils.deleteDirectory(notebookDir);
  }
}
