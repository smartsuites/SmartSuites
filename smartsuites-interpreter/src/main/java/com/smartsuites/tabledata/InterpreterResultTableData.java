/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.tabledata;

import com.smartsuites.interpreter.InterpreterResultMessage;

import java.io.Serializable;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

/**
 * Table data with interpreter result type 'TABLE'
 * 解析器结果解析成TableData
 */
public class InterpreterResultTableData implements TableData, Serializable {
  private final InterpreterResultMessage msg;
  ColumnDef [] columnDef;
  List<Row> rows = new LinkedList<>();

  public InterpreterResultTableData(InterpreterResultMessage msg) {
    this.msg = msg;

    String[] lines = msg.getData().split("\n");
    if (lines == null || lines.length == 0) {
      columnDef = null;
    } else {
      String[] headerRow = lines[0].split("\t");
      columnDef = new ColumnDef[headerRow.length];
      for (int i = 0; i < headerRow.length; i++) {
        columnDef[i] = new ColumnDef(headerRow[i], ColumnDef.TYPE.STRING);
      }

      for (int r = 1; r < lines.length; r++) {
        Object [] row = lines[r].split("\t");
        rows.add(new Row(row));
      }
    }
  }


  @Override
  public ColumnDef[] columns() {
    return columnDef;
  }

  @Override
  public Iterator<Row> rows() {
    return rows.iterator();
  }
}
