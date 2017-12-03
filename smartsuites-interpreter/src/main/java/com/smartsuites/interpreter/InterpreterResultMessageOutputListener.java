/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.interpreter;

/**
 * InterpreterResultMessage update events
 */
public interface InterpreterResultMessageOutputListener {
  /**
   * called when newline is detected
   * @param line
   */
  public void onAppend(InterpreterResultMessageOutput out, byte[] line);

  /**
   * when entire output is updated. eg) after detecting new display system
   */
  public void onUpdate(InterpreterResultMessageOutput out);
}
