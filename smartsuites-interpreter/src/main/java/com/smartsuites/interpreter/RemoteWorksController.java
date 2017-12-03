/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import java.util.List;

/**
 * zeppelin job for Remote works controller by interpreter
 *
 */
public interface RemoteWorksController {
  List<InterpreterContextRunner> getRemoteContextRunner(String noteId);
  List<InterpreterContextRunner> getRemoteContextRunner(String noteId, String paragraphId);
}
