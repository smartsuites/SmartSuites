/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonatype.aether.RepositoryException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.assertEquals;


public class ManagedInterpreterGroupTest {

  private static final Logger LOGGER = LoggerFactory.getLogger(ManagedInterpreterGroupTest.class);

  private InterpreterSetting interpreterSetting;

  @Before
  public void setUp() throws IOException, RepositoryException {
    InterpreterOption interpreterOption = new InterpreterOption();
    interpreterOption.setPerUser(InterpreterOption.SCOPED);
    InterpreterInfo interpreterInfo1 = new InterpreterInfo(EchoInterpreter.class.getName(), "echo", true, new HashMap<String, Object>());
    InterpreterInfo interpreterInfo2 = new InterpreterInfo(DoubleEchoInterpreter.class.getName(), "double_echo", false, new HashMap<String, Object>());
    List<InterpreterInfo> interpreterInfos = new ArrayList<>();
    interpreterInfos.add(interpreterInfo1);
    interpreterInfos.add(interpreterInfo2);
    interpreterSetting = new InterpreterSetting.Builder()
        .setId("id")
        .setName("test")
        .setGroup("test")
        .setInterpreterInfos(interpreterInfos)
        .setOption(interpreterOption)
        .create();
  }

  @Test
  public void testInterpreterGroup() {
    ManagedInterpreterGroup interpreterGroup = new ManagedInterpreterGroup("group_1", interpreterSetting);
    assertEquals(0, interpreterGroup.getSessionNum());

    // create session_1
    List<Interpreter> interpreters = interpreterGroup.getOrCreateSession("user1", "session_1");
    assertEquals(2, interpreters.size());
    assertEquals(EchoInterpreter.class.getName(), interpreters.get(0).getClassName());
    assertEquals(DoubleEchoInterpreter.class.getName(), interpreters.get(1).getClassName());
    assertEquals(1, interpreterGroup.getSessionNum());

    // get the same interpreters when interpreterGroup.getOrCreateSession is invoked again
    assertEquals(interpreters, interpreterGroup.getOrCreateSession("user1", "session_1"));
    assertEquals(1, interpreterGroup.getSessionNum());

    // create session_2
    List<Interpreter> interpreters2 = interpreterGroup.getOrCreateSession("user1", "session_2");
    assertEquals(2, interpreters2.size());
    assertEquals(EchoInterpreter.class.getName(), interpreters2.get(0).getClassName());
    assertEquals(DoubleEchoInterpreter.class.getName(), interpreters2.get(1).getClassName());
    assertEquals(2, interpreterGroup.getSessionNum());

    // close session_1
    interpreterGroup.close("session_1");
    assertEquals(1, interpreterGroup.getSessionNum());

    // close InterpreterGroup
    interpreterGroup.close();
    assertEquals(0, interpreterGroup.getSessionNum());
  }
}