/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.resource;

/**
 * Well known resource names in ResourcePool
 */
public enum WellKnownResourceName {
  ZeppelinReplResult("zeppelin.repl.result"),                 // last object of repl
  ZeppelinTableResult("zeppelin.paragraph.result.table");     // paragraph run result

  String name;
  WellKnownResourceName(String name) {
    this.name = name;
  }

  public String toString() {
    return name;
  }
}
