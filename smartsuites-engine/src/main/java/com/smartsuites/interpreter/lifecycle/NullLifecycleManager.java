/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */


package com.smartsuites.interpreter.lifecycle;

import com.smartsuites.conf.ZeppelinConfiguration;
import com.smartsuites.interpreter.LifecycleManager;
import com.smartsuites.interpreter.ManagedInterpreterGroup;

/**
 * Do nothing for the lifecycle of interpreter. User need to explicitly start/stop interpreter.
 */
public class NullLifecycleManager implements LifecycleManager {

  public NullLifecycleManager(ZeppelinConfiguration zConf) {

  }

  @Override
  public void onInterpreterGroupCreated(ManagedInterpreterGroup interpreterGroup) {

  }

  @Override
  public void onInterpreterSessionCreated(ManagedInterpreterGroup interpreterGroup,
                                          String sessionId) {

  }

  @Override
  public void onInterpreterUse(ManagedInterpreterGroup interpreterGroup, String sessionId) {

  }
}
