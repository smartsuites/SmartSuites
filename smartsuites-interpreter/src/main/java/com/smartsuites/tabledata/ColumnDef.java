/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.tabledata;

import java.io.Serializable;

/**
 * Column definition
 * 列的定义
 */
public class ColumnDef implements Serializable {
  /**
   * Type
   */
  public static enum TYPE {
    STRING,
    LONG,
    INT
  }

  private String name;
  private TYPE type;

  public ColumnDef(String name, TYPE type) {
    this.name = name;
    this.type = type;
  }

  public String name() {
    return name;
  }

  public TYPE type() {
    return type;
  }
}
