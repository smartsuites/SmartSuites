/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.display.ui;

/**
 * Html Dropdown list
 */
public class Select extends OptionInput<Object> {

  public Select() {

  }

  public Select(String name, Object defaultValue, ParamOption[] options) {
    this.name = name;
    this.displayName = name;
    this.defaultValue = defaultValue;
    this.options = options;
  }

}
