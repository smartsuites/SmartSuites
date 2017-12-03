/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import java.util.Properties;

import com.smartsuites.user.AuthenticationInfo;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

//TODO(zjffdu) add more test for Interpreter which is a very important class
public class InterpreterTest {

  @Test
  public void testDefaultProperty() {
    Properties p = new Properties();
    p.put("p1", "v1");
    Interpreter intp = new DummyInterpreter(p);

    assertEquals(1, intp.getProperties().size());
    assertEquals("v1", intp.getProperties().get("p1"));
    assertEquals("v1", intp.getProperty("p1"));
  }

  @Test
  public void testOverriddenProperty() {
    Properties p = new Properties();
    p.put("p1", "v1");
    Interpreter intp = new DummyInterpreter(p);
    Properties overriddenProperty = new Properties();
    overriddenProperty.put("p1", "v2");
    intp.setProperties(overriddenProperty);

    assertEquals(1, intp.getProperties().size());
    assertEquals("v2", intp.getProperties().get("p1"));
    assertEquals("v2", intp.getProperty("p1"));
  }

  @Test
  public void testPropertyWithReplacedContextFields() {
    String noteId = "testNoteId";
    String paragraphTitle = "testParagraphTitle";
    String paragraphText = "testParagraphText";
    String paragraphId = "testParagraphId";
    String user = "username";
    InterpreterContext.set(new InterpreterContext(noteId,
        paragraphId,
        null,
        paragraphTitle,
        paragraphText,
        new AuthenticationInfo("testUser", null, "testTicket"),
        null,
        null,
        null,
        null,
        null,
        null));
    Properties p = new Properties();
    p.put("p1", "replName #{noteId}, #{paragraphTitle}, #{paragraphId}, #{paragraphText}, #{replName}, #{noteId}, #{user}," +
        " #{authenticationInfo}");
    Interpreter intp = new DummyInterpreter(p);
    intp.setUserName(user);
    String actual = intp.getProperty("p1");
    InterpreterContext.remove();

    assertEquals(
        String.format("replName %s, #{paragraphTitle}, #{paragraphId}, #{paragraphText}, , %s, %s, #{authenticationInfo}", noteId,
            noteId, user),
        actual
    );
  }

  public static class DummyInterpreter extends Interpreter {

    public DummyInterpreter(Properties property) {
      super(property);
    }

    @Override
    public void open() {

    }

    @Override
    public void close() {

    }

    @Override
    public InterpreterResult interpret(String st, InterpreterContext context) {
      return null;
    }

    @Override
    public void cancel(InterpreterContext context) {

    }

    @Override
    public FormType getFormType() {
      return null;
    }

    @Override
    public int getProgress(InterpreterContext context) {
      return 0;
    }
  }

}
