/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.interpreter.remote;

import com.smartsuites.interpreter.InterpreterResult;

import java.util.Map;

/**
 * Event from remoteInterpreterProcess
 */
public interface RemoteInterpreterProcessListener {
  public void onOutputAppend(String noteId, String paragraphId, int index, String output);
  public void onOutputUpdated(
      String noteId, String paragraphId, int index, InterpreterResult.Type type, String output);
  public void onOutputClear(String noteId, String paragraphId);
  public void onMetaInfosReceived(String settingId, Map<String, String> metaInfos);
  public void onRemoteRunParagraph(String noteId, String ParagraphID) throws Exception;
  public void onGetParagraphRunners(
      String noteId, String paragraphId, RemoteWorksEventListener callback);

  /**
   * Remote works for Interpreter callback listener
   */
  public interface RemoteWorksEventListener {
    public void onFinished(Object resultObject);
    public void onError();
  }
  public void onParaInfosReceived(String noteId, String paragraphId,
                                  String interpreterSettingId, Map<String, String> metaInfos);
}
