/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.helium;

/**
 * Type of Helium Package
 */
public enum HeliumType {
  INTERPRETER,
  NOTEBOOK_REPO,
  //运行在解析器进程的包
  APPLICATION,
  //基于前端的可视化组件
  VISUALIZATION,
  //基于前端的解析器
  SPELL
}
