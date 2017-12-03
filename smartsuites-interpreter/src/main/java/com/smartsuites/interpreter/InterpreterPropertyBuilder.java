/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import java.util.HashMap;
import java.util.Map;

/**
 * InterpreterPropertyBuilder
 */
public class InterpreterPropertyBuilder {
  Map<String, DefaultInterpreterProperty> properties = new HashMap<>();

  public InterpreterPropertyBuilder add(String name, String defaultValue, String description){
    properties.put(name,
        new DefaultInterpreterProperty(defaultValue, description));
    return this;
  }

  public InterpreterPropertyBuilder add(String name, String envName, String propertyName,
        String defaultValue, String description){
    properties.put(name,
            new DefaultInterpreterProperty(envName, propertyName, defaultValue, description));
    return this;
  }

  public Map<String, DefaultInterpreterProperty> build(){
    return properties;
  }
}
