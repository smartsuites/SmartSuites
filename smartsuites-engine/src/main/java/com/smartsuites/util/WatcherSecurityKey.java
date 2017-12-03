/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.util;

import java.util.UUID;

/**
 * Simple implementation of a auto-generated key for websocket watcher.
 * This is a LAZY implementation, we might want to update this later on :)
 */
public class WatcherSecurityKey {
  public static final String HTTP_HEADER = "X-Watcher-Key";
  private static final String KEY = UUID.randomUUID().toString();

  protected WatcherSecurityKey() {}

  public static String getKey() {
    return KEY;
  }

}
