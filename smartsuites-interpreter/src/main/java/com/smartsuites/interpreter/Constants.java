/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Interpreter related constants
 * 
 *
 */
public class Constants {
  public static final String ZEPPELIN_INTERPRETER_PORT = "zeppelin.interpreter.port";

  public static final String ZEPPELIN_INTERPRETER_HOST = "zeppelin.interpreter.host";

  public static final String EXISTING_PROCESS = "existing_process";

  public static final int ZEPPELIN_INTERPRETER_DEFAUlT_PORT = 29914;

  public static final int ZEPPELIN_INTERPRETER_OUTPUT_LIMIT = 1024 * 100;

  public static final Map<String, TimeUnit> TIME_SUFFIXES;

  static {
    TIME_SUFFIXES = new HashMap<>();
    TIME_SUFFIXES.put("us", TimeUnit.MICROSECONDS);
    TIME_SUFFIXES.put("ms", TimeUnit.MILLISECONDS);
    TIME_SUFFIXES.put("s", TimeUnit.SECONDS);
    TIME_SUFFIXES.put("m", TimeUnit.MINUTES);
    TIME_SUFFIXES.put("min", TimeUnit.MINUTES);
    TIME_SUFFIXES.put("h", TimeUnit.HOURS);
    TIME_SUFFIXES.put("d", TimeUnit.DAYS);
  }

}
