/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.lifecycle;

import com.smartsuites.interpreter.AbstractInterpreterTest;
import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.display.GUI;
import com.smartsuites.interpreter.InterpreterContext;
import com.smartsuites.interpreter.InterpreterContextRunner;
import com.smartsuites.interpreter.InterpreterException;
import com.smartsuites.interpreter.InterpreterSetting;
import com.smartsuites.interpreter.remote.RemoteInterpreter;
import com.smartsuites.scheduler.Job;
import com.smartsuites.user.AuthenticationInfo;
import org.junit.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class TimeoutLifecycleManagerTest extends AbstractInterpreterTest {

  @Override
  public void setUp() throws Exception {
    System.setProperty(SmartsuitesConfiguration.ConfVars.SMARTSUITES_INTERPRETER_LIFECYCLE_MANAGER_CLASS.getVarName(),
        TimeoutLifecycleManager.class.getName());
    System.setProperty(SmartsuitesConfiguration.ConfVars.SMARTSUITES_INTERPRETER_LIFECYCLE_MANAGER_TIMEOUT_CHECK_INTERVAL.getVarName(), "1000");
    System.setProperty(SmartsuitesConfiguration.ConfVars.SMARTSUITES_INTERPRETER_LIFECYCLE_MANAGER_TIMEOUT_THRESHOLD.getVarName(), "10000");
    super.setUp();
  }

  @Test
  public void testTimeout_1() throws InterpreterException, InterruptedException, IOException {
    interpreterSettingManager.setInterpreterBinding("user1", "note1", interpreterSettingManager.getSettingIds());
    assertTrue(interpreterFactory.getInterpreter("user1", "note1", "test.echo") instanceof RemoteInterpreter);
    RemoteInterpreter remoteInterpreter = (RemoteInterpreter) interpreterFactory.getInterpreter("user1", "note1", "test.echo");
    InterpreterContext context = new InterpreterContext("noteId", "paragraphId", "repl",
        "title", "text", AuthenticationInfo.ANONYMOUS, new HashMap<String, Object>(), new GUI(),
        null, null, new ArrayList<InterpreterContextRunner>(), null);
    remoteInterpreter.interpret("hello world", context);
    assertTrue(remoteInterpreter.isOpened());
    InterpreterSetting interpreterSetting = interpreterSettingManager.getInterpreterSettingByName("test");
    assertEquals(1, interpreterSetting.getAllInterpreterGroups().size());

    Thread.sleep(15 * 1000);
    // interpreterGroup is timeout, so is removed.
    assertEquals(0, interpreterSetting.getAllInterpreterGroups().size());
    assertFalse(remoteInterpreter.isOpened());
  }

  @Test
  public void testTimeout_2() throws InterpreterException, InterruptedException, IOException {
    interpreterSettingManager.setInterpreterBinding("user1", "note1", interpreterSettingManager.getSettingIds());
    assertTrue(interpreterFactory.getInterpreter("user1", "note1", "test.sleep") instanceof RemoteInterpreter);
    final RemoteInterpreter remoteInterpreter = (RemoteInterpreter) interpreterFactory.getInterpreter("user1", "note1", "test.sleep");

    // simulate how zeppelin submit paragraph
    remoteInterpreter.getScheduler().submit(new Job("test-job", null) {
      @Override
      public Object getReturn() {
        return null;
      }

      @Override
      public int progress() {
        return 0;
      }

      @Override
      public Map<String, Object> info() {
        return null;
      }

      @Override
      protected Object jobRun() throws Throwable {
        InterpreterContext context = new InterpreterContext("noteId", "paragraphId", "repl",
            "title", "text", AuthenticationInfo.ANONYMOUS, new HashMap<String, Object>(), new GUI(),
            null, null, new ArrayList<InterpreterContextRunner>(), null);
        return remoteInterpreter.interpret("100000", context);
      }

      @Override
      protected boolean jobAbort() {
        return false;
      }

      @Override
      public void setResult(Object results) {

      }
    });

    while(!remoteInterpreter.isOpened()) {
      Thread.sleep(1000);
      LOGGER.info("Wait for interpreter to be started");
    }

    InterpreterSetting interpreterSetting = interpreterSettingManager.getInterpreterSettingByName("test");
    assertEquals(1, interpreterSetting.getAllInterpreterGroups().size());

    Thread.sleep(15 * 1000);
    // interpreterGroup is not timeout because getStatus is called periodically.
    assertEquals(1, interpreterSetting.getAllInterpreterGroups().size());
    assertTrue(remoteInterpreter.isOpened());
  }
}
