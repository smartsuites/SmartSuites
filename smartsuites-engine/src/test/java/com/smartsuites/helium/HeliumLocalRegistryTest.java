/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.google.gson.Gson;
import com.smartsuites.helium.HeliumLocalRegistry;
import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;

import static org.junit.Assert.assertEquals;

public class HeliumLocalRegistryTest {
  private File tmpDir;

  @Before
  public void setUp() throws Exception {
    tmpDir = new File(System.getProperty("java.io.tmpdir") + "/ZeppelinLTest_" + System.currentTimeMillis());
    tmpDir.mkdirs();
  }

  @After
  public void tearDown() throws IOException {
    FileUtils.deleteDirectory(tmpDir);
  }

  @Test
  public void testGetAllPackage() throws IOException {
    // given
    File r1Path = new File(tmpDir, "r1");
    HeliumLocalRegistry r1 = new HeliumLocalRegistry("r1", r1Path.getAbsolutePath());
    assertEquals(0, r1.getAll().size());

    // when
    Gson gson = new Gson();
    HeliumPackage pkg1 = new HeliumPackage(HeliumType.APPLICATION,
        "app1",
        "desc1",
        "artifact1",
        "classname1",
        new String[][]{},
        "license",
        "");
    FileUtils.writeStringToFile(new File(r1Path, "pkg1.json"), gson.toJson(pkg1));

    // then
    assertEquals(1, r1.getAll().size());
  }
}
