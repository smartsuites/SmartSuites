/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo;

import java.util.List;
import java.util.Map;

/**
 * Notebook repo settings. This represent a structure of a notebook repo settings that will mostly
 * used in the frontend.
 *
 */
public class NotebookRepoSettingsInfo {

  /**
   * Type of value, It can be text or list.
   */
  public enum Type {
    INPUT, DROPDOWN
  }

  public static NotebookRepoSettingsInfo newInstance() {
    return new NotebookRepoSettingsInfo();
  }

  public Type type;
  public List<Map<String, String>> value;
  public String selected;
  public String name;
}
