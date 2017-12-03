/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.smartsuites.resource.ResourceSet;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicInteger;

public class HeliumTestApplication extends Application {
  private AtomicInteger numRun = new AtomicInteger(0);
  public HeliumTestApplication(ApplicationContext context) {
    super(context);
  }

  @Override
  public void run(ResourceSet args) throws ApplicationException {
    try {
      context().out.clear();
      context().out.write("Hello world " + numRun.incrementAndGet());
      context().out.flush();
    } catch (IOException e) {
      throw new ApplicationException(e);
    }
  }

  @Override
  public void unload() throws ApplicationException {

  }
}
