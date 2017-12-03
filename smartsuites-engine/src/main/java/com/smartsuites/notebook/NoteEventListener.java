/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook;

import com.smartsuites.scheduler.Job;

/**
 * NoteEventListener
 */
public interface NoteEventListener {
  public void onParagraphRemove(Paragraph p);
  public void onParagraphCreate(Paragraph p);
  public void onParagraphStatusChange(Paragraph p, Job.Status status);
}
