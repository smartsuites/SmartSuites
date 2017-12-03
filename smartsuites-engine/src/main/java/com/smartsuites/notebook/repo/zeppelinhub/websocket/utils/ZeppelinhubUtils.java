/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo.zeppelinhub.websocket.utils;

import java.util.HashMap;

import com.smartsuites.notebook.repo.zeppelinhub.model.UserTokenContainer;
import com.smartsuites.notebook.repo.zeppelinhub.websocket.ZeppelinhubClient;
import com.smartsuites.notebook.repo.zeppelinhub.websocket.protocol.ZeppelinhubMessage;
import com.smartsuites.notebook.socket.Message;
import org.apache.commons.lang.StringUtils;
import com.smartsuites.notebook.repo.zeppelinhub.websocket.protocol.ZeppelinHubOp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Helper class.
 *
 */
public class ZeppelinhubUtils {
  private static final Logger LOG = LoggerFactory.getLogger(ZeppelinhubUtils.class);

  public static String liveMessage(String token) {
    if (StringUtils.isBlank(token)) {
      LOG.error("Cannot create Live message: token is null or empty");
      return ZeppelinhubMessage.EMPTY.toJson();
    }
    HashMap<String, Object> data = new HashMap<>();
    data.put("token", token);
    return ZeppelinhubMessage
             .newMessage(ZeppelinHubOp.LIVE, data, new HashMap<String, String>())
             .toJson();
  }
  
  public static String deadMessage(String token) {
    if (StringUtils.isBlank(token)) {
      LOG.error("Cannot create Dead message: token is null or empty");
      return ZeppelinhubMessage.EMPTY.toJson();
    }
    HashMap<String, Object> data = new HashMap<>();
    data.put("token", token);
    return ZeppelinhubMessage
             .newMessage(ZeppelinHubOp.DEAD, data, new HashMap<String, String>())
             .toJson();
  }
  
  public static String pingMessage(String token) {
    if (StringUtils.isBlank(token)) {
      LOG.error("Cannot create Ping message: token is null or empty");
      return ZeppelinhubMessage.EMPTY.toJson();
    }
    HashMap<String, Object> data = new HashMap<>();
    data.put("token", token);
    return ZeppelinhubMessage
             .newMessage(ZeppelinHubOp.PING, data, new HashMap<String, String>())
             .toJson();
  }

  public static ZeppelinHubOp toZeppelinHubOp(String text) {
    ZeppelinHubOp hubOp = null;
    try {
      hubOp = ZeppelinHubOp.valueOf(text);
    } catch (IllegalArgumentException e) {
      // in case of non Hub op
    }
    return hubOp;
  }

  public static boolean isZeppelinHubOp(String text) {
    return (toZeppelinHubOp(text) != null); 
  }

  public static Message.OP toZeppelinOp(String text) {
    Message.OP zeppelinOp = null;
    try {
      zeppelinOp = Message.OP.valueOf(text);
    } catch (IllegalArgumentException e) {
      // in case of non Hub op
    }
    return zeppelinOp;
  }

  public static boolean isZeppelinOp(String text) {
    return (toZeppelinOp(text) != null); 
  }
  
  public static void userLoginRoutine(String username) {
    LOG.debug("Executing user login routine");
    String token = UserTokenContainer.getInstance().getUserToken(username);
    UserTokenContainer.getInstance().setUserToken(username, token);
    String msg = ZeppelinhubUtils.liveMessage(token);
    ZeppelinhubClient.getInstance()
        .send(msg, token);
  }
  
  public static void userLogoutRoutine(String username) {
    LOG.debug("Executing user logout routine");
    String token = UserTokenContainer.getInstance().removeUserToken(username);
    String msg = ZeppelinhubUtils.deadMessage(token);
    ZeppelinhubClient.getInstance()
        .send(msg, token);
    ZeppelinhubClient.getInstance().removeSession(token);
  }
  
  public static void userSwitchTokenRoutine(String username, String originToken,
      String targetToken) {
    String offMsg = ZeppelinhubUtils.deadMessage(originToken);
    ZeppelinhubClient.getInstance().send(offMsg, originToken);
    ZeppelinhubClient.getInstance().removeSession(originToken);
    
    String onMsg = ZeppelinhubUtils.liveMessage(targetToken);
    ZeppelinhubClient.getInstance().send(onMsg, targetToken);
  }
}
