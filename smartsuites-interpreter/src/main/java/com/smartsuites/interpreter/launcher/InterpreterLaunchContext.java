/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.launcher;

import com.smartsuites.interpreter.InterpreterOption;
import com.smartsuites.interpreter.InterpreterRunner;

import java.util.Properties;

/**
 * Context class for Interpreter Launch
 * 解析器启动的上下文配置
 */
public class InterpreterLaunchContext {

  private Properties properties;

  // 解析器启动模式
  private InterpreterOption option;

  // 解析器路径
  private InterpreterRunner runner;

  // 解析器组
  private String interpreterGroupId;
  private String interpreterGroupName;

  public InterpreterLaunchContext(Properties properties,
                                  InterpreterOption option,
                                  InterpreterRunner runner,
                                  String interpreterGroupId,
                                  String interpreterGroupName) {
    this.properties = properties;
    this.option = option;
    this.runner = runner;
    this.interpreterGroupId = interpreterGroupId;
    this.interpreterGroupName = interpreterGroupName;
  }

  public Properties getProperties() {
    return properties;
  }

  public InterpreterOption getOption() {
    return option;
  }

  public InterpreterRunner getRunner() {
    return runner;
  }

  public String getInterpreterGroupId() {
    return interpreterGroupId;
  }

  public String getInterpreterGroupName() {
    return interpreterGroupName;
  }
}
