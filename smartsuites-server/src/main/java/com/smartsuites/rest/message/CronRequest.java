/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest.message;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;
import com.smartsuites.interpreter.InterpreterOption;

/**
 *  CronRequest rest api request message
 *
 */
public class CronRequest implements JsonSerializable {
  private static final Gson gson = new Gson();

  String cron;

  public CronRequest (){

  }

  public String getCronString() {
    return cron;
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public static CronRequest fromJson(String json) {
    return gson.fromJson(json, CronRequest.class);
  }
}
