/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;

/**
 * Remote Zeppelin Server Resource
 */
public class RemoteZeppelinServerResource implements JsonSerializable {
  private static final Gson gson = new Gson();

  /**
   * Resource Type for Zeppelin Server
   */
  public enum Type{
    PARAGRAPH_RUNNERS
  }

  private String ownerKey;
  private Type resourceType;
  private Object data;

  public Type getResourceType() {
    return resourceType;
  }

  public String getOwnerKey() {
    return ownerKey;
  }

  public void setOwnerKey(String ownerKey) {
    this.ownerKey = ownerKey;
  }

  public void setResourceType(Type resourceType) {
    this.resourceType = resourceType;
  }

  public Object getData() {
    return data;
  }

  public void setData(Object data) {
    this.data = data;
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public static RemoteZeppelinServerResource fromJson(String json) {
    return gson.fromJson(json, RemoteZeppelinServerResource.class);
  }
}
