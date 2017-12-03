/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.display;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.smartsuites.display.ui.CheckBox;
import com.smartsuites.display.ui.TextBox;
import com.smartsuites.display.ui.OptionInput.ParamOption;
import com.smartsuites.display.ui.Select;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;


/**
 * Settings of a form.
 */
public class GUI implements Serializable {

  private static Gson gson = new GsonBuilder()
      .registerTypeAdapterFactory(Input.TypeAdapterFactory)
      .create();

  Map<String, Object> params = new HashMap<>(); // form parameters from client
  LinkedHashMap<String, Input> forms = new LinkedHashMap<>(); // form configuration

  public GUI() {

  }

  public void setParams(Map<String, Object> values) {
    this.params = values;
  }

  public Map<String, Object> getParams() {
    return params;
  }

  public LinkedHashMap<String, Input> getForms() {
    return forms;
  }

  public void setForms(LinkedHashMap<String, Input> forms) {
    this.forms = forms;
  }

  @Deprecated
  public Object input(String id) {
    return textbox(id, "");
  }

  @Deprecated
  public Object input(String id, Object defaultValue) {
    return textbox(id, defaultValue.toString());
  }

  public Object textbox(String id, String defaultValue) {
    // first find values from client and then use default
    Object value = params.get(id);
    if (value == null) {
      value = defaultValue;
    }

    forms.put(id, new TextBox(id, defaultValue));
    return value;
  }

  public Object textbox(String id) {
    return textbox(id, "");
  }

  public Object select(String id, Object defaultValue, ParamOption[] options) {
    Object value = params.get(id);
    if (value == null) {
      value = defaultValue;
    }
    forms.put(id, new Select(id, defaultValue, options));
    return value;
  }

  public List<Object> checkbox(String id, Collection<Object> defaultChecked,
                               ParamOption[] options) {
    Collection<Object> checked = (Collection<Object>) params.get(id);
    if (checked == null) {
      checked = defaultChecked;
    }
    forms.put(id, new CheckBox(id, defaultChecked, options));
    List<Object> filtered = new LinkedList<>();
    for (Object o : checked) {
      if (isValidOption(o, options)) {
        filtered.add(o);
      }
    }
    return filtered;
  }

  private boolean isValidOption(Object o, ParamOption[] options) {
    for (ParamOption option : options) {
      if (o.equals(option.getValue())) {
        return true;
      }
    }
    return false;
  }

  public void clear() {
    this.forms = new LinkedHashMap<>();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    GUI gui = (GUI) o;

    if (params != null ? !params.equals(gui.params) : gui.params != null) {
      return false;
    }
    return forms != null ? forms.equals(gui.forms) : gui.forms == null;

  }

  @Override
  public int hashCode() {
    int result = params != null ? params.hashCode() : 0;
    result = 31 * result + (forms != null ? forms.hashCode() : 0);
    return result;
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public void convertOldInput() {
    for (Map.Entry<String, Input> entry : forms.entrySet()) {
      if (entry.getValue() instanceof OldInput) {
        Input convertedInput = convertFromOldInput((OldInput) entry.getValue());
        forms.put(entry.getKey(), convertedInput);
      }
    }
  }

  public static GUI fromJson(String json) {
    GUI gui = gson.fromJson(json, GUI.class);
    gui.convertOldInput();
    return gui;
  }

  private Input convertFromOldInput(OldInput oldInput) {
    Input convertedInput = null;

    if (oldInput.options == null || oldInput instanceof OldInput.OldTextBox) {
      convertedInput = new TextBox(oldInput.name, oldInput.defaultValue.toString());
    } else if (oldInput instanceof OldInput.OldCheckBox) {
      convertedInput = new CheckBox(oldInput.name, (List) oldInput.defaultValue, oldInput.options);
    } else if (oldInput instanceof OldInput && oldInput.options != null) {
      convertedInput = new Select(oldInput.name, oldInput.defaultValue, oldInput.options);
    } else {
      throw new RuntimeException("Can not convert this OldInput.");
    }
    convertedInput.setDisplayName(oldInput.getDisplayName());
    convertedInput.setHidden(oldInput.isHidden());
    convertedInput.setArgument(oldInput.getArgument());
    return convertedInput;
  }
}
