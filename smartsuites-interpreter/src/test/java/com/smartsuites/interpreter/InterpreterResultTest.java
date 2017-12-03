/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import org.junit.Test;


public class InterpreterResultTest {

  @Test
  public void testTextType() {

    InterpreterResult result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "this is a TEXT type");
    assertEquals("No magic", InterpreterResult.Type.TEXT, result.message().get(0).getType());
    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "%this is a TEXT type");
    assertEquals("No magic", InterpreterResult.Type.TEXT, result.message().get(0).getType());
    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "%\n");
    assertEquals("No magic", InterpreterResult.Type.TEXT, result.message().get(0).getType());
  }

  @Test
  public void testSimpleMagicType() {
    InterpreterResult result = null;

    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "%table col1\tcol2\naaa\t123\n");
    assertEquals(InterpreterResult.Type.TABLE, result.message().get(0).getType());
    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "%table\ncol1\tcol2\naaa\t123\n");
    assertEquals(InterpreterResult.Type.TABLE, result.message().get(0).getType());
    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "some text before magic word\n%table col1\tcol2\naaa\t123\n");
    assertEquals(InterpreterResult.Type.TABLE, result.message().get(1).getType());
  }

  public void testComplexMagicType() {
    InterpreterResult result = null;

    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "some text before %table col1\tcol2\naaa\t123\n");
    assertEquals("some text before magic return magic", InterpreterResult.Type.TABLE, result.message().get(0).getType());
    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "%html  <h3> This is a hack </h3> %table\n col1\tcol2\naaa\t123\n");
    assertEquals("magic A before magic B return magic A", InterpreterResult.Type.HTML, result.message().get(0).getType());
    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "some text before magic word %table col1\tcol2\naaa\t123\n %html  <h3> This is a hack </h3>");
    assertEquals("text & magic A before magic B return magic A", InterpreterResult.Type.TABLE, result.message().get(0).getType());
    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "%table col1\tcol2\naaa\t123\n %html  <h3> This is a hack </h3> %table col1\naaa\n123\n");
    assertEquals("magic A, magic B, magic a' return magic A", InterpreterResult.Type.TABLE, result.message().get(0).getType());
  }

  @Test
  public void testSimpleMagicData() {

    InterpreterResult result = null;

    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "%table col1\tcol2\naaa\t123\n");
    assertEquals("%table col1\tcol2\naaa\t123\n", "col1\tcol2\naaa\t123\n", result.message().get(0).getData());
    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "%table\ncol1\tcol2\naaa\t123\n");
    assertEquals("%table\ncol1\tcol2\naaa\t123\n", "col1\tcol2\naaa\t123\n", result.message().get(0).getData());
    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "some text before magic word\n%table col1\tcol2\naaa\t123\n");
    assertEquals("some text before magic word\n%table col1\tcol2\naaa\t123\n", "col1\tcol2\naaa\t123\n", result.message().get(1).getData());
  }

  @Test
  public void testComplexMagicData() {

    InterpreterResult result = null;

    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "some text before\n%table col1\tcol2\naaa\t123\n");
    assertEquals("text before %table", "some text before\n", result.message().get(0).getData());
    assertEquals("text after %table", "col1\tcol2\naaa\t123\n", result.message().get(1).getData());
    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "%html  <h3> This is a hack </h3>\n%table\ncol1\tcol2\naaa\t123\n");
    assertEquals(" <h3> This is a hack </h3>\n", result.message().get(0).getData());
    assertEquals("col1\tcol2\naaa\t123\n", result.message().get(1).getData());
    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "some text before magic word\n%table col1\tcol2\naaa\t123\n\n%html <h3> This is a hack </h3>");
    assertEquals("<h3> This is a hack </h3>", result.message().get(2).getData());
    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "%table col1\tcol2\naaa\t123\n\n%html  <h3> This is a hack </h3>\n%table col1\naaa\n123\n");
    assertEquals("col1\naaa\n123\n", result.message().get(2).getData());
    result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "%table " + "col1\tcol2\naaa\t123\n\n%table col1\naaa\n123\n");
    assertEquals("col1\tcol2\naaa\t123\n", result.message().get(0).getData());
    assertEquals("col1\naaa\n123\n", result.message().get(1).getData());
  }

  @Test
  public void testToString() {
    assertEquals("%html hello", new InterpreterResult(InterpreterResult.Code.SUCCESS, "%html hello").toString());
  }

}
