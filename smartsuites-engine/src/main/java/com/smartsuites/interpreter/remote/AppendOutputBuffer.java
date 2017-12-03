/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote;

/**
 * This element stores the buffered
 * append-data of paragraph's output.
 */
public class AppendOutputBuffer {

  private String noteId;
  private String paragraphId;
  private int index;
  private String data;

  public AppendOutputBuffer(String noteId, String paragraphId, int index, String data) {
    this.noteId = noteId;
    this.paragraphId = paragraphId;
    this.index = index;
    this.data = data;
  }

  public String getNoteId() {
    return noteId;
  }

  public String getParagraphId() {
    return paragraphId;
  }

  public int getIndex() {
    return index;
  }

  public String getData() {
    return data;
  }

}
