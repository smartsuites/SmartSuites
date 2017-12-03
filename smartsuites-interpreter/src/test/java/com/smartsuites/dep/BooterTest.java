/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.dep;

import org.junit.Test;

import java.nio.file.Paths;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

public class BooterTest {

  @Test
  public void should_return_absolute_path() {
    String resolvedPath = Booter.resolveLocalRepoPath("path");
    assertTrue(Paths.get(resolvedPath).isAbsolute());
  }

  @Test
  public void should_not_change_absolute_path() {
    String absolutePath
        = Paths.get("first", "second").toAbsolutePath().toString();
    String resolvedPath = Booter.resolveLocalRepoPath(absolutePath);

    assertThat(resolvedPath, equalTo(absolutePath));
  }

  @Test(expected = NullPointerException.class)
  public void should_throw_exception_for_null() {
    Booter.resolveLocalRepoPath(null);
  }
}
