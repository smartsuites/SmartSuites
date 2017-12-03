/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.interpreter;

import java.lang.reflect.InvocationTargetException;

/**
 * Interpreter utility functions
 */
public class InterpreterUtils {

  public static String getMostRelevantMessage(Exception ex) {
    if (ex instanceof InvocationTargetException) {
      Throwable cause = ((InvocationTargetException) ex).getCause();
      if (cause != null) {
        return cause.getMessage();
      }
    }
    return ex.getMessage();
  }
}
