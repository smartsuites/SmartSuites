/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */


package com.smartsuites.display.ui;

import com.smartsuites.display.Input;

/**
 * Base class for Input with options
 *
 * @param <T>
 */
public abstract class OptionInput<T> extends Input<T> {

  /**
   * Parameters option.
   */
  public static class ParamOption {
    Object value;
    String displayName;

    public ParamOption(Object value, String displayName) {
      super();
      this.value = value;
      this.displayName = displayName;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) return true;
      if (o == null || getClass() != o.getClass()) return false;

      ParamOption that = (ParamOption) o;

      if (value != null ? !value.equals(that.value) : that.value != null) return false;
      return displayName != null ? displayName.equals(that.displayName) : that.displayName == null;

    }

    @Override
    public int hashCode() {
      int result = value != null ? value.hashCode() : 0;
      result = 31 * result + (displayName != null ? displayName.hashCode() : 0);
      return result;
    }

    public Object getValue() {
      return value;
    }

    public void setValue(Object value) {
      this.value = value;
    }

    public String getDisplayName() {
      return displayName;
    }

    public void setDisplayName(String displayName) {
      this.displayName = displayName;
    }

  }

  protected ParamOption[] options;

  public ParamOption[] getOptions() {
    return options;
  }
}
