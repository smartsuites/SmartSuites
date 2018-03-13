/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */


package com.smartsuites.interpreter.launcher;

import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.interpreter.InterpreterOption;
import com.smartsuites.interpreter.InterpreterRunner;
import com.smartsuites.interpreter.remote.RemoteInterpreterManagedProcess;
import com.smartsuites.interpreter.remote.RemoteInterpreterRunningProcess;
import com.smartsuites.interpreter.remote.RemoteInterpreterUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Interpreter Launcher which use shell script to launch the interpreter process.
 *
 */
public class ShellScriptLauncher extends InterpreterLauncher {

  private static final Logger LOGGER = LoggerFactory.getLogger(ShellScriptLauncher.class);

  public ShellScriptLauncher(SmartsuitesConfiguration zConf) {
    super(zConf);
  }

  @Override
  public InterpreterClient launch(InterpreterLaunchContext context) {
    LOGGER.info("Launching Interpreter: " + context.getInterpreterGroupName());
    this.properties = context.getProperties();
    InterpreterOption option = context.getOption();
    InterpreterRunner runner = context.getRunner();
    String groupName = context.getInterpreterGroupName();

    int connectTimeout =
        zConf.getInt(SmartsuitesConfiguration.ConfVars.SMARTSUITES_INTERPRETER_CONNECT_TIMEOUT);
    if (option.isExistingProcess()) {
      return new RemoteInterpreterRunningProcess(
          connectTimeout,
          option.getHost(),
          option.getPort());
    } else {
      // create new remote process
      String localRepoPath = zConf.getInterpreterLocalRepoPath() + "/"
          + context.getInterpreterGroupId();
      return new RemoteInterpreterManagedProcess(
          runner != null ? runner.getPath() : zConf.getInterpreterRemoteRunnerPath(),
          zConf.getCallbackPortRange(),
          zConf.getInterpreterDir() + "/" + groupName, localRepoPath,
          buildEnvFromProperties(), connectTimeout, groupName);
    }
  }

  protected Map<String, String> buildEnvFromProperties() {
    Map<String, String> env = new HashMap<>();
    for (Object key : properties.keySet()) {
      if (RemoteInterpreterUtils.isEnvString((String) key)) {
        env.put((String) key, properties.getProperty((String) key));
      }
    }
    return env;
  }
}
