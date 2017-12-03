/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.markdown;

import org.markdown4j.Markdown4jProcessor;

import java.io.IOException;

/**
 * Markdown Parser using markdown4j processor.
 */
public class Markdown4jParser implements MarkdownParser {
  private Markdown4jProcessor processor;

  public Markdown4jParser() {
    processor = new Markdown4jProcessor();
  }

  @Override
  public String render(String markdownText) {
    String html = "";

    try {
      html = processor.process(markdownText);
    } catch (IOException e) {
      // convert checked exception to non-checked exception
      throw new RuntimeException(e);
    }

    return html;
  }
}
