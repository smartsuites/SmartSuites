/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote.mock;

import com.smartsuites.interpreter.Interpreter;
import com.smartsuites.interpreter.InterpreterContext;
import com.smartsuites.interpreter.InterpreterException;
import com.smartsuites.interpreter.InterpreterResult;
import com.smartsuites.interpreter.InterpreterResult.Code;
import com.smartsuites.interpreter.thrift.InterpreterCompletion;
import com.smartsuites.scheduler.Scheduler;
import com.smartsuites.scheduler.SchedulerFactory;

import java.util.List;
import java.util.Properties;

public class MockInterpreterA extends Interpreter {

  private String lastSt;

  public MockInterpreterA(Properties property) {
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
    if (getProperties().containsKey("progress")) {
      context.setProgress(Integer.parseInt(getProperty("progress")));
    }
    try {
      Thread.sleep(Long.parseLong(st));
      this.lastSt = st;
    } catch (NumberFormatException | InterruptedException e) {
      throw new InterpreterException(e);
    }
    return new InterpreterResult(Code.SUCCESS, st);
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
    if (getProperty("parallel") != null && getProperty("parallel").equals("true")) {
      return SchedulerFactory.singleton().createOrGetParallelScheduler("interpreter_" + this.hashCode(), 10);
    } else {
      return SchedulerFactory.singleton().createOrGetFIFOScheduler("interpreter_" + this.hashCode());
    }
  }
}
