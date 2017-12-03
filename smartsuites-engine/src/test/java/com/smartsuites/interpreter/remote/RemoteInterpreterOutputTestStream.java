/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote;

import com.smartsuites.interpreter.*;
import com.smartsuites.display.GUI;
import com.smartsuites.interpreter.remote.mock.MockInterpreterOutputStream;
import com.smartsuites.user.AuthenticationInfo;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.*;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;


/**
 * Test for remote interpreter output stream
 */
public class RemoteInterpreterOutputTestStream implements RemoteInterpreterProcessListener {
  private static final String INTERPRETER_SCRIPT =
          System.getProperty("os.name").startsWith("Windows") ?
                  "../bin/interpreter.cmd" :
                  "../bin/interpreter.sh";

  private InterpreterSetting interpreterSetting;

  @Before
  public void setUp() throws Exception {
    InterpreterOption interpreterOption = new InterpreterOption();

    InterpreterInfo interpreterInfo1 = new InterpreterInfo(MockInterpreterOutputStream.class.getName(), "mock", true, new HashMap<String, Object>());
    List<InterpreterInfo> interpreterInfos = new ArrayList<>();
    interpreterInfos.add(interpreterInfo1);
    InterpreterRunner runner = new InterpreterRunner(INTERPRETER_SCRIPT, INTERPRETER_SCRIPT);
    interpreterSetting = new InterpreterSetting.Builder()
        .setId("test")
        .setName("test")
        .setGroup("test")
        .setInterpreterInfos(interpreterInfos)
        .setOption(interpreterOption)
        .setRunner(runner)
        .setInterpreterDir("../interpeters/test")
        .create();
  }

  @After
  public void tearDown() throws Exception {
    interpreterSetting.close();
  }

  private InterpreterContext createInterpreterContext() {
    return new InterpreterContext(
        "noteId",
        "id",
        null,
        "title",
        "text",
        new AuthenticationInfo(),
        new HashMap<String, Object>(),
        new GUI(),
        null,
        null,
        new LinkedList<InterpreterContextRunner>(), null);
  }

  @Test
  public void testInterpreterResultOnly() throws InterpreterException {
    RemoteInterpreter intp = (RemoteInterpreter) interpreterSetting.getDefaultInterpreter("user1", "note1");
    InterpreterResult ret = intp.interpret("SUCCESS::staticresult", createInterpreterContext());
    assertEquals(InterpreterResult.Code.SUCCESS, ret.code());
    assertEquals("staticresult", ret.message().get(0).getData());

    ret = intp.interpret("SUCCESS::staticresult2", createInterpreterContext());
    assertEquals(InterpreterResult.Code.SUCCESS, ret.code());
    assertEquals("staticresult2", ret.message().get(0).getData());

    ret = intp.interpret("ERROR::staticresult3", createInterpreterContext());
    assertEquals(InterpreterResult.Code.ERROR, ret.code());
    assertEquals("staticresult3", ret.message().get(0).getData());
  }

  @Test
  public void testInterpreterOutputStreamOnly() throws InterpreterException {
    RemoteInterpreter intp = (RemoteInterpreter) interpreterSetting.getDefaultInterpreter("user1", "note1");
    InterpreterResult ret = intp.interpret("SUCCESS:streamresult:", createInterpreterContext());
    assertEquals(InterpreterResult.Code.SUCCESS, ret.code());
    assertEquals("streamresult", ret.message().get(0).getData());

    ret = intp.interpret("ERROR:streamresult2:", createInterpreterContext());
    assertEquals(InterpreterResult.Code.ERROR, ret.code());
    assertEquals("streamresult2", ret.message().get(0).getData());
  }

  @Test
  public void testInterpreterResultOutputStreamMixed() throws InterpreterException {
    RemoteInterpreter intp = (RemoteInterpreter) interpreterSetting.getDefaultInterpreter("user1", "note1");
    InterpreterResult ret = intp.interpret("SUCCESS:stream:static", createInterpreterContext());
    assertEquals(InterpreterResult.Code.SUCCESS, ret.code());
    assertEquals("stream", ret.message().get(0).getData());
    assertEquals("static", ret.message().get(1).getData());
  }

  @Test
  public void testOutputType() throws InterpreterException {
    RemoteInterpreter intp = (RemoteInterpreter) interpreterSetting.getDefaultInterpreter("user1", "note1");

    InterpreterResult ret = intp.interpret("SUCCESS:%html hello:", createInterpreterContext());
    assertEquals(InterpreterResult.Type.HTML, ret.message().get(0).getType());
    assertEquals("hello", ret.message().get(0).getData());

    ret = intp.interpret("SUCCESS:%html\nhello:", createInterpreterContext());
    assertEquals(InterpreterResult.Type.HTML, ret.message().get(0).getType());
    assertEquals("hello", ret.message().get(0).getData());

    ret = intp.interpret("SUCCESS:%html hello:%angular world", createInterpreterContext());
    assertEquals(InterpreterResult.Type.HTML, ret.message().get(0).getType());
    assertEquals("hello", ret.message().get(0).getData());
    assertEquals(InterpreterResult.Type.ANGULAR, ret.message().get(1).getType());
    assertEquals("world", ret.message().get(1).getData());
  }

  @Override
  public void onOutputAppend(String noteId, String paragraphId, int index, String output) {

  }

  @Override
  public void onOutputUpdated(String noteId, String paragraphId, int index, InterpreterResult.Type type, String output) {

  }

  @Override
  public void onOutputClear(String noteId, String paragraphId) {

  }

  @Override
  public void onMetaInfosReceived(String settingId, Map<String, String> metaInfos) {

  }

  @Override
  public void onGetParagraphRunners(String noteId, String paragraphId, RemoteWorksEventListener callback) {
    if (callback != null) {
      callback.onFinished(new LinkedList<>());
    }
  }

  @Override
  public void onRemoteRunParagraph(String noteId, String ParagraphID) throws Exception {

  }

  @Override
  public void onParaInfosReceived(String noteId, String paragraphId,
      String interpreterSettingId, Map<String, String> metaInfos) {
  }

}
