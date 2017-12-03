/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;


/**
 * Runtime Exception for interpreters.
 *
 */
public class InterpreterException extends Exception {

  public InterpreterException(Throwable e) {
    super(e);
  }

  public InterpreterException(String m) {
    super(m);
  }

  public InterpreterException(String msg, Throwable t) {
    super(msg, t);
  }

}
