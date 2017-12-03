/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.smartsuites.interpreter.InterpreterOutput;

/**
 * ApplicationContext
 */
public class ApplicationContext {
  private final String noteId;
  private final String paragraphId;
  private final String applicationInstanceId;
  private final HeliumAppAngularObjectRegistry angularObjectRegistry;
  public final InterpreterOutput out;


  public ApplicationContext(String noteId,
                            String paragraphId,
                            String applicationInstanceId,
                            HeliumAppAngularObjectRegistry angularObjectRegistry,
                            InterpreterOutput out) {
    this.noteId = noteId;
    this.paragraphId = paragraphId;
    this.applicationInstanceId = applicationInstanceId;
    this.angularObjectRegistry = angularObjectRegistry;
    this.out = out;
  }

  public String getNoteId() {
    return noteId;
  }

  public String getParagraphId() {
    return paragraphId;
  }

  public String getApplicationInstanceId() {
    return applicationInstanceId;
  }

  public HeliumAppAngularObjectRegistry getAngularObjectRegistry() {
    return angularObjectRegistry;
  }
}
