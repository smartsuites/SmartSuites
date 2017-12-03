/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo;

import java.util.Collections;
import java.util.List;

import org.apache.commons.lang.StringUtils;

/**
 * Representation of a notebook repo with settings. This is mostly a Wrapper around notebook repo
 * information plus settings.
 */
public class NotebookRepoWithSettings {

  public static final NotebookRepoWithSettings EMPTY =
      NotebookRepoWithSettings.builder(StringUtils.EMPTY).build();

  public String name;
  public String className;
  public List<NotebookRepoSettingsInfo> settings;

  private NotebookRepoWithSettings() {}

  public static Builder builder(String name) {
    return new Builder(name);
  }

  private NotebookRepoWithSettings(Builder builder) {
    name = builder.name;
    className = builder.className;
    settings = builder.settings;
  }

  public boolean isEmpty() {
    return this.equals(EMPTY);
  }

  /**
   * Simple builder :).
   */
  public static class Builder {
    private final String name;
    private String className = StringUtils.EMPTY;
    private List<NotebookRepoSettingsInfo> settings = Collections.emptyList();

    public Builder(String name) {
      this.name = name;
    }

    public NotebookRepoWithSettings build() {
      return new NotebookRepoWithSettings(this);
    }

    public Builder className(String className) {
      this.className = className;
      return this;
    }

    public Builder settings(List<NotebookRepoSettingsInfo> settings) {
      this.settings = settings;
      return this;
    }
  }
}
