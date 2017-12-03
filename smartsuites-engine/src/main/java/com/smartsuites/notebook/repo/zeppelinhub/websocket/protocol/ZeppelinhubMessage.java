/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo.zeppelinhub.websocket.protocol;

import java.util.Map;

import com.smartsuites.notebook.socket.Message;
import org.apache.commons.lang.StringUtils;
import com.smartsuites.common.JsonSerializable;
import com.smartsuites.notebook.repo.zeppelinhub.websocket.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.Maps;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

/**
 * Zeppelinhub message class.
 *
 */
public class ZeppelinhubMessage implements JsonSerializable {
  private static final Gson gson = new Gson();
  private static final Logger LOG = LoggerFactory.getLogger(Client.class);
  public static final ZeppelinhubMessage EMPTY = new ZeppelinhubMessage();

  public Object op;
  public Object data;
  public Map<String, String> meta = Maps.newHashMap();
  
  private ZeppelinhubMessage() {
    this.op = Message.OP.LIST_NOTES;
    this.data = null;
  }
  
  private ZeppelinhubMessage(Object op, Object data, Map<String, String> meta) {
    this.op = op;
    this.data = data;
    this.meta = meta;
  }
  
  public static ZeppelinhubMessage newMessage(Object op, Object data, Map<String, String> meta) {
    return new ZeppelinhubMessage(op, data, meta);
  }

  public static ZeppelinhubMessage newMessage(Message zeppelinMsg, Map<String, String> meta) {
    if (zeppelinMsg == null) {
      return EMPTY;
    }
    return new ZeppelinhubMessage(zeppelinMsg.op, zeppelinMsg.data, meta);
  }

  public String toJson() {
    return gson.toJson(this, ZeppelinhubMessage.class);
  }

  public static ZeppelinhubMessage fromJson(String zeppelinhubMessage) {
    if (StringUtils.isBlank(zeppelinhubMessage)) {
      return EMPTY;
    }
    ZeppelinhubMessage msg;
    try {
      msg = gson.fromJson(zeppelinhubMessage, ZeppelinhubMessage.class);
    } catch (JsonSyntaxException ex) {
      LOG.error("Cannot fromJson zeppelinhub message", ex);
      msg = EMPTY;
    }
    return msg;
  }
  
}
