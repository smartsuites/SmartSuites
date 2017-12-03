/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import com.smartsuites.interpreter.remote.RemoteInterpreter;
import org.junit.Test;

import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

public class InterpreterFactoryTest extends AbstractInterpreterTest {

  @Test
  public void testGetFactory() throws IOException {
    // no default interpreter because there's no interpreter setting binded to this note
    assertNull(interpreterFactory.getInterpreter("user1", "note1", ""));

    interpreterSettingManager.setInterpreterBinding("user1", "note1", interpreterSettingManager.getSettingIds());
    assertTrue(interpreterFactory.getInterpreter("user1", "note1", "") instanceof RemoteInterpreter);
    RemoteInterpreter remoteInterpreter = (RemoteInterpreter) interpreterFactory.getInterpreter("user1", "note1", "");
    // EchoInterpreter is the default interpreter because mock1 is the default interpreter group
    assertEquals(EchoInterpreter.class.getName(), remoteInterpreter.getClassName());

    assertTrue(interpreterFactory.getInterpreter("user1", "note1", "test") instanceof RemoteInterpreter);
    remoteInterpreter = (RemoteInterpreter) interpreterFactory.getInterpreter("user1", "note1", "test");
    assertEquals(EchoInterpreter.class.getName(), remoteInterpreter.getClassName());

    assertTrue(interpreterFactory.getInterpreter("user1", "note1", "test2") instanceof RemoteInterpreter);
    remoteInterpreter = (RemoteInterpreter) interpreterFactory.getInterpreter("user1", "note1", "test2");
    assertEquals(EchoInterpreter.class.getName(), remoteInterpreter.getClassName());

    assertTrue(interpreterFactory.getInterpreter("user1", "note1", "test2.double_echo") instanceof RemoteInterpreter);
    remoteInterpreter = (RemoteInterpreter) interpreterFactory.getInterpreter("user1", "note1", "test2.double_echo");
    assertEquals(DoubleEchoInterpreter.class.getName(), remoteInterpreter.getClassName());
  }

  @Test
  public void testUnknownRepl1() throws IOException {
    interpreterSettingManager.setInterpreterBinding("user1", "note1", interpreterSettingManager.getSettingIds());
    try {
      interpreterFactory.getInterpreter("user1", "note1", "test.unknown_repl");
      fail("should fail due to no such interpreter");
    } catch (RuntimeException e) {
      assertEquals("No such interpreter: test.unknown_repl", e.getMessage());
    }
  }

  @Test
  public void testUnknownRepl2() throws IOException {
    interpreterSettingManager.setInterpreterBinding("user1", "note1", interpreterSettingManager.getSettingIds());
    try {
      interpreterFactory.getInterpreter("user1", "note1", "unknown_repl");
      fail("should fail due to no such interpreter");
    } catch (RuntimeException e) {
      assertEquals("Either no interpreter named unknown_repl or it is not binded to this note", e.getMessage());
    }
  }
}
