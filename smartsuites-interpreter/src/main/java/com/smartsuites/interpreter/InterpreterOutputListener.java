/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.interpreter;

/**
 * Listen InterpreterOutput buffer flush
 */
public interface InterpreterOutputListener {
  /**
   * update all message outputs
   */
  public void onUpdateAll(InterpreterOutput out);

  /**
   * called when newline is detected
   * @param index
   * @param out
   * @param line
   */
  public void onAppend(int index, InterpreterResultMessageOutput out, byte[] line);

  /**
   * when entire output is updated. eg) after detecting new display system
   * @param index
   * @param out
   */
  public void onUpdate(int index, InterpreterResultMessageOutput out);
}
