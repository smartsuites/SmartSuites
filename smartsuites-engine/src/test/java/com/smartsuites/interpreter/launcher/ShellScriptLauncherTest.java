/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.launcher;

import com.smartsuites.interpreter.launcher.ShellScriptLauncher;
import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.interpreter.InterpreterContext;
import com.smartsuites.interpreter.InterpreterOption;
import com.smartsuites.interpreter.remote.RemoteInterpreterManagedProcess;
import org.junit.Test;

import java.util.Properties;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class ShellScriptLauncherTest {

  @Test
  public void testLauncher() {
    SmartsuitesConfiguration zConf = new SmartsuitesConfiguration();
    ShellScriptLauncher launcher = new ShellScriptLauncher(zConf);
    Properties properties = new Properties();
    properties.setProperty("ENV_1", "VALUE_1");
    properties.setProperty("property_1", "value_1");
    InterpreterOption option = new InterpreterOption();
    InterpreterLaunchContext context = new InterpreterLaunchContext(properties, option, null, "groupId", "groupName");
    InterpreterClient client = launcher.launch(context);
    assertTrue( client instanceof RemoteInterpreterManagedProcess);
    RemoteInterpreterManagedProcess interpreterProcess = (RemoteInterpreterManagedProcess) client;
    assertEquals("groupName", interpreterProcess.getInterpreterGroupName());
    assertEquals(".//interpreter/groupName", interpreterProcess.getInterpreterDir());
    assertEquals(".//local-repo/groupId", interpreterProcess.getLocalRepoDir());
    assertEquals(zConf.getInterpreterRemoteRunnerPath(), interpreterProcess.getInterpreterRunner());
    assertEquals(1, interpreterProcess.getEnv().size());
    assertEquals("VALUE_1", interpreterProcess.getEnv().get("ENV_1"));
  }

}
