/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.commons.httpclient.methods.GetMethod;
import org.hamcrest.CoreMatchers;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ErrorCollector;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class SecurityRestApiTest extends AbstractTestRestApi {
  Gson gson = new Gson();

  @Rule
  public ErrorCollector collector = new ErrorCollector();

  @BeforeClass
  public static void init() throws Exception {
    AbstractTestRestApi.startUpWithAuthenticationEnable(SecurityRestApiTest.class.getSimpleName());
  }

  @AfterClass
  public static void destroy() throws Exception {
    AbstractTestRestApi.shutDown();
  }

  @Test
  public void testTicket() throws IOException {
    GetMethod get = httpGet("/security/ticket", "admin", "password1");
    get.addRequestHeader("Origin", "http://localhost");
    Map<String, Object> resp = gson.fromJson(get.getResponseBodyAsString(),
        new TypeToken<Map<String, Object>>(){}.getType());
    Map<String, String> body = (Map<String, String>) resp.get("body");
    collector.checkThat("Paramater principal", body.get("principal"),
        CoreMatchers.equalTo("admin"));
    collector.checkThat("Paramater ticket", body.get("ticket"),
        CoreMatchers.not("anonymous"));
    get.releaseConnection();
  }

  @Test
  public void testGetUserList() throws IOException {
    GetMethod get = httpGet("/security/userlist/admi", "admin", "password1");
    get.addRequestHeader("Origin", "http://localhost");
    Map<String, Object> resp = gson.fromJson(get.getResponseBodyAsString(),
        new TypeToken<Map<String, Object>>(){}.getType());
    List<String> userList = (List) ((Map) resp.get("body")).get("users");
    collector.checkThat("Search result size", userList.size(),
        CoreMatchers.equalTo(1));
    collector.checkThat("Search result contains admin", userList.contains("admin"),
        CoreMatchers.equalTo(true));
    get.releaseConnection();

    GetMethod notUser = httpGet("/security/userlist/randomString", "admin", "password1");
    notUser.addRequestHeader("Origin", "http://localhost");
    Map<String, Object> notUserResp = gson.fromJson(notUser.getResponseBodyAsString(),
        new TypeToken<Map<String, Object>>(){}.getType());
    List<String> emptyUserList = (List) ((Map) notUserResp.get("body")).get("users");
    collector.checkThat("Search result size", emptyUserList.size(),
        CoreMatchers.equalTo(0));

    notUser.releaseConnection();
  }
}

