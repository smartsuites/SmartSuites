/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.notebook;

/**
 * NoteNameListener. It's used by FolderView.
 */
public interface NoteNameListener {
  /**
   * Fired after note name changed
   * @param note
   * @param oldName
   */
  void onNoteNameChanged(Note note, String oldName);
}
