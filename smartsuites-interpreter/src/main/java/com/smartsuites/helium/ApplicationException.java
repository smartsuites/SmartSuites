/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

/**
 * Application exception
 */
public class ApplicationException extends Exception {
  public ApplicationException(String s) {
    super(s);
  }

  public ApplicationException(Exception e) {
    super(e);
  }

  public ApplicationException() {

  }
}
