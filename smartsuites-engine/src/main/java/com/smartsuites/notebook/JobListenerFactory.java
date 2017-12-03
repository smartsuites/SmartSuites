/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.notebook;

/**
 * TODO(moon): provide description.
 */
public interface JobListenerFactory {
  public ParagraphJobListener getParagraphJobListener(Note note);
}
