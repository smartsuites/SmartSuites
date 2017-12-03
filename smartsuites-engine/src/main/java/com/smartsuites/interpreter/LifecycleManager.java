/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */


package com.smartsuites.interpreter;


/**
 * Interface for managing the lifecycle of interpreters
 */
public interface LifecycleManager {

  void onInterpreterGroupCreated(ManagedInterpreterGroup interpreterGroup);

  void onInterpreterSessionCreated(ManagedInterpreterGroup interpreterGroup,
                                   String sessionId);

  void onInterpreterUse(ManagedInterpreterGroup interpreterGroup,
                        String sessionId);

}
