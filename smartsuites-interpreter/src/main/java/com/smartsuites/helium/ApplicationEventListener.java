/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.smartsuites.interpreter.InterpreterResult;

/**
 * Event from HeliumApplication running on remote interpreter process
 */
public interface ApplicationEventListener {
  public void onOutputAppend(String noteId, String paragraphId, int index, String appId, String output);
  public void onOutputUpdated(String noteId, String paragraphId, int index, String appId, InterpreterResult.Type type, String output);
  public void onLoad(String noteId, String paragraphId, String appId, HeliumPackage pkg);
  public void onStatusChange(String noteId, String paragraphId, String appId, String status);
}
