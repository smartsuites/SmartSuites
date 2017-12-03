/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.apache.commons.httpclient.methods.DeleteMethod;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PutMethod;
import com.smartsuites.notebook.Note;
import com.smartsuites.user.UserCredentials;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;

import static org.junit.Assert.*;

public class CredentialsRestApiTest extends AbstractTestRestApi {
  protected static final Logger LOG = LoggerFactory.getLogger(CredentialsRestApiTest.class);
  Gson gson = new Gson();

  @BeforeClass
  public static void init() throws Exception {
    startUp(CredentialsRestApiTest.class.getSimpleName());
  }

  @AfterClass
  public static void destroy() throws Exception {
    shutDown();
  }

  @Test
  public void testInvalidRequest() throws IOException {
    String jsonInvalidRequestEntityNull = "{\"entity\" : null, \"username\" : \"test\", \"password\" : \"testpass\"}";
    String jsonInvalidRequestNameNull = "{\"entity\" : \"test\", \"username\" : null, \"password\" : \"testpass\"}";
    String jsonInvalidRequestPasswordNull = "{\"entity\" : \"test\", \"username\" : \"test\", \"password\" : null}";
    String jsonInvalidRequestAllNull = "{\"entity\" : null, \"username\" : null, \"password\" : null}";

    PutMethod entityNullPut = httpPut("/credential", jsonInvalidRequestEntityNull);
    entityNullPut.addRequestHeader("Origin", "http://localhost");
    assertThat(entityNullPut, isBadRequest());
    entityNullPut.releaseConnection();

    PutMethod nameNullPut = httpPut("/credential", jsonInvalidRequestNameNull);
    nameNullPut.addRequestHeader("Origin", "http://localhost");
    assertThat(nameNullPut, isBadRequest());
    nameNullPut.releaseConnection();

    PutMethod passwordNullPut = httpPut("/credential", jsonInvalidRequestPasswordNull);
    passwordNullPut.addRequestHeader("Origin", "http://localhost");
    assertThat(passwordNullPut, isBadRequest());
    passwordNullPut.releaseConnection();

    PutMethod allNullPut = httpPut("/credential", jsonInvalidRequestAllNull);
    allNullPut.addRequestHeader("Origin", "http://localhost");
    assertThat(allNullPut, isBadRequest());
    allNullPut.releaseConnection();
  }

  public Map<String, UserCredentials> testGetUserCredentials() throws IOException {
    GetMethod getMethod = httpGet("/credential");
    getMethod.addRequestHeader("Origin", "http://localhost");
    Map<String, Object> resp = gson.fromJson(getMethod.getResponseBodyAsString(),
            new TypeToken<Map<String, Object>>(){}.getType());
    Map<String, Object> body = (Map<String, Object>) resp.get("body");
    Map<String, UserCredentials> credentialMap = (Map<String, UserCredentials>)body.get("userCredentials");
    getMethod.releaseConnection();
    return credentialMap;
  }

  public void testPutUserCredentials(String requestData) throws IOException {
    PutMethod putMethod = httpPut("/credential", requestData);
    putMethod.addRequestHeader("Origin", "http://localhost");
    assertThat(putMethod, isAllowed());
    putMethod.releaseConnection();
  }

  public void testRemoveUserCredentials() throws IOException {
    DeleteMethod deleteMethod = httpDelete("/credential/");
    assertThat("Test delete method:", deleteMethod, isAllowed());
    deleteMethod.releaseConnection();
  }

  public void testRemoveCredentialEntity(String entity) throws IOException {
    DeleteMethod deleteMethod = httpDelete("/credential/" + entity);
    assertThat("Test delete method:", deleteMethod, isAllowed());
    deleteMethod.releaseConnection();
  }

  @Test
  public void testCredentialsAPIs() throws IOException {
    String requestData1 = "{\"entity\" : \"entityname\", \"username\" : \"myuser\", \"password\" : \"mypass\"}";
    String entity = "entityname";
    Map<String, UserCredentials> credentialMap;

    testPutUserCredentials(requestData1);
    credentialMap = testGetUserCredentials();
    assertNotNull("CredentialMap should be null", credentialMap);

    testRemoveCredentialEntity(entity);
    credentialMap = testGetUserCredentials();
    assertNull("CredentialMap should be null", credentialMap.get("entity1"));

    testRemoveUserCredentials();
    credentialMap = testGetUserCredentials();
    assertEquals("Compare CredentialMap", credentialMap.toString(), "{}");
  }
}
