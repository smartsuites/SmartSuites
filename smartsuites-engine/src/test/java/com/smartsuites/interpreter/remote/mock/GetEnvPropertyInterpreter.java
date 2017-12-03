/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.interpreter.remote.mock;

import com.smartsuites.interpreter.Interpreter;
import com.smartsuites.interpreter.InterpreterContext;
import com.smartsuites.interpreter.InterpreterResult;
import com.smartsuites.interpreter.thrift.InterpreterCompletion;
import com.smartsuites.scheduler.Scheduler;
import com.smartsuites.scheduler.SchedulerFactory;

import java.util.List;
import java.util.Properties;


public class GetEnvPropertyInterpreter extends Interpreter {

  public GetEnvPropertyInterpreter(Properties property) {
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
    String[] cmd = st.split(" ");
    if (cmd[0].equals("getEnv")) {
      return new InterpreterResult(InterpreterResult.Code.SUCCESS, System.getenv(cmd[1]) == null ? "null" : System.getenv(cmd[1]));
    } else if (cmd[0].equals("getProperty")){
      return new InterpreterResult(InterpreterResult.Code.SUCCESS, System.getProperty(cmd[1]) == null ? "null" : System.getProperty(cmd[1]));
    } else {
      return new InterpreterResult(InterpreterResult.Code.ERROR, cmd[0]);
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

