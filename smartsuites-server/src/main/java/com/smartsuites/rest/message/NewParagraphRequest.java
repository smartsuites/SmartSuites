/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest.message;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;

import java.util.HashMap;

/**
 * NewParagraphRequest rest api request message
 *
 * index field will be ignored when it's used to provide initial paragraphs
 * visualization (optional) one of:
 * table,pieChart,multibarChart,stackedAreaChart,lineChart,scatterChart
 * colWidth (optional), e.g. 12.0
 */
public class NewParagraphRequest implements JsonSerializable {
  private static final Gson gson = new Gson();

  String title;
  String text;
  Double index;
  HashMap< String, Object > config;

  public NewParagraphRequest() {

  }

  public String getTitle() {
    return title;
  }

  public String getText() {
    return text;
  }

  public Double getIndex() {
    return index;
  }

  public HashMap< String, Object > getConfig() { return config; }

  public String toJson() {
    return gson.toJson(this);
  }

  public static NewParagraphRequest fromJson(String json) {
    return gson.fromJson(json, NewParagraphRequest.class);
  }
}
