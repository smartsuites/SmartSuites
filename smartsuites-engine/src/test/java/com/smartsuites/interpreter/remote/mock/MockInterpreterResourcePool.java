/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote.mock;

import com.google.gson.Gson;
import com.smartsuites.interpreter.Interpreter;
import com.smartsuites.interpreter.InterpreterContext;
import com.smartsuites.interpreter.InterpreterResult;
import com.smartsuites.interpreter.InterpreterResult.Code;
import com.smartsuites.interpreter.thrift.InterpreterCompletion;
import com.smartsuites.resource.Resource;
import com.smartsuites.resource.ResourcePool;

import java.util.List;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicInteger;

public class MockInterpreterResourcePool extends Interpreter {

  AtomicInteger numWatch = new AtomicInteger(0);

  public MockInterpreterResourcePool(Properties property) {
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
    String noteId = null;
    String paragraphId = null;
    String name = null;
    if (stmt.length >= 2) {
      String[] npn = stmt[1].split(":");
      if (npn.length >= 3) {
        noteId = npn[0];
        paragraphId = npn[1];
        name = npn[2];
      } else {
        name = stmt[1];
      }
    }
    String value = null;
    if (stmt.length >= 3) {
      value = stmt[2];
    }

    ResourcePool resourcePool = context.getResourcePool();
    Object ret = null;
    if (cmd.equals("put")) {
      resourcePool.put(noteId, paragraphId, name, value);
    } else if (cmd.equalsIgnoreCase("get")) {
      Resource resource = resourcePool.get(noteId, paragraphId, name);
      if (resource != null) {
        ret = resourcePool.get(noteId, paragraphId, name).get();
      } else {
        ret = "";
      }
    } else if (cmd.equals("remove")) {
      ret = resourcePool.remove(noteId, paragraphId, name);
    } else if (cmd.equals("getAll")) {
      ret = resourcePool.getAll();
    } else if (cmd.equals("invoke")) {
      Resource resource = resourcePool.get(noteId, paragraphId, name);
      if (stmt.length >=4) {
        Resource res = resource.invokeMethod(value, null, null, stmt[3]);
        ret = res.get();
      } else {
        ret = resource.invokeMethod(value, null, null);
      }
    }

    try {
      Thread.sleep(500); // wait for watcher executed
    } catch (InterruptedException e) {
    }

    Gson gson = new Gson();
    return new InterpreterResult(Code.SUCCESS, gson.toJson(ret));
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
