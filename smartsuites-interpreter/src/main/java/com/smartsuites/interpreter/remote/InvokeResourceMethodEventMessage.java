/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.interpreter.remote;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;
import com.smartsuites.resource.ResourceId;

/**
 * message payload to invoke method of resource in the resourcepool
 * 调用资源方法的参数包装
 */
public class InvokeResourceMethodEventMessage implements JsonSerializable {
  private static final Gson gson = new Gson();

  public final ResourceId resourceId;
  public final String methodName;
  public final String[] paramClassnames;
  public final Object[] params;
  public final String returnResourceName;

  public InvokeResourceMethodEventMessage(
      ResourceId resourceId,
      String methodName,
      Class[] paramtypes,
      Object[] params,
      String returnResourceName
  ) {
    this.resourceId = resourceId;
    this.methodName = methodName;
    if (paramtypes != null) {
      paramClassnames = new String[paramtypes.length];
      for (int i = 0; i < paramClassnames.length; i++) {
        paramClassnames[i] = paramtypes[i].getName();
      }
    } else {
      paramClassnames = null;
    }

    this.params = params;
    this.returnResourceName = returnResourceName;
  }

  public Class [] getParamTypes() throws ClassNotFoundException {
    if (paramClassnames == null) {
      return null;
    }

    Class [] types = new Class[paramClassnames.length];
    for (int i = 0; i < paramClassnames.length; i++) {
      types[i] = this.getClass().getClassLoader().loadClass(paramClassnames[i]);
    }

    return types;
  }

  public boolean shouldPutResultIntoResourcePool() {
    return (returnResourceName != null);
  }

  @Override
  public int hashCode() {
    String hash = resourceId.hashCode() + methodName;
    if (paramClassnames != null) {
      for (String name : paramClassnames) {
        hash += name;
      }
    }
    if (returnResourceName != null) {
      hash += returnResourceName;
    }

    return hash.hashCode();
  }

  @Override
  public boolean equals(Object o) {
    if (o instanceof InvokeResourceMethodEventMessage) {
      InvokeResourceMethodEventMessage r = (InvokeResourceMethodEventMessage) o;
      return r.hashCode() == hashCode();
    } else {
      return false;
    }
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public static InvokeResourceMethodEventMessage fromJson(String json) {
    return gson.fromJson(json, InvokeResourceMethodEventMessage.class);
  }
}
