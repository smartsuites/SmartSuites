/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.rest.message;

import java.util.Collections;
import java.util.Map;

import com.google.gson.Gson;
import org.apache.commons.lang.StringUtils;
import com.smartsuites.common.JsonSerializable;

/**
 * Represent payload of a notebook repo settings.
 */
public class NotebookRepoSettingsRequest implements JsonSerializable {
  private static final Gson gson = new Gson();

  public static final NotebookRepoSettingsRequest EMPTY = new NotebookRepoSettingsRequest();

  public String name;
  public Map<String, String> settings;

  public NotebookRepoSettingsRequest() {
    name = StringUtils.EMPTY;
    settings = Collections.emptyMap();
  }

  public boolean isEmpty() {
    return this == EMPTY;
  }

  public static boolean isEmpty(NotebookRepoSettingsRequest repoSetting) {
    if (repoSetting == null) {
      return true;
    }
    return repoSetting.isEmpty();
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public static NotebookRepoSettingsRequest fromJson(String json) {
    return gson.fromJson(json, NotebookRepoSettingsRequest.class);
  }
}
