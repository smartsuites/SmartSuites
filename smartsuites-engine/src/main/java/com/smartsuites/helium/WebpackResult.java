/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;

/**
 * Represetns webpack json format result
 */
public class WebpackResult implements JsonSerializable {
  private static final Gson gson = new Gson();

  public final String [] errors = new String[0];
  public final String [] warnings = new String[0];

  public String toJson() {
    return gson.toJson(this);
  }

  public static WebpackResult fromJson(String json) {
    return gson.fromJson(json, WebpackResult.class);
  }
}
