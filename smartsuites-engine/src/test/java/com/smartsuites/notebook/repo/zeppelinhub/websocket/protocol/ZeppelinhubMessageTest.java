/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.notebook.repo.zeppelinhub.websocket.protocol;

import static org.junit.Assert.assertEquals;

import java.util.Map;

import com.smartsuites.notebook.repo.zeppelinhub.websocket.protocol.ZeppelinhubMessage;
import com.smartsuites.notebook.socket.Message.OP;
import org.junit.Test;

import com.google.common.collect.Maps;

public class ZeppelinhubMessageTest {
  
  private String msg = "{\"op\":\"LIST_NOTES\",\"data\":\"my data\",\"meta\":{\"key1\":\"val1\"}}";

  @Test
  public void testThatCanSerializeZeppelinHubMessage() {
    Map<String,String> meta = Maps.newHashMap();
    meta.put("key1", "val1");
    String zeppelinHubMsg = ZeppelinhubMessage.newMessage(OP.LIST_NOTES, "my data", meta).toJson();

    assertEquals(msg, zeppelinHubMsg);
  }
  
  @Test
  public void testThastCanDeserialiseZeppelinhubMessage() {
    Map<String,String> meta = Maps.newHashMap();
    meta.put("key1", "val1");
    ZeppelinhubMessage expected = ZeppelinhubMessage.newMessage(OP.LIST_NOTES.toString(), "my data", meta);
    ZeppelinhubMessage zeppelinHubMsg = ZeppelinhubMessage.fromJson(msg);

    assertEquals(expected.op, zeppelinHubMsg.op);
    assertEquals(expected.data, zeppelinHubMsg.data);
    assertEquals(expected.meta, zeppelinHubMsg.meta);
  }
  
  @Test
  public void testThatInvalidStringReturnEmptyZeppelinhubMessage() {
    assertEquals(ZeppelinhubMessage.EMPTY, ZeppelinhubMessage.fromJson(""));
    assertEquals(ZeppelinhubMessage.EMPTY, ZeppelinhubMessage.fromJson("dwfewewrewr"));
  }

}
