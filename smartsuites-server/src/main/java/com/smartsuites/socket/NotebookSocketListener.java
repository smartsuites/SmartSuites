/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.socket;

/**
 * NoteboookSocket listener
 * 监听客户端的行动
 */
public interface NotebookSocketListener {
  void onClose(NotebookSocket socket, int code, String message);
  void onOpen(NotebookSocket socket);
  void onMessage(NotebookSocket socket, String message);
}
