/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.smartsuites.interpreter.InterpreterContext;
import com.smartsuites.resource.ResourceSet;

/**
 * Mock application
 */
public class MockApplication1 extends Application {
  boolean unloaded;
  int run;

  public MockApplication1(ApplicationContext context) {
    super(context);
    unloaded = false;
    run = 0;
  }

  @Override
  public void run(ResourceSet args) {
    run++;
  }

  @Override
  public void unload() {
    unloaded = true;
  }

  public boolean isUnloaded() {
    return unloaded;
  }

  public int getNumRun() {
    return run;
  }
}
