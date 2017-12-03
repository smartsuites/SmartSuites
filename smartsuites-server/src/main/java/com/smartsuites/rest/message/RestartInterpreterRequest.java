/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest.message;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;

/**
 * RestartInterpreter rest api request message
 */
public class RestartInterpreterRequest implements JsonSerializable {
  private static final Gson gson = new Gson();

  String noteId;

  public RestartInterpreterRequest() {

  }

  public String getNoteId() {
    return noteId;
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public static RestartInterpreterRequest fromJson(String json) {
    return gson.fromJson(json, RestartInterpreterRequest.class);
  }
}
