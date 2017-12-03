/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.helium;

import org.apache.commons.io.FileUtils;
import com.smartsuites.dep.DependencyResolver;
import com.smartsuites.interpreter.InterpreterOutput;
import com.smartsuites.resource.LocalResourcePool;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;

import static org.junit.Assert.*;

public class ApplicationLoaderTest {
  private File tmpDir;

  @Before
  public void setUp() {
    tmpDir = new File(System.getProperty("java.io.tmpdir") + "/ZeppelinLTest_" + System.currentTimeMillis());
    tmpDir.mkdirs();
  }

  @After
  public void tearDown() throws IOException {
    FileUtils.deleteDirectory(tmpDir);
  }

  @Test
  public void loadUnloadApplication() throws Exception {
    // given
    LocalResourcePool resourcePool = new LocalResourcePool("pool1");
    DependencyResolver dep = new DependencyResolver(tmpDir.getAbsolutePath());
    ApplicationLoader appLoader = new ApplicationLoader(resourcePool, dep);

    HeliumPackage pkg1 = createPackageInfo(MockApplication1.class.getName(), "artifact1");
    ApplicationContext context1 = createContext("note1", "paragraph1", "app1");

    // when load application
    MockApplication1 app = (MockApplication1) ((ClassLoaderApplication)
        appLoader.load(pkg1, context1)).getInnerApplication();

    // then
    assertFalse(app.isUnloaded());
    assertEquals(0, app.getNumRun());

    // when unload
    app.unload();

    // then
    assertTrue(app.isUnloaded());
    assertEquals(0, app.getNumRun());
  }

  public HeliumPackage createPackageInfo(String className, String artifact) {
    HeliumPackage app1 = new HeliumPackage(
        HeliumType.APPLICATION,
        "name1",
        "desc1",
        artifact,
        className,
        new String[][]{{}},
        "license",
        "icon");
    return app1;
  }

  public ApplicationContext createContext(String noteId, String paragraphId, String appInstanceId) {
    ApplicationContext context1 = new ApplicationContext(
        noteId,
        paragraphId,
        appInstanceId,
        null,
        new InterpreterOutput(null));
    return context1;
  }
}
