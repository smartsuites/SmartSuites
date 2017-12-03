/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.markdown;

import java.util.List;
import java.util.Properties;

import com.smartsuites.interpreter.Interpreter;
import com.smartsuites.interpreter.InterpreterContext;
import com.smartsuites.interpreter.InterpreterPropertyBuilder;
import com.smartsuites.interpreter.InterpreterResult;
import com.smartsuites.interpreter.InterpreterResult.Code;
import com.smartsuites.interpreter.InterpreterUtils;
import com.smartsuites.interpreter.thrift.InterpreterCompletion;
import com.smartsuites.scheduler.Scheduler;
import com.smartsuites.scheduler.SchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * MarkdownInterpreter interpreter for Zeppelin.
 */
public class Markdown extends Interpreter {
  private static final Logger LOGGER = LoggerFactory.getLogger(Markdown.class);

  private MarkdownParser parser;

  /**
   * Markdown Parser Type.
   */
  public enum MarkdownParserType {
    PEGDOWN {
      @Override
      public String toString() {
        return PARSER_TYPE_PEGDOWN;
      }
    },

    MARKDOWN4j {
      @Override
      public String toString() {
        return PARSER_TYPE_MARKDOWN4J;
      }
    }
  }

  public static final String MARKDOWN_PARSER_TYPE = "markdown.parser.type";
  public static final String PARSER_TYPE_PEGDOWN = "pegdown";
  public static final String PARSER_TYPE_MARKDOWN4J = "markdown4j";

  public Markdown(Properties property) {
    super(property);
  }

  public static MarkdownParser createMarkdownParser(String parserType) {
    LOGGER.debug("Creating " + parserType + " markdown interpreter");

    if (MarkdownParserType.PEGDOWN.toString().equals(parserType)) {
      return new PegdownParser();
    } else {
      /** default parser. */
      return new Markdown4jParser();
    }
  }

  @Override
  public void open() {
    String parserType = getProperty(MARKDOWN_PARSER_TYPE);
    parser = createMarkdownParser(parserType);
  }

  @Override
  public void close() {
  }

  @Override
  public InterpreterResult interpret(String markdownText, InterpreterContext interpreterContext) {
    String html;

    try {
      html = parser.render(markdownText);
    } catch (RuntimeException e) {
      LOGGER.error("Exception in MarkdownInterpreter while interpret ", e);
      return new InterpreterResult(Code.ERROR, InterpreterUtils.getMostRelevantMessage(e));
    }

    return new InterpreterResult(Code.SUCCESS, "%html " + html);
  }

  @Override
  public void cancel(InterpreterContext context) {
  }

  @Override
  public FormType getFormType() {
    return FormType.SIMPLE;
  }

  @Override
  public int getProgress(InterpreterContext context) {
    return 0;
  }

  @Override
  public Scheduler getScheduler() {
    return SchedulerFactory.singleton()
        .createOrGetParallelScheduler(Markdown.class.getName() + this.hashCode(), 5);
  }

  @Override
  public List<InterpreterCompletion> completion(String buf, int cursor,
      InterpreterContext interpreterContext) {
    return null;
  }
}
