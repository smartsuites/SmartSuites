/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * Response wrapper.
 */
@XmlRootElement
public class NotebookResponse {
  private String msg;

  public NotebookResponse() {}

  public NotebookResponse(String msg) {
    this.msg = msg;
  }
}
