/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

/**
 * WrappedInterpreter
 * 用于获取解析器
 */
public interface WrappedInterpreter {
  public Interpreter getInnerInterpreter();
}
