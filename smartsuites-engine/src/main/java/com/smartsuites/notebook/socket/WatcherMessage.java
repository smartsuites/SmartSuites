/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.socket;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;

/**
 * Zeppelin websocket massage template class for watcher socket.
 */
public class WatcherMessage implements JsonSerializable {

  public String message;
  public String noteId;
  public String subject;
  
  private static final Gson gson = new Gson();
  
  public static Builder builder(String noteId) {
    return new Builder(noteId);
  }
  
  private WatcherMessage(Builder builder) {
    this.noteId = builder.noteId;
    this.message = builder.message;
    this.subject = builder.subject;
  }
  
  public String toJson() {
    return gson.toJson(this);
  }

  public static WatcherMessage fromJson(String json) {
    return gson.fromJson(json, WatcherMessage.class);
  }

  /**
   * Simple builder.
   */
  public static class Builder {
    private final String noteId;
    private String subject;
    private String message;
    
    public Builder(String noteId) {
      this.noteId = noteId;
    }
    
    public Builder subject(String subject) {
      this.subject = subject;
      return this;
    }
    
    public Builder message(String message) {
      this.message = message;
      return this;
    }

    public WatcherMessage build() {
      return new WatcherMessage(this);
    }
  }
  
}
