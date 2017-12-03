/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote;

import com.smartsuites.interpreter.InterpreterContextRunner;

/**
 *
 */
public class RemoteInterpreterContextRunner extends InterpreterContextRunner {

  public RemoteInterpreterContextRunner(String noteId, String paragraphId) {
    super(noteId, paragraphId);
  }

  @Override
  public void run() {
    // this class should be used only for gson deserialize abstract class
    // code should not reach here
    throw new RuntimeException("Assert");
  }
}
