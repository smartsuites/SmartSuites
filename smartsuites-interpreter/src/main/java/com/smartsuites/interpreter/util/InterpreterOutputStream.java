/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.util;

import com.smartsuites.interpreter.InterpreterOutput;
import org.slf4j.Logger;

import java.io.IOException;

/**
 * Output Stream integrated with InterpreterOutput.
 *
 * Can be used to channel output from interpreters.
 */
public class InterpreterOutputStream extends LogOutputStream {
  private Logger logger;
  volatile InterpreterOutput interpreterOutput;
  boolean ignoreLeadingNewLinesFromScalaReporter = false;

  public InterpreterOutputStream(Logger logger) {
    this.logger = logger;
  }

  public InterpreterOutput getInterpreterOutput() {
    return interpreterOutput;
  }

  public void setInterpreterOutput(InterpreterOutput interpreterOutput) {
    this.interpreterOutput = interpreterOutput;
  }

  @Override
  public void write(int b) throws IOException {
    if (ignoreLeadingNewLinesFromScalaReporter && b == '\n') {
      StackTraceElement[] stacks = Thread.currentThread().getStackTrace();
      for (StackTraceElement stack : stacks) {
        if (stack.getClassName().equals("scala.tools.nsc.interpreter.ReplReporter") &&
            stack.getMethodName().equals("error")) {
          // ignore. Please see ZEPPELIN-2067
          return;
        }
      }
    } else {
      ignoreLeadingNewLinesFromScalaReporter = false;
    }
    super.write(b);
    if (interpreterOutput != null) {
      interpreterOutput.write(b);
    }
  }

  @Override
  public void write(byte [] b) throws IOException {
    write(b, 0, b.length);
  }

  @Override
  public void write(byte [] b, int off, int len) throws IOException {
    for (int i = off; i < len; i++) {
      write(b[i]);
    }
  }

  @Override
  protected void processLine(String s, int i) {
    logger.debug("Interpreter output:" + s);
  }

  @Override
  public void close() throws IOException {
    super.close();
    if (interpreterOutput != null) {
      interpreterOutput.close();
    }
  }

  @Override
  public void flush() throws IOException {
    super.flush();
    if (interpreterOutput != null) {
      interpreterOutput.flush();
    }
  }

  public void ignoreLeadingNewLinesFromScalaReporter() {
    ignoreLeadingNewLinesFromScalaReporter = true;
  }
}
