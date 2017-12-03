/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.user;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;

import java.util.Map;

/**
 * Helper class to save credentials
 * JSON的转换
 */
public class CredentialsInfoSaving implements JsonSerializable {
  private static final Gson gson = new Gson();

  public Map<String, UserCredentials> credentialsMap;

  public String toJson() {
    return gson.toJson(this);
  }

  public static CredentialsInfoSaving fromJson(String json) {
    return gson.fromJson(json, CredentialsInfoSaving.class);
  }
}
