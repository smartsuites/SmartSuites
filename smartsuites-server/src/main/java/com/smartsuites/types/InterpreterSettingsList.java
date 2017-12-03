/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.types;

import java.util.List;

import com.smartsuites.interpreter.InterpreterInfo;

/**
 * InterpreterSetting information for binding
 */
public class InterpreterSettingsList {
  private String id;
  private String name;
  private boolean selected;
  private List<InterpreterInfo> interpreters;

  public InterpreterSettingsList(String id, String name,
      List<InterpreterInfo> interpreters, boolean selected) {
    this.id = id;
    this.name = name;
    this.interpreters = interpreters;
    this.selected = selected;
  }
}
