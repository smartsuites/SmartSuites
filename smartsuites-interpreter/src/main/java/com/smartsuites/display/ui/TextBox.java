/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */


package com.smartsuites.display.ui;

import com.smartsuites.display.Input;

/**
 * Html TextBox control
 */
public class TextBox extends Input<String> {

  public TextBox() {

  }

  public TextBox(String name, String defaultValue) {
    this.name = name;
    this.displayName = name;
    this.defaultValue = defaultValue;
  }

}
