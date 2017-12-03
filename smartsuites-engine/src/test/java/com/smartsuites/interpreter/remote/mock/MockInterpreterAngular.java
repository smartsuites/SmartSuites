/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote.mock;

import com.smartsuites.display.AngularObjectRegistry;
import com.smartsuites.display.AngularObjectWatcher;
import com.smartsuites.interpreter.Interpreter;
import com.smartsuites.interpreter.InterpreterContext;
import com.smartsuites.interpreter.InterpreterResult;
import com.smartsuites.interpreter.InterpreterResult.Code;
import com.smartsuites.interpreter.thrift.InterpreterCompletion;

import java.util.List;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicInteger;

public class MockInterpreterAngular extends Interpreter {

  AtomicInteger numWatch = new AtomicInteger(0);

  public MockInterpreterAngular(Properties property) {
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
    String[] stmt = st.split(" ");
    String cmd = stmt[0];
    String name = null;
    if (stmt.length >= 2) {
      name = stmt[1];
    }
    String value = null;
    if (stmt.length == 3) {
      value = stmt[2];
    }

    AngularObjectRegistry registry = context.getAngularObjectRegistry();

    if (cmd.equals("add")) {
      registry.add(name, value, context.getNoteId(), null);
      registry.get(name, context.getNoteId(), null).addWatcher(new AngularObjectWatcher
              (null) {

        @Override
        public void watch(Object oldObject, Object newObject,
            InterpreterContext context) {
          numWatch.incrementAndGet();
        }

      });
    } else if (cmd.equalsIgnoreCase("update")) {
      registry.get(name, context.getNoteId(), null).set(value);
    } else if (cmd.equals("remove")) {
      registry.remove(name, context.getNoteId(), null);
    }

    try {
      Thread.sleep(500); // wait for watcher executed
    } catch (InterruptedException e) {
      logger.error("Exception in MockInterpreterAngular while interpret Thread.sleep", e);
    }

    String msg = registry.getAll(context.getNoteId(), null).size() + " " + Integer.toString(numWatch
            .get());
    return new InterpreterResult(Code.SUCCESS, msg);
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
}
