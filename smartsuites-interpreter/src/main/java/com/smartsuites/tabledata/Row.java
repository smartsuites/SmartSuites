/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.tabledata;

import java.io.Serializable;

/**
 * Row representation of table data
 */
public class Row implements Serializable {
  private final Object[] data;

  public Row(Object [] data) {
    this.data = data;
  }

  public Object [] get() {
    return data;
  }
}
