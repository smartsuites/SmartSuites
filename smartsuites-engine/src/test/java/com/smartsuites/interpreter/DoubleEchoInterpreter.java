/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */


package com.smartsuites.interpreter;

import java.util.Properties;


public class DoubleEchoInterpreter extends Interpreter {

  public DoubleEchoInterpreter(Properties property) {
    super(property);
  }

  @Override
  public void open() {

  }

  @Override
  public void close() {

  }

  @Override
  public InterpreterResult interpret(String st, InterpreterContext context) {
    return new InterpreterResult(InterpreterResult.Code.SUCCESS, st + "," + st);
  }

  @Override
  public void cancel(InterpreterContext context) {

  }

  @Override
  public FormType getFormType() {
    return null;
  }

  @Override
  public int getProgress(InterpreterContext context) {
    return 0;
  }
}
