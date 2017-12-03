/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest.message;

import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;
import com.smartsuites.dep.Dependency;
import com.smartsuites.interpreter.InterpreterOption;
import com.smartsuites.interpreter.InterpreterProperty;

/**
 * UpdateInterpreterSetting rest api request message
 */
public class UpdateInterpreterSettingRequest implements JsonSerializable {
  private static final Gson gson = new Gson();

  Map<String, InterpreterProperty> properties;
  List<Dependency> dependencies;
  InterpreterOption option;

  public UpdateInterpreterSettingRequest(Map<String, InterpreterProperty> properties,
      List<Dependency> dependencies, InterpreterOption option) {
    this.properties = properties;
    this.dependencies = dependencies;
    this.option = option;
  }

  public Map<String, InterpreterProperty> getProperties() {
    return properties;
  }

  public List<Dependency> getDependencies() {
    return dependencies;
  }

  public InterpreterOption getOption() {
    return option;
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public static UpdateInterpreterSettingRequest fromJson(String json) {
    return gson.fromJson(json, UpdateInterpreterSettingRequest.class);
  }
}
