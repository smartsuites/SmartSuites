/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo.zeppelinhub.websocket;

import com.smartsuites.notebook.socket.Message;
import com.smartsuites.conf.ZeppelinConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Client to connect Zeppelin and ZeppelinHub via websocket API.
 * Implemented using singleton pattern.
 * 
 */
public class Client {
  private static final Logger LOG = LoggerFactory.getLogger(Client.class);
  private final ZeppelinhubClient zeppelinhubClient;
  private final ZeppelinClient zeppelinClient;
  private static Client instance = null;

  private static final int MB = 1048576;
  private static final int MAXIMUM_NOTE_SIZE = 64 * MB;

  public static Client initialize(String zeppelinUri, String zeppelinhubUri, String token, 
      ZeppelinConfiguration conf) {
    if (instance == null) {
      instance = new Client(zeppelinUri, zeppelinhubUri, token, conf);
    }
    return instance;
  }

  public static Client getInstance() {
    return instance;
  }

  private Client(String zeppelinUri, String zeppelinhubUri, String token,
      ZeppelinConfiguration conf) {
    LOG.debug("Init Client");
    zeppelinhubClient = ZeppelinhubClient.initialize(zeppelinhubUri, token);
    zeppelinClient = ZeppelinClient.initialize(zeppelinUri, token, conf);
  }

  public void start() {
    if (zeppelinhubClient != null) {
      zeppelinhubClient.start();
    }
    if (zeppelinClient != null) {
      zeppelinClient.start();
    }
  }

  public void stop() {
    if (zeppelinhubClient != null) {
      zeppelinhubClient.stop();
    }
    if (zeppelinClient != null) {
      zeppelinClient.stop();
    }
  }

  public void relayToZeppelinHub(String message, String token) {
    zeppelinhubClient.send(message, token);
  }

  public void relayToZeppelin(Message message, String noteId) {
    zeppelinClient.send(message, noteId);
  }

  public static int getMaxNoteSize() {
    return MAXIMUM_NOTE_SIZE;
  }
}
