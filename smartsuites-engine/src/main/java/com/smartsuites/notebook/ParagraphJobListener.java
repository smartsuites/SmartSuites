/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.notebook;

import com.smartsuites.interpreter.InterpreterOutput;
import com.smartsuites.interpreter.InterpreterResultMessage;
import com.smartsuites.interpreter.InterpreterResultMessageOutput;
import com.smartsuites.scheduler.JobListener;

import java.util.List;

/**
 * Listen paragraph update
 */
public interface ParagraphJobListener extends JobListener {
  public void onOutputAppend(Paragraph paragraph, int idx, String output);
  public void onOutputUpdate(Paragraph paragraph, int idx, InterpreterResultMessage msg);
  public void onOutputUpdateAll(Paragraph paragraph, List<InterpreterResultMessage> msgs);
}
