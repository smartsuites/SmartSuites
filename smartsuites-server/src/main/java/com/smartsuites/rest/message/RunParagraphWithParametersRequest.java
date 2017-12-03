/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest.message;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;

import java.util.Map;

/**
 * RunParagraphWithParametersRequest rest api request message
 */
public class RunParagraphWithParametersRequest implements JsonSerializable {
  private static final Gson gson = new Gson();

  Map<String, Object> params;

  public RunParagraphWithParametersRequest() {

  }

  public Map<String, Object> getParams() {
    return params;
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public static RunParagraphWithParametersRequest fromJson(String json) {
    return gson.fromJson(json, RunParagraphWithParametersRequest.class);
  }
}
