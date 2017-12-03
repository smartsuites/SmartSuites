/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;

import java.util.Map;

/**
 * To read package.json
 */
public class NpmPackage implements JsonSerializable {
  private static final Gson gson = new Gson();

  public String name;
  public String version;
  public Map<String, String> dependencies;

  public String toJson() {
    return gson.toJson(this);
  }

  public static NpmPackage fromJson(String json) {
    return gson.fromJson(json, NpmPackage.class);
  }
}
