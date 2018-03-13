/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.security;

import com.smartsuites.rest.AbstractTestRestApi;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import com.smartsuites.conf.SmartsuitesConfiguration;
import org.junit.Test;

public class DirAccessTest extends AbstractTestRestApi {

  @Test
  public void testDirAccessForbidden() throws Exception {
    synchronized (this) {
      System.setProperty(SmartsuitesConfiguration.ConfVars.SMARTSUITES_SERVER_DEFAULT_DIR_ALLOWED.getVarName(), "false");
      AbstractTestRestApi.startUp(DirAccessTest.class.getSimpleName());
      HttpClient httpClient = new HttpClient();
      GetMethod getMethod = new GetMethod(getUrlToTest() + "/app/");
      httpClient.executeMethod(getMethod);
      AbstractTestRestApi.shutDown();
      assert getMethod.getStatusCode() == HttpStatus.SC_FORBIDDEN;
    }
  }

  @Test
  public void testDirAccessOk() throws Exception {
    synchronized (this) {
      System.setProperty(SmartsuitesConfiguration.ConfVars.SMARTSUITES_SERVER_DEFAULT_DIR_ALLOWED.getVarName(), "true");
      AbstractTestRestApi.startUp(DirAccessTest.class.getSimpleName());
      HttpClient httpClient = new HttpClient();
      GetMethod getMethod = new GetMethod(getUrlToTest() + "/app/");
      httpClient.executeMethod(getMethod);
      AbstractTestRestApi.shutDown();
      assert getMethod.getStatusCode() == HttpStatus.SC_OK;
    }
  }

  protected static String getUrlToTest() {
    String url = "http://localhost:8080";
    if (System.getProperty("url") != null) {
      url = System.getProperty("url");
    }
    return url;
  }
}

