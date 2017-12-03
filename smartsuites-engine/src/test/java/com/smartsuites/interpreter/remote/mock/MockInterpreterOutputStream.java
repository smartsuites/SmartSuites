/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.interpreter.remote.mock;

import com.smartsuites.interpreter.Interpreter;
import com.smartsuites.interpreter.InterpreterContext;
import com.smartsuites.interpreter.InterpreterException;
import com.smartsuites.interpreter.InterpreterResult;
import com.smartsuites.interpreter.thrift.InterpreterCompletion;
import com.smartsuites.scheduler.Scheduler;
import com.smartsuites.scheduler.SchedulerFactory;

import java.io.IOException;
import java.util.List;
import java.util.Properties;

/**
 * MockInterpreter to test outputstream
 */
public class MockInterpreterOutputStream extends Interpreter {
  private String lastSt;

  public MockInterpreterOutputStream(Properties property) {
    super(property);
  }

  @Override
  public void open() {
    //new RuntimeException().printStackTrace();
  }

  @Override
  public void close() {
  }

  public String getLastStatement() {
    return lastSt;
  }

  @Override
  public InterpreterResult interpret(String st, InterpreterContext context)
      throws InterpreterException {
    String[] ret = st.split(":");
    try {
      if (ret[1] != null) {
        context.out.write(ret[1]);
      }
    } catch (IOException e) {
      throw new InterpreterException(e);
    }
    return new InterpreterResult(InterpreterResult.Code.valueOf(ret[0]), (ret.length > 2) ?
            ret[2] : "");
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

  @Override
  public List<InterpreterCompletion> completion(String buf, int cursor,
      InterpreterContext interpreterContext) {
    return null;
  }

  @Override
  public Scheduler getScheduler() {
    return SchedulerFactory.singleton().createOrGetFIFOScheduler("interpreter_" + this.hashCode());
  }
}
