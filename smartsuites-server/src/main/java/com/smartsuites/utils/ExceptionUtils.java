/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.utils;

import javax.ws.rs.core.Response.Status;

import com.smartsuites.server.JsonResponse;

/**
 * Utility method for exception in rest api.
 *
 */
public class ExceptionUtils {

  public static javax.ws.rs.core.Response jsonResponse(Status status) {
    return new JsonResponse<>(status).build();
  }
  
  public static javax.ws.rs.core.Response jsonResponseContent(Status status, String message) {
    return new JsonResponse<>(status, message).build();
  }
}
