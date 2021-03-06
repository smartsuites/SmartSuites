/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.launcher;

import com.smartsuites.conf.ZeppelinConfiguration;

import java.io.IOException;
import java.util.Properties;

/**
 * Component to Launch interpreter process.
 * 用于启动解析器进程
 */
public abstract class InterpreterLauncher {

  protected ZeppelinConfiguration zConf;
  protected Properties properties;

  public InterpreterLauncher(ZeppelinConfiguration zConf) {
    this.zConf = zConf;
  }

  public abstract  InterpreterClient launch(InterpreterLaunchContext context) throws IOException;
}
