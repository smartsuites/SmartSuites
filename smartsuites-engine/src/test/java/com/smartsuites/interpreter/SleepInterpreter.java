/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import com.smartsuites.scheduler.Scheduler;
import com.smartsuites.scheduler.SchedulerFactory;

import java.util.Properties;

/**
 * Interpreter that only accept long value and sleep for such period
 */
public class SleepInterpreter extends Interpreter {

  public SleepInterpreter(Properties property) {
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
    try {
      Thread.sleep(Long.parseLong(st));
      return new InterpreterResult(InterpreterResult.Code.SUCCESS);
    } catch (Exception e) {
      return new InterpreterResult(InterpreterResult.Code.ERROR, e.getMessage());
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
  public Scheduler getScheduler() {
    if (Boolean.parseBoolean(getProperty("zeppelin.SleepInterpreter.parallel", "false"))) {
      return SchedulerFactory.singleton().createOrGetParallelScheduler(
          "Parallel-" + SleepInterpreter.class.getName(), 10);
    }
    return super.getScheduler();
  }

  @Override
  public int getProgress(InterpreterContext context) {
    return 0;
  }
}
