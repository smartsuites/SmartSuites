/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

/**
 * An interface for processing custom callback code into the interpreter.
 */
public interface InterpreterHookListener {
  /**
   * Prepends pre-execute hook code to the script that will be interpreted
   */
  public void onPreExecute(String script);
  
  /**
   * Appends post-execute hook code to the script that will be interpreted
   */
  public void onPostExecute(String script);
}
