/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.socket;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;

/**
 * Notebook websocket
 * 一个websocket代表一个客户端连接
 */
public class NotebookSocket extends WebSocketAdapter {

  private Session connection;
  private NotebookSocketListener listener;
  private HttpServletRequest request;
  private String protocol;
  private String user;

  public NotebookSocket(HttpServletRequest req, String protocol,
      NotebookSocketListener listener) {
    this.listener = listener;
    this.request = req;
    this.protocol = protocol;
    this.user = StringUtils.EMPTY;
  }

  @Override
  public void onWebSocketClose(int closeCode, String message) {
    listener.onClose(this, closeCode, message);
  }

  @Override
  public void onWebSocketConnect(Session connection) {
    this.connection = connection;
    listener.onOpen(this);
  }

  @Override
  public void onWebSocketText(String message) {
    listener.onMessage(this, message);
  }


  public HttpServletRequest getRequest() {
    return request;
  }

  public String getProtocol() {
    return protocol;
  }

  public synchronized void send(String serializeMessage) throws IOException {
    connection.getRemote().sendString(serializeMessage);
  }

  public String getUser() {
    return user;
  }

  public void setUser(String user) {
    this.user = user;
  }
}
