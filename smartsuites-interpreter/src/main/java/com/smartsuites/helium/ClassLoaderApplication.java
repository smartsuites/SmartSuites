/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.smartsuites.resource.ResourceSet;

/**
 * Application wrapper
 */
public class ClassLoaderApplication extends Application {
  Application app;
  ClassLoader cl;
  public ClassLoaderApplication(Application app, ClassLoader cl) throws ApplicationException {
    super(app.context());
    this.app = app;
    this.cl = cl;
  }

  @Override
  public void run(ResourceSet args) throws ApplicationException {
    // instantiate
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      app.run(args);
    } catch (ApplicationException e) {
      throw e;
    } catch (Exception e) {
      throw new ApplicationException(e);
    } finally {
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  @Override
  public void unload() throws ApplicationException {
    // instantiate
    ClassLoader oldcl = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(cl);
    try {
      app.unload();
    } catch (ApplicationException e) {
      throw e;
    } catch (Exception e) {
      throw new ApplicationException(e);
    } finally {
      Thread.currentThread().setContextClassLoader(oldcl);
    }
  }

  public ClassLoader getClassLoader() {
    return cl;
  }

  public Application getInnerApplication() {
    return app;
  }
}
