/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

/**
 *
 */
public class ResultMessages {
  public static final String EXCEEDS_LIMIT_ROWS =
      "<strong>Output is truncated</strong> to %s rows. Learn more about <strong>%s</strong>";
  public static final String EXCEEDS_LIMIT_SIZE =
      "<strong>Output is truncated</strong> to %s bytes. Learn more about <strong>%s</strong>";
  public static final String EXCEEDS_LIMIT =
      "<div class=\"result-alert alert-warning\" role=\"alert\">" +
          "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">" +
          "<span aria-hidden=\"true\">&times;</span></button>" +
          "%s" +
          "</div>";

  public static InterpreterResultMessage getExceedsLimitRowsMessage(int amount, String variable) {
    InterpreterResultMessage message = new InterpreterResultMessage(InterpreterResult.Type.HTML,
        String.format(EXCEEDS_LIMIT, String.format(EXCEEDS_LIMIT_ROWS, amount, variable)));
    return message;
  }

  public static InterpreterResultMessage getExceedsLimitSizeMessage(int amount, String variable) {
    InterpreterResultMessage message = new InterpreterResultMessage(InterpreterResult.Type.HTML,
        String.format(EXCEEDS_LIMIT, String.format(EXCEEDS_LIMIT_SIZE, amount, variable)));
    return message;
  }
}
