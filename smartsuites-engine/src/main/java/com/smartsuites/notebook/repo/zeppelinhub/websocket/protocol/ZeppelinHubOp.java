/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo.zeppelinhub.websocket.protocol;

/**
 * Zeppelinhub Op.
 */
public enum ZeppelinHubOp {
  LIVE,
  DEAD,
  PING,
  PONG,
  RUN_NOTEBOOK,
  WELCOME,
  ZEPPELIN_STATUS
}
