/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.resource;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Unittest for LocalResourcePool
 */
public class LocalResourcePoolTest {

  @Test
  public void testGetPutResourcePool() {

    LocalResourcePool pool = new LocalResourcePool("pool1");
    assertEquals("pool1", pool.id());

    assertNull(pool.get("notExists"));
    pool.put("item1", "value1");
    Resource resource = pool.get("item1");
    assertNotNull(resource);
    assertEquals(pool.id(), resource.getResourceId().getResourcePoolId());
    assertEquals("value1", resource.get());
    assertTrue(resource.isLocal());
    assertTrue(resource.isSerializable());

    assertEquals(1, pool.getAll().size());

    assertNotNull(pool.remove("item1"));
    assertNull(pool.remove("item1"));
  }
}
