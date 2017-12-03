/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import java.util.ArrayList;
import java.util.List;

/**
 * Types of interpreter properties
 */
public enum InterpreterPropertyType {

  TEXTAREA("textarea"),
  STRING("string"),
  NUMBER("number"),
  URL("url"),
  PASSWORD("password"),
  CHECKBOX("checkbox");

  private String value;

  InterpreterPropertyType(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  public static InterpreterPropertyType byValue(String value) {
    for (InterpreterPropertyType e : values()) {
      if (e.getValue().equals(value)) {
        return e;
      }
    }
    return null;
  }

  public static List<String> getTypes() {
    List<String> types = new ArrayList<>();
    InterpreterPropertyType[] values = values();
    for (InterpreterPropertyType interpreterPropertyType : values) {
      types.add(interpreterPropertyType.getValue());
    }
    return types;
  }
}
