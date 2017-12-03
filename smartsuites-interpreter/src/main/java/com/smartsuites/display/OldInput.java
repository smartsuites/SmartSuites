/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.display;

import com.smartsuites.display.ui.OptionInput.ParamOption;

/**
 * Old Input type.
 * The reason I still keep Old Input is for compatibility. There's one bug in the old input forms.
 * There's 2 ways to create input forms: frontend & backend.
 * The bug is in frontend. The type would not be set correctly when input form
 * is created in frontend (Input.getInputForm).
 */
public class OldInput extends Input<Object> {

  ParamOption[] options;

  public OldInput() {}

  public OldInput(String name, Object defaultValue) {
    this.name = name;
    this.displayName = name;
    this.defaultValue = defaultValue;
  }

  public OldInput(String name, Object defaultValue, ParamOption[] options) {
    this.name = name;
    this.displayName = name;
    this.defaultValue = defaultValue;
    this.options = options;
  }

  @Override
  public boolean equals(Object o) {
    return name.equals(((OldInput) o).getName());
  }

  public ParamOption[] getOptions() {
    return options;
  }

  public void setOptions(ParamOption[] options) {
    this.options = options;
  }

  /**
   *
   */
  public static class OldTextBox extends OldInput {
    public OldTextBox(String name, Object defaultValue) {
      super(name, defaultValue);
    }
  }

  /**
   *
   */
  public static class OldSelect extends OldInput {
    public OldSelect(String name, Object defaultValue, ParamOption[] options) {
      super(name, defaultValue, options);
    }
  }

  /**
   *
   */
  public static class OldCheckBox extends OldInput {
    public OldCheckBox(String name, Object defaultValue, ParamOption[] options) {
      super(name, defaultValue, options);
    }
  }
}
