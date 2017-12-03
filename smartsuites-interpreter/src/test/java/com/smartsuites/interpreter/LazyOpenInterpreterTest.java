/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import org.junit.Test;

import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class LazyOpenInterpreterTest {
  Interpreter interpreter = mock(Interpreter.class);

  @Test
  public void isOpenTest() throws InterpreterException {
    InterpreterResult interpreterResult = new InterpreterResult(InterpreterResult.Code.SUCCESS, "");
    when(interpreter.interpret(any(String.class), any(InterpreterContext.class))).thenReturn(interpreterResult);

    LazyOpenInterpreter lazyOpenInterpreter = new LazyOpenInterpreter(interpreter);

    assertFalse("Interpreter is not open", lazyOpenInterpreter.isOpen());
    InterpreterContext interpreterContext =
        new InterpreterContext("note", "id", null, "title", "text", null, null, null, null, null, null, null);
    lazyOpenInterpreter.interpret("intp 1", interpreterContext);
    assertTrue("Interpeter is open", lazyOpenInterpreter.isOpen());
  }
}