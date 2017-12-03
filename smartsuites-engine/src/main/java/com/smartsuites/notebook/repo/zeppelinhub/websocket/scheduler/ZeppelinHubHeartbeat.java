/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo.zeppelinhub.websocket.scheduler;

import com.smartsuites.notebook.repo.zeppelinhub.websocket.ZeppelinhubClient;
import com.smartsuites.notebook.repo.zeppelinhub.model.UserTokenContainer;
import com.smartsuites.notebook.repo.zeppelinhub.websocket.utils.ZeppelinhubUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Routine that send PING event to zeppelinhub.
 *
 */
public class ZeppelinHubHeartbeat implements Runnable {
  private static final Logger LOG = LoggerFactory.getLogger(ZeppelinHubHeartbeat.class);
  private ZeppelinhubClient client;
  
  public static ZeppelinHubHeartbeat newInstance(ZeppelinhubClient client) {
    return new ZeppelinHubHeartbeat(client);
  }
  
  private ZeppelinHubHeartbeat(ZeppelinhubClient client) {
    this.client = client;
  }
  
  @Override
  public void run() {
    LOG.debug("Sending PING to zeppelinhub token");
    for (String token: UserTokenContainer.getInstance().getAllTokens()) {
      client.send(ZeppelinhubUtils.pingMessage(token), token);
    }
  }  
}
