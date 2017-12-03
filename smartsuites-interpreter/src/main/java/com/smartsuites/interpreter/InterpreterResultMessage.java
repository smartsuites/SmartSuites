/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.interpreter;

import java.io.Serializable;

/**
 * Interpreter result message
 */
public class InterpreterResultMessage implements Serializable {
  InterpreterResult.Type type;
  String data;

  public InterpreterResultMessage(InterpreterResult.Type type, String data) {
    this.type = type;
    this.data = data;
  }

  public InterpreterResult.Type getType() {
    return type;
  }

  public String getData() {
    return data;
  }

  public String toString() {
    return "%" + type.name().toLowerCase() + " " + data;
  }
}
