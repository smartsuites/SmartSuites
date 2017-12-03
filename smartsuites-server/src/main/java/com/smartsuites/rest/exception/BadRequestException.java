/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest.exception;

import com.smartsuites.utils.ExceptionUtils;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;

/**
 * BadRequestException handler for WebApplicationException.
 */
public class BadRequestException extends WebApplicationException {

  public BadRequestException() {
    super(ExceptionUtils.jsonResponse(BAD_REQUEST));
  }

  private static Response badRequestJson(String message) {
    return ExceptionUtils.jsonResponseContent(BAD_REQUEST, message);
  }

  public BadRequestException(Throwable cause, String message) {
    super(cause, badRequestJson(message));
  }

  public BadRequestException(String message) {
    super(badRequestJson(message));
  }
}
