/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo.zeppelinhub.websocket.scheduler;

import com.smartsuites.notebook.repo.zeppelinhub.websocket.ZeppelinClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Routine that sends PING to all connected Zeppelin ws connections.
 *
 */
public class ZeppelinHeartbeat implements Runnable {
  private static final Logger LOG = LoggerFactory.getLogger(ZeppelinHubHeartbeat.class);
  private ZeppelinClient client;
  
  public static ZeppelinHeartbeat newInstance(ZeppelinClient client) {
    return new ZeppelinHeartbeat(client);
  }
  
  private ZeppelinHeartbeat(ZeppelinClient client) {
    this.client = client;
  }

  @Override
  public void run() {
    LOG.debug("Sending PING to Zeppelin Websocket Server");
    client.ping();
  }
}
