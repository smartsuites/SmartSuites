/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo.zeppelinhub.websocket.listener;

import com.smartsuites.notebook.repo.zeppelinhub.websocket.ZeppelinhubClient;
import com.smartsuites.notebook.repo.zeppelinhub.websocket.utils.ZeppelinhubUtils;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Zeppelinhub websocket handler.
 */
public class ZeppelinhubWebsocket implements WebSocketListener {
  private Logger LOG = LoggerFactory.getLogger(ZeppelinhubWebsocket.class);
  private Session zeppelinHubSession;
  private final String token;
  
  private ZeppelinhubWebsocket(String token) {
    this.token = token;
  }

  public static ZeppelinhubWebsocket newInstance(String token) {
    return new ZeppelinhubWebsocket(token);
  }
  
  @Override
  public void onWebSocketBinary(byte[] payload, int offset, int len) {}

  @Override
  public void onWebSocketClose(int statusCode, String reason) {
    LOG.info("Closing websocket connection [{}] : {}", statusCode, reason);
    send(ZeppelinhubUtils.deadMessage(token));
    this.zeppelinHubSession = null;
  }

  @Override
  public void onWebSocketConnect(Session session) {
    LOG.info("Opening a new session to Zeppelinhub {}", session.hashCode());
    this.zeppelinHubSession = session;
    send(ZeppelinhubUtils.liveMessage(token));
  }

  @Override
  public void onWebSocketError(Throwable cause) {
    LOG.error("Remote websocket error");
  }

  @Override
  public void onWebSocketText(String message) {
    // handle message from ZeppelinHub.
    ZeppelinhubClient client = ZeppelinhubClient.getInstance();
    if (client != null) {
      client.handleMsgFromZeppelinHub(message);
    }
  }

  private boolean isSessionOpen() {
    return ((zeppelinHubSession != null) && (zeppelinHubSession.isOpen())) ? true : false;
  }
  
  private void send(String msg) {
    if (isSessionOpen()) {
      zeppelinHubSession.getRemote().sendStringByFuture(msg);
    }
  }
}
