/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.completer;

import jline.console.completer.Completer;

/**
 * Completer with time to live
 */
public class CachedCompleter {
  private Completer completer;
  private int ttlInSeconds;
  private long createdAt;

  public CachedCompleter(Completer completer, int ttlInSeconds) {
    this.completer = completer;
    this.ttlInSeconds = ttlInSeconds;
    this.createdAt = System.currentTimeMillis();
  }

  public boolean isExpired() {
    if (ttlInSeconds == -1 || (ttlInSeconds > 0 &&
        (System.currentTimeMillis() - createdAt) / 1000 > ttlInSeconds)) {
      return true;
    }
    return false;
  }

  public Completer getCompleter() {
    return completer;
  }
}
