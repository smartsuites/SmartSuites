/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.rest.exception;

import static javax.ws.rs.core.Response.Status.FORBIDDEN;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import com.smartsuites.utils.ExceptionUtils;

/**
 * UnauthorizedException handler for WebApplicationException.
 * 
 */
public class ForbiddenException extends WebApplicationException {
  private static final long serialVersionUID = 4394749068760407567L;
  private static final String FORBIDDEN_MSG = "Not allowed to access";

  public ForbiddenException() {
    super(forbiddenJson(FORBIDDEN_MSG));
  }

  private static Response forbiddenJson(String message) {
    return ExceptionUtils.jsonResponseContent(FORBIDDEN, message);
  }
  
  public ForbiddenException(Throwable cause, String message) {
    super(cause, forbiddenJson(message));
  }
  
  public ForbiddenException(String message) {
    super(forbiddenJson(message));
  }

}
