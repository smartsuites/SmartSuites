/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

/**
 * Property for instance of interpreter
 */
public class InterpreterProperty {
  private String name;
  private Object value;
  private String type;

  public InterpreterProperty(String name, Object value, String type) {
    this.name = name;
    this.value = value;
    this.type = type;
  }

  public InterpreterProperty(String name, Object value) {
    this.name = name;
    this.value = value;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Object getValue() {
    return value;
  }

  public void setValue(Object value) {
    this.value = value;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  @Override
  public String toString() {
    return String.format("{name=%s, value=%s, type=%s}", name, value, type);
  }
}
