/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.tabledata;

import com.smartsuites.interpreter.InterpreterResult;
import com.smartsuites.interpreter.InterpreterResultMessage;
import com.smartsuites.resource.LocalResourcePool;
import org.junit.Before;
import org.junit.Test;

import java.util.Iterator;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

public class TableDataProxyTest {
  private LocalResourcePool pool;

  @Before
  public void setUp() {
    pool = new LocalResourcePool("p1");
  }

  @Test
  public void testProxyTable() {
    InterpreterResultMessage msg = new InterpreterResultMessage(
        InterpreterResult.Type.TABLE,
        "key\tvalue\nsun\t100\nmoon\t200\n");
    InterpreterResultTableData table = new InterpreterResultTableData(msg);

    pool.put("table", table);
    TableDataProxy proxy = new TableDataProxy(pool.get("table"));

    ColumnDef[] cols = proxy.columns();
    assertEquals(2, cols.length);

    assertEquals("key", cols[0].name());
    assertEquals("value", cols[1].name());

    Iterator<Row> it = proxy.rows();
    Row row = it.next();
    assertEquals(2, row.get().length);
    assertEquals("sun", row.get()[0]);
    assertEquals("100", row.get()[1]);

    row = it.next();
    assertEquals("moon", row.get()[0]);
    assertEquals("200", row.get()[1]);

    assertFalse(it.hasNext());
  }
}
