/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import com.google.gson.annotations.SerializedName;

/**
 * Interpreter runner path
 * 解析器的执行路径
 */
public class InterpreterRunner {

  @SerializedName("linux")
  private String linuxPath;
  @SerializedName("win")
  private String winPath;

  public InterpreterRunner() {

  }

  public InterpreterRunner(String linuxPath, String winPath) {
    this.linuxPath = linuxPath;
    this.winPath = winPath;
  }

  public String getPath() {
    return System.getProperty("os.name").startsWith("Windows") ? winPath : linuxPath;
  }
}
