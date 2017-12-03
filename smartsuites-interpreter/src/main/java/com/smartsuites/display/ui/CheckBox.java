/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */


package com.smartsuites.display.ui;

import java.util.Collection;

/**
 * Html Checkbox
 */
public class CheckBox extends OptionInput<Object[]> {

  public CheckBox() {
  }

  public CheckBox(String name, Object[] defaultValue, ParamOption[] options) {
    this.name = name;
    this.displayName = name;
    this.defaultValue = defaultValue;
    this.options = options;
  }

  public CheckBox(String name, Collection<Object> defaultValue, ParamOption[] options) {
    this(name, defaultValue.toArray(), options);
  }

}
