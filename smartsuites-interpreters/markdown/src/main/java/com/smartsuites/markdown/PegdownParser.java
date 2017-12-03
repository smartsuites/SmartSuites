/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.markdown;

import org.pegdown.Extensions;
import org.pegdown.PegDownProcessor;
import org.pegdown.plugins.PegDownPlugins;

/**
 * Markdown Parser using pegdown processor.
 */
public class PegdownParser implements MarkdownParser {
  private PegDownProcessor processor;

  public static final long PARSING_TIMEOUT_AS_MILLIS = 10000;
  public static final int OPTIONS = Extensions.ALL_WITH_OPTIONALS - Extensions.ANCHORLINKS;

  public PegdownParser() {
    PegDownPlugins plugins = new PegDownPlugins.Builder()
        .withPlugin(PegdownYumlPlugin.class)
        .withPlugin(PegdownWebSequencelPlugin.class)
        .build();
    processor = new PegDownProcessor(OPTIONS, PARSING_TIMEOUT_AS_MILLIS, plugins);
  }

  @Override
  public String render(String markdownText) {
    String html = "";
    String parsed = processor.markdownToHtml(markdownText);

    if (null == parsed) {
      throw new RuntimeException("Cannot parse markdown text to HTML using pegdown");
    }

    html = wrapWithMarkdownClassDiv(parsed);
    return html;
  }

  /**
   * wrap with markdown class div to styling DOM using css.
   */
  public static String wrapWithMarkdownClassDiv(String html) {
    return new StringBuilder()
        .append("<div class=\"markdown-body\">\n")
        .append(html)
        .append("\n</div>")
        .toString();
  }
}
