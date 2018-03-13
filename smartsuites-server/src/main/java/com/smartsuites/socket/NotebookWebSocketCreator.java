/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.socket;

import org.eclipse.jetty.websocket.servlet.ServletUpgradeRequest;
import org.eclipse.jetty.websocket.servlet.ServletUpgradeResponse;
import org.eclipse.jetty.websocket.servlet.WebSocketCreator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.smartsuites.conf.SmartsuitesConfiguration.ConfVars.SMARTSUITES_ALLOWED_ORIGINS;

/**
 * Responsible to create the WebSockets for the NotebookServer.
 */
public class NotebookWebSocketCreator implements WebSocketCreator {

  private static final Logger LOG = LoggerFactory.getLogger(NotebookWebSocketCreator.class);
  private NotebookServer notebookServer;

  public NotebookWebSocketCreator(NotebookServer notebookServer) {
    this.notebookServer = notebookServer;
  }
  public Object createWebSocket(ServletUpgradeRequest request, ServletUpgradeResponse response) {
    String origin = request.getHeader("Origin");
    if (notebookServer.checkOrigin(request.getHttpServletRequest(), origin)) {
      return new NotebookSocket(request.getHttpServletRequest(), "", notebookServer);
    } else {
      LOG.error("Websocket request is not allowed by {} settings. Origin: {}",
              SMARTSUITES_ALLOWED_ORIGINS, origin);
      return null;
    }
  }

}
