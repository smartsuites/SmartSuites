/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.notebook;

import java.util.HashMap;
import java.util.Map;

/**
 *
 */
public class NoteInfo {
  String id;
  String name;
  private Map<String, Object> config = new HashMap<>();

  public NoteInfo(String id, String name, Map<String, Object> config) {
    super();
    this.id = id;
    this.name = name;
    this.config = config;
  }

  public NoteInfo(Note note) {
    id = note.getId();
    name = note.getName();
    config = note.getConfig();
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Map<String, Object> getConfig() {
    return config;
  }

  public void setConfig(Map<String, Object> config) {
    this.config = config;
  }

}
