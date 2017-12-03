/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.display;

import com.smartsuites.interpreter.InterpreterContext;

/**
 *
 */
public abstract class AngularObjectWatcher {
  private InterpreterContext context;

  public AngularObjectWatcher(InterpreterContext context) {
    this.context = context;
  }

  void watch(Object oldObject, Object newObject) {
    watch(oldObject, newObject, context);
  }

  public abstract void watch(Object oldObject, Object newObject, InterpreterContext context);
}
