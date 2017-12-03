/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote;

import com.smartsuites.display.AngularObject;
import com.smartsuites.display.AngularObjectListener;
import com.smartsuites.interpreter.InterpreterGroup;
import com.smartsuites.interpreter.ManagedInterpreterGroup;

/**
 * Proxy for AngularObject that exists in remote interpreter process
 */
public class RemoteAngularObject extends AngularObject {

  private transient ManagedInterpreterGroup interpreterGroup;

  RemoteAngularObject(String name, Object o, String noteId, String paragraphId,
                      ManagedInterpreterGroup interpreterGroup,
                      AngularObjectListener listener) {
    super(name, o, noteId, paragraphId, listener);
    this.interpreterGroup = interpreterGroup;
  }

  @Override
  public void set(Object o, boolean emit) {
    set(o,  emit, true);
  }

  public void set(Object o, boolean emitWeb, boolean emitRemoteProcess) {
    super.set(o, emitWeb);

    if (emitRemoteProcess) {
      // send updated value to remote interpreter
      interpreterGroup.getRemoteInterpreterProcess().
          updateRemoteAngularObject(
              getName(), getNoteId(), getParagraphId(), o);
    }
  }
}
