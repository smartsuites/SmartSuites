/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import com.google.gson.annotations.SerializedName;

import java.util.Map;

/**
 * Information of interpreters in this interpreter setting.
 * this will be serialized for conf/interpreter.json and REST api response.
 */
public class InterpreterInfo {
  private String name;
  @SerializedName("class") private String className;
  private boolean defaultInterpreter = false;
  private Map<String, Object> editor;

  public InterpreterInfo(String className, String name, boolean defaultInterpreter,
      Map<String, Object> editor) {
    this.className = className;
    this.name = name;
    this.defaultInterpreter = defaultInterpreter;
    this.editor = editor;
  }

  public String getName() {
    return name;
  }

  public String getClassName() {
    return className;
  }

  public void setName(String name) {
    this.name = name;
  }

  boolean isDefaultInterpreter() {
    return defaultInterpreter;
  }

  public Map<String, Object> getEditor() {
    return editor;
  }

  public void setEditor(Map<String, Object> editor) {
    this.editor = editor;
  }

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof InterpreterInfo)) {
      return false;
    }
    InterpreterInfo other = (InterpreterInfo) obj;

    boolean sameName =
        null == getName() ? null == other.getName() : getName().equals(other.getName());
    boolean sameClassName = null == getClassName() ?
        null == other.getClassName() :
        getClassName().equals(other.getClassName());
    boolean sameIsDefaultInterpreter = defaultInterpreter == other.isDefaultInterpreter();

    return sameName && sameClassName && sameIsDefaultInterpreter;
  }
}
