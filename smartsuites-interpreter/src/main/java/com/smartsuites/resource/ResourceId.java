/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.resource;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;

/**
 * Identifying resource
 * notebook
 */
public class ResourceId implements JsonSerializable {
  private static final Gson gson = new Gson();

  private final String resourcePoolId;
  private final String name;
  private final String noteId;
  private final String paragraphId;

  ResourceId(String resourcePoolId, String name) {
    this.resourcePoolId = resourcePoolId;
    this.noteId = null;
    this.paragraphId = null;
    this.name = name;
  }

  ResourceId(String resourcePoolId, String noteId, String paragraphId, String name) {
    this.resourcePoolId = resourcePoolId;
    this.noteId = noteId;
    this.paragraphId = paragraphId;
    this.name = name;
  }

  public String getResourcePoolId() {
    return resourcePoolId;
  }

  public String getName() {
    return name;
  }

  public String getNoteId() {
    return noteId;
  }

  public String getParagraphId() {
    return paragraphId;
  }

  @Override
  public int hashCode() {
    return (resourcePoolId + noteId + paragraphId + name).hashCode();
  }

  @Override
  public boolean equals(Object o) {
    if (o instanceof ResourceId) {
      ResourceId r = (ResourceId) o;
      return equals(r.name, name) && equals(r.resourcePoolId, resourcePoolId) &&
          equals(r.noteId, noteId) && equals(r.paragraphId, paragraphId);
    } else {
      return false;
    }
  }

  private boolean equals(String a, String b) {
    if (a == null && b == null) {
      return true;
    } else if (a != null && b != null) {
      return a.equals(b);
    } else {
      return false;
    }
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public static ResourceId fromJson(String json) {
    return gson.fromJson(json, ResourceId.class);
  }
}