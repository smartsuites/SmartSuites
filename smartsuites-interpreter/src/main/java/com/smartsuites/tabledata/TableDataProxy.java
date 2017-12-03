/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.tabledata;

import com.smartsuites.resource.Resource;

import java.util.Iterator;

/**
 * Proxy TableData for ResourcePool
 * 资源池转换为TableData
 */
public class TableDataProxy implements TableData {
  private final Resource resource;

  public TableDataProxy(Resource tableDataRemoteResource) {
    this.resource = tableDataRemoteResource;
  }

  @Override
  public ColumnDef[] columns() {
    return (ColumnDef[]) resource.invokeMethod(
        "columns", null, null);
  }

  @Override
  public Iterator<Row> rows() {
    String resourceName = resource.getResourceId().getName() + ".rows";
    Resource rows = resource.invokeMethod("rows", null, null, resourceName);

    ProxyRowIterator it = new ProxyRowIterator(rows);
    return it;
  }
}
