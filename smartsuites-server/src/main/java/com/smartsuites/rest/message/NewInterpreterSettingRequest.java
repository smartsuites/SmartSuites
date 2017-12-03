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
 * NewInterpreterSetting rest api request message
 */
public class NewInterpreterSettingRequest implements JsonSerializable {
  private static final Gson gson = new Gson();
  private String name;
  private String group;

  private Map<String, InterpreterProperty> properties;
  private List<Dependency> dependencies;
  private InterpreterOption option;

  public NewInterpreterSettingRequest() {

  }

  public String getName() {
    return name;
  }

  public String getGroup() {
    return group;
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

  public static NewInterpreterSettingRequest fromJson(String json) {
    return gson.fromJson(json, NewInterpreterSettingRequest.class);
  }
}
