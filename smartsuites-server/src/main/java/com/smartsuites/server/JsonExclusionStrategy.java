/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.server;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.smartsuites.interpreter.InterpreterOption;

/**
 * Created by eranw on 8/30/15.
 */
public class JsonExclusionStrategy implements ExclusionStrategy {

  public boolean shouldSkipClass(Class<?> arg0) {
    return false;
  }

  public boolean shouldSkipField(FieldAttributes f) {
    return false;
  }
}
