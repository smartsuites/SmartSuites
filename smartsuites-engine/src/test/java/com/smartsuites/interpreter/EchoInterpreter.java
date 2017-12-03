/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */


package com.smartsuites.interpreter;

import java.util.Properties;

/**
 * Just return the received statement back
 */
public class EchoInterpreter extends Interpreter {

  public EchoInterpreter(Properties property) {
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
    if (Boolean.parseBoolean(getProperty("zeppelin.interpreter.echo.fail", "false"))) {
      return new InterpreterResult(InterpreterResult.Code.ERROR);
    } else {
      return new InterpreterResult(InterpreterResult.Code.SUCCESS, st);
    }
  }

  @Override
  public void cancel(InterpreterContext context) {

  }

  @Override
  public FormType getFormType() {
    return FormType.NATIVE;
  }

  @Override
  public int getProgress(InterpreterContext context) {
    return 0;
  }
}
