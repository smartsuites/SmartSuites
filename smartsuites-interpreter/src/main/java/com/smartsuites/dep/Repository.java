/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.dep;
import static org.apache.commons.lang.StringUtils.isNotBlank;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;
import org.sonatype.aether.repository.Authentication;
import org.sonatype.aether.repository.Proxy;

/**
 *
 *
 */
public class Repository implements JsonSerializable {
  private static final Gson gson = new Gson();

  private boolean snapshot = false;
  private String id;
  private String url;
  private String username = null;
  private String password = null;
  private String proxyProtocol = "HTTP";
  private String proxyHost = null;
  private Integer proxyPort = null;
  private String proxyLogin = null;
  private String proxyPassword = null;

  public Repository(String id){
    this.id = id;
  }

  public Repository url(String url) {
    this.url = url;
    return this;
  }

  public Repository snapshot() {
    snapshot = true;
    return this;
  }

  public boolean isSnapshot() {
    return snapshot;
  }

  public String getId() {
    return id;
  }

  public String getUrl() {
    return url;
  }
  
  public Repository username(String username) {
    this.username = username;
    return this;
  }
  
  public Repository password(String password) {
    this.password = password;
    return this;
  }
  
  public Repository credentials(String username, String password) {
    this.username = username;
    this.password = password;
    return this;
  }
  
  public Authentication getAuthentication() {
    Authentication auth = null;
    if (this.username != null && this.password != null) {
      auth = new Authentication(this.username, this.password);
    }
    return auth;
  }

  public Proxy getProxy() {
    if (isNotBlank(proxyHost) && proxyPort != null) {
      if (isNotBlank(proxyLogin)) {
        return new Proxy(proxyProtocol, proxyHost, proxyPort,
                new Authentication(proxyLogin, proxyPassword));
      } else {
        return new Proxy(proxyProtocol, proxyHost, proxyPort, null);
      }
    }
    return null;
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public static Repository fromJson(String json) {
    return gson.fromJson(json, Repository.class);
  }
}
