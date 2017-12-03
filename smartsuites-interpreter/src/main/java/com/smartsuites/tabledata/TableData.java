/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.tabledata;

import java.util.Iterator;

/**
 * Abstract representation of table data
 */
public interface TableData {
  /**
   * Get column definitions
   * 列的定义
   * @return
   */
  public ColumnDef [] columns();

  /**
   * Get row iterator
   * 行对象
   * @param
   * @return
   */
  public Iterator<Row> rows();
}
