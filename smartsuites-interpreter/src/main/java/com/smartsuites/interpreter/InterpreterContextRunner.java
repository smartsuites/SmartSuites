/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

/**
 *
 */
public abstract class InterpreterContextRunner implements Runnable {
  String noteId;
  private String paragraphId;

  public InterpreterContextRunner(String noteId, String paragraphId) {
    this.noteId = noteId;
    this.paragraphId = paragraphId;
  }

  @Override
  public boolean equals(Object o) {
    if (o instanceof InterpreterContextRunner) {
      InterpreterContextRunner io = ((InterpreterContextRunner) o);
      if (io.getParagraphId().equals(paragraphId) &&
          io.getNoteId().equals(noteId)) {
        return true;
      } else {
        return false;
      }

    } else {
      return false;
    }
  }

  @Override
  public abstract void run();

  public String getNoteId() {
    return noteId;
  }

  public String getParagraphId() {
    return paragraphId;
  }

}
