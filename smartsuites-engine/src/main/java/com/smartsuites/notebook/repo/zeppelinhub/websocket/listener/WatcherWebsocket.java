/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo.zeppelinhub.websocket.listener;

import com.smartsuites.notebook.repo.zeppelinhub.websocket.ZeppelinClient;
import com.smartsuites.notebook.socket.Message;
import com.smartsuites.ticket.TicketContainer;
import org.apache.commons.lang.StringUtils;
import com.smartsuites.notebook.socket.WatcherMessage;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Zeppelin Watcher that will forward user note to ZeppelinHub.
 *
 */
public class WatcherWebsocket implements WebSocketListener {
  private static final Logger LOG = LoggerFactory.getLogger(ZeppelinWebsocket.class);
  private static final String watcherPrincipal = "watcher";
  public Session connection;
  
  public static WatcherWebsocket createInstace() {
    return new WatcherWebsocket();
  }
  
  @Override
  public void onWebSocketBinary(byte[] payload, int offset, int len) {
  }

  @Override
  public void onWebSocketClose(int code, String reason) {
    LOG.info("WatcherWebsocket connection closed with code: {}, message: {}", code, reason);
  }

  @Override
  public void onWebSocketConnect(Session session) {
    LOG.info("WatcherWebsocket connection opened");
    this.connection = session;
    Message watcherMsg = new Message(Message.OP.WATCHER);
    watcherMsg.principal = watcherPrincipal;
    watcherMsg.ticket = TicketContainer.instance.getTicket(watcherPrincipal);
    session.getRemote().sendStringByFuture(watcherMsg.toJson());
  }

  @Override
  public void onWebSocketError(Throwable cause) {
    LOG.warn("WatcherWebsocket socket connection error ", cause);
  }

  @Override
  public void onWebSocketText(String message) {
    WatcherMessage watcherMsg = WatcherMessage.fromJson(message);
    if (StringUtils.isBlank(watcherMsg.noteId)) {
      return;
    }
    try {
      ZeppelinClient zeppelinClient = ZeppelinClient.getInstance();
      if (zeppelinClient != null) {
        zeppelinClient.handleMsgFromZeppelin(watcherMsg.message, watcherMsg.noteId);
      }
    } catch (Exception e) {
      LOG.error("Failed to send message to ZeppelinHub: ", e);
    }
  }

}
