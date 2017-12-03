/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.markdown;

import com.smartsuites.interpreter.InterpreterResult;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.Properties;

import static org.junit.Assert.assertEquals;

public class Markdown4jParserTest {

  Markdown md;

  @Before
  public void setUp() throws Exception {
    Properties props = new Properties();
    props.put(Markdown.MARKDOWN_PARSER_TYPE, Markdown.PARSER_TYPE_MARKDOWN4J);
    md = new Markdown(props);
    md.open();
  }

  @After
  public void tearDown() throws Exception {
    md.close();
  }

  @Test
  public void testStrikethrough() {
    InterpreterResult result = md.interpret("This is ~~deleted~~ text", null);
    assertEquals("<p>This is <s>deleted</s> text</p>\n", result.message().get(0).getData());
  }
}
