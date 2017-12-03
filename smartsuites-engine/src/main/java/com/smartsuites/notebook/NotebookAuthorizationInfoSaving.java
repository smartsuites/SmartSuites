/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.notebook;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;

import java.util.Map;
import java.util.Set;

/**
 * Only used for saving NotebookAuthorization info
 */
public class NotebookAuthorizationInfoSaving implements JsonSerializable {

  private static final Gson gson = new Gson();

  public Map<String, Map<String, Set<String>>> authInfo;

  public String toJson() {
    return gson.toJson(this);
  }

  public static NotebookAuthorizationInfoSaving fromJson(String json) {
    return gson.fromJson(json, NotebookAuthorizationInfoSaving.class);
  }
}
