/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.interpreter.remote;

import com.smartsuites.helium.ApplicationEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class connects to existing process
 */
public class RemoteInterpreterRunningProcess extends RemoteInterpreterProcess {
  private final Logger logger = LoggerFactory.getLogger(RemoteInterpreterRunningProcess.class);
  private final String host;
  private final int port;

  public RemoteInterpreterRunningProcess(
      int connectTimeout,
      String host,
      int port
  ) {
    super(connectTimeout);
    this.host = host;
    this.port = port;
  }

  @Override
  public String getHost() {
    return host;
  }

  @Override
  public int getPort() {
    return port;
  }

  @Override
  public void start(String userName, Boolean isUserImpersonate) {
    // assume process is externally managed. nothing to do
  }

  @Override
  public void stop() {
    // assume process is externally managed. nothing to do
  }

  @Override
  public boolean isRunning() {
    return RemoteInterpreterUtils.checkIfRemoteEndpointAccessible(getHost(), getPort());
  }
}
