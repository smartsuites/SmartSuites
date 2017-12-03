/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.rest.exception;
import static javax.ws.rs.core.Response.Status.NOT_FOUND;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import com.smartsuites.utils.ExceptionUtils;

/**
 * Not Found handler for WebApplicationException.
 * 
 */
public class NotFoundException extends WebApplicationException {
  private static final long serialVersionUID = 2459398393216512293L;

  /**
   * Create a HTTP 404 (Not Found) exception.
   */
  public NotFoundException() {
    super(ExceptionUtils.jsonResponse(NOT_FOUND));
  }

  /**
   * Create a HTTP 404 (Not Found) exception.
   * @param message the String that is the entity of the 404 response.
   */
  public NotFoundException(String message) {
    super(notFoundJson(message));
  }

  private static Response notFoundJson(String message) {
    return ExceptionUtils.jsonResponseContent(NOT_FOUND, message);
  }

  public NotFoundException(Throwable cause) {
    super(cause, notFoundJson(cause.getMessage()));
  }

  public NotFoundException(Throwable cause, String message) {
    super(cause, notFoundJson(message));
  }

}
