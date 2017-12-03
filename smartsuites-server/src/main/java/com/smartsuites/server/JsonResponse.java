/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.server;

import java.util.ArrayList;

import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response.ResponseBuilder;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Json response builder.
 *
 * @param <T>
 */
public class JsonResponse<T> {
  private javax.ws.rs.core.Response.Status status;
  private String message;
  private T body;
  transient ArrayList<NewCookie> cookies;
  transient boolean pretty = false;

  public JsonResponse(javax.ws.rs.core.Response.Status status) {
    this.status = status;
    this.message = null;
    this.body = null;

  }

  public JsonResponse(javax.ws.rs.core.Response.Status status, String message) {
    this.status = status;
    this.message = message;
    this.body = null;
  }

  public JsonResponse(javax.ws.rs.core.Response.Status status, T body) {
    this.status = status;
    this.message = null;
    this.body = body;
  }

  public JsonResponse(javax.ws.rs.core.Response.Status status, String message, T body) {
    this.status = status;
    this.message = message;
    this.body = body;
  }

  public JsonResponse<T> setPretty(boolean pretty) {
    this.pretty = pretty;
    return this;
  }

  /**
   * Add cookie for building.
   *
   * @param newCookie
   * @return
   */
  public JsonResponse<T> addCookie(NewCookie newCookie) {
    if (cookies == null) {
      cookies = new ArrayList<>();
    }
    cookies.add(newCookie);

    return this;
  }

  /**
   * Add cookie for building.
   *
   * @param name
   * @param value
   * @return
   */
  public JsonResponse<?> addCookie(String name, String value) {
    return addCookie(new NewCookie(name, value));
  }

  @Override
  public String toString() {
    GsonBuilder gsonBuilder = new GsonBuilder();
    if (pretty) {
      gsonBuilder.setPrettyPrinting();
    }
    gsonBuilder.setExclusionStrategies(new JsonExclusionStrategy());
    Gson gson = gsonBuilder.create();
    return gson.toJson(this);
  }

  public javax.ws.rs.core.Response.Status getCode() {
    return status;
  }

  public void setCode(javax.ws.rs.core.Response.Status status) {
    this.status = status;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public T getBody() {
    return body;
  }

  public void setBody(T body) {
    this.body = body;
  }

  public javax.ws.rs.core.Response build() {
    ResponseBuilder r = javax.ws.rs.core.Response.status(status).entity(this.toString());
    if (cookies != null) {
      for (NewCookie nc : cookies) {
        r.cookie(nc);
      }
    }
    return r.build();
  }
}
