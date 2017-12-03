/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.display;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotSame;

import java.util.concurrent.atomic.AtomicInteger;

import com.smartsuites.interpreter.InterpreterContext;
import org.junit.Test;

public class AngularObjectTest {

  @Test
  public void testEquals() {
    assertEquals(
            new AngularObject("name", "value", "note1", null, null),
            new AngularObject("name", "value", "note1", null, null)
    );

    assertEquals(
            new AngularObject("name", "value", "note1", "paragraph1", null),
            new AngularObject("name", "value", "note1", "paragraph1", null)
    );

    assertEquals(
            new AngularObject("name", "value", null, null, null),
            new AngularObject("name", "value", null, null, null)
    );

    assertEquals(
            new AngularObject("name", "value1", null, null, null),
            new AngularObject("name", "value2", null, null, null)
    );

    assertNotSame(
            new AngularObject("name1", "value", null, null, null),
            new AngularObject("name2", "value", null, null, null)
    );

    assertNotSame(
            new AngularObject("name1", "value", "note1", null, null),
            new AngularObject("name2", "value", "note2", null, null)
    );

    assertNotSame(
            new AngularObject("name1", "value", "note", null, null),
            new AngularObject("name2", "value", null, null, null)
    );

    assertNotSame(
            new AngularObject("name", "value", "note", "paragraph1", null),
            new AngularObject("name", "value", "note", "paragraph2", null)
    );

    assertNotSame(
            new AngularObject("name", "value", "note1", null, null),
            new AngularObject("name", "value", "note1", "paragraph1", null)
    );


  }

  @Test
  public void testListener() {
    final AtomicInteger updated = new AtomicInteger(0);
    AngularObject ao = new AngularObject("name", "value", "note1", null, new AngularObjectListener() {

      @Override
      public void updated(AngularObject updatedObject) {
        updated.incrementAndGet();
      }

    });

    assertEquals(0, updated.get());
    ao.set("newValue");
    assertEquals(1, updated.get());
    assertEquals("newValue", ao.get());

    ao.set("newValue");
    assertEquals(2, updated.get());

    ao.set("newnewValue", false);
    assertEquals(2, updated.get());
    assertEquals("newnewValue", ao.get());
  }

  @Test
  public void testWatcher() throws InterruptedException {
    final AtomicInteger updated = new AtomicInteger(0);
    final AtomicInteger onWatch = new AtomicInteger(0);
    AngularObject ao = new AngularObject("name", "value", "note1", null, new AngularObjectListener() {
      @Override
      public void updated(AngularObject updatedObject) {
        updated.incrementAndGet();
      }
    });

    ao.addWatcher(new AngularObjectWatcher(null) {
      @Override
      public void watch(Object oldObject, Object newObject, InterpreterContext context) {
        onWatch.incrementAndGet();
      }
    });

    assertEquals(0, onWatch.get());
    ao.set("newValue");

    Thread.sleep(500);
    assertEquals(1, onWatch.get());
  }
}
