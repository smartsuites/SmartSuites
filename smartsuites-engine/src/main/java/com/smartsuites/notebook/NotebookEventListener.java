/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook;

import com.smartsuites.interpreter.InterpreterSetting;

/**
 * Notebook event
 */
public interface NotebookEventListener extends NoteEventListener {
  public void onNoteRemove(Note note);
  public void onNoteCreate(Note note);

  public void onUnbindInterpreter(Note note, InterpreterSetting setting);
}
