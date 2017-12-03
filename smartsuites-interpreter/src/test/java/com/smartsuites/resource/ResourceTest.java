/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.resource;

import org.junit.Test;

import java.io.IOException;
import java.nio.ByteBuffer;

import static org.junit.Assert.assertEquals;

/**
 * Test for Resource
 */
public class ResourceTest {
  @Test
  public void testSerializeDeserialize() throws IOException, ClassNotFoundException {
    ByteBuffer buffer = Resource.serializeObject("hello");
    assertEquals("hello", Resource.deserializeObject(buffer));
  }
}
