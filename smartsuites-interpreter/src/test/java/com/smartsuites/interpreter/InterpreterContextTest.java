/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import static org.junit.Assert.*;

import org.junit.Test;

public class InterpreterContextTest {

  @Test
  public void testThreadLocal() {
    assertNull(InterpreterContext.get());

    InterpreterContext.set(new InterpreterContext(null, null, null, null, null, null, null, null, null, null, null, null));
    assertNotNull(InterpreterContext.get());

    InterpreterContext.remove();
    assertNull(InterpreterContext.get());
  }

}
