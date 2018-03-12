/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import java.net.URL;
import java.util.List;
import java.util.Properties;

import com.smartsuites.interpreter.thrift.InterpreterCompletion;
import com.smartsuites.scheduler.Scheduler;

/**
 * Add to the classpath interpreters.
 * 可以更改intp的类路径
 */
public class ClassloaderInterpreter
    extends Interpreter
    implements WrappedInterpreter {

  private ClassLoader cl;
  private Interpreter intp;

  public ClassloaderInterpreter(Interpreter intp, ClassLoader cl) {
    super(new Properties());
    this.cl = cl;
    this.intp = intp;
  }

  @Override
  public Interpreter getInnerInterpreter() {
    return intp;
  }

  public ClassLoader getClassloader() {
    return cl;
  }

  @Override
  public InterpreterResult interpret(String st, InterpreterContext context)
      throws InterpreterException {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      return intp.interpret(st, context);
    } catch (InterpreterException e) {
      throw e;
    } catch (Exception e) {
      throw new InterpreterException(e);
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }


  @Override
  public void open() throws InterpreterException {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      intp.open();
    } catch (Exception e) {
      throw new InterpreterException(e);
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public void close() throws InterpreterException {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      intp.close();
    } catch (Exception e) {
      throw new InterpreterException(e);
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public void cancel(InterpreterContext context) throws InterpreterException {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      intp.cancel(context);
    } catch (Exception e) {
      throw new InterpreterException(e);
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public FormType getFormType() throws InterpreterException {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      return intp.getFormType();
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public int getProgress(InterpreterContext context) throws InterpreterException {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      return intp.getProgress(context);
    } catch (Exception e) {
      throw new InterpreterException(e);
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public Scheduler getScheduler() {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      return intp.getScheduler();
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public List<InterpreterCompletion> completion(String buf, int cursor,
                                                InterpreterContext interpreterContext) throws InterpreterException {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      List completion = intp.completion(buf, cursor, interpreterContext);
      return completion;
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }


  @Override
  public String getClassName() {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      return intp.getClassName();
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public void setInterpreterGroup(InterpreterGroup interpreterGroup) {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      intp.setInterpreterGroup(interpreterGroup);
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public InterpreterGroup getInterpreterGroup() {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      return intp.getInterpreterGroup();
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public void setClassloaderUrls(URL [] urls) {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      intp.setClassloaderUrls(urls);
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public URL [] getClassloaderUrls() {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      return intp.getClassloaderUrls();
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public void setProperties(Properties properties) {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      intp.setProperties(properties);
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public Properties getProperties() {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      return intp.getProperties();
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public String getProperty(String key) {
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      return intp.getProperty(key);
    } finally {
      cl = Thread.currentThread().getContextClassLoader();
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }
}
