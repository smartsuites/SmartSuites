/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.resource;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Unit test for ResourceSet
 */
public class ResourceSetTest {

  @Test
  public void testFilterByName() {
    ResourceSet set = new ResourceSet();

    set.add(new Resource(null, new ResourceId("poo1", "resource1"), "value1"));
    set.add(new Resource(null, new ResourceId("poo1", "resource2"), new Integer(2)));
    assertEquals(2, set.filterByNameRegex(".*").size());
    assertEquals(1, set.filterByNameRegex("resource1").size());
    assertEquals(1, set.filterByNameRegex("resource2").size());
    assertEquals(0, set.filterByNameRegex("res").size());
    assertEquals(2, set.filterByNameRegex("res.*").size());
  }

  @Test
  public void testFilterByClassName() {
    ResourceSet set = new ResourceSet();

    set.add(new Resource(null, new ResourceId("poo1", "resource1"), "value1"));
    set.add(new Resource(null, new ResourceId("poo1", "resource2"), new Integer(2)));

    assertEquals(1, set.filterByClassnameRegex(".*String").size());
    assertEquals(1, set.filterByClassnameRegex(String.class.getName()).size());
    assertEquals(1, set.filterByClassnameRegex(".*Integer").size());
    assertEquals(1, set.filterByClassnameRegex(Integer.class.getName()).size());
  }
}
