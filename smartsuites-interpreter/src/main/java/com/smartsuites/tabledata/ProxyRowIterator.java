/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.tabledata;

import com.smartsuites.resource.Resource;

import java.util.Iterator;

/**
 * Proxy row iterator
 *
 */
public class ProxyRowIterator implements Iterator<Row> {

  private final Resource rows;

  public ProxyRowIterator(Resource rows) {
    this.rows = rows;
  }

  @Override
  public boolean hasNext() {
    rows.invokeMethod("hasNext", null, null);
    return false;
  }

  @Override
  public Row next() {
    return (Row) rows.invokeMethod("next", null, null);
  }

  @Override
  public void remove() {
    // operation not supported
  }
}
