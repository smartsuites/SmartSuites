/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.PutMethod;
import com.smartsuites.interpreter.InterpreterResult;
import com.smartsuites.notebook.Note;
import com.smartsuites.notebook.Paragraph;
import com.smartsuites.scheduler.Job;
import com.smartsuites.server.ZeppelinServer;
import com.smartsuites.user.AuthenticationInfo;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;

/**
 * Zeppelin notebook rest api tests
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class NotebookRestApiTest extends AbstractTestRestApi {
  Gson gson = new Gson();
  AuthenticationInfo anonymous;

  @BeforeClass
  public static void init() throws Exception {
    startUp(NotebookRestApiTest.class.getSimpleName());
  }

  @AfterClass
  public static void destroy() throws Exception {
    AbstractTestRestApi.shutDown();
  }

  @Before
  public void setUp() {
    anonymous = new AuthenticationInfo("anonymous");
  }

  @Test
  public void testGetNoteParagraphJobStatus() throws IOException {
    Note note1 = ZeppelinServer.notebook.createNote(anonymous);
    note1.addNewParagraph(AuthenticationInfo.ANONYMOUS);

    String paragraphId = note1.getLastParagraph().getId();

    GetMethod get = httpGet("/notebook/job/" + note1.getId() + "/" + paragraphId);
    assertThat(get, isAllowed());
    Map<String, Object> resp = gson.fromJson(get.getResponseBodyAsString(), new TypeToken<Map<String, Object>>() {
    }.getType());
    Map<String, Set<String>> paragraphStatus = (Map<String, Set<String>>) resp.get("body");

    // Check id and status have proper value
    assertEquals(paragraphStatus.get("id"), paragraphId);
    assertEquals(paragraphStatus.get("status"), "READY");

    //cleanup
    ZeppelinServer.notebook.removeNote(note1.getId(), anonymous);

  }

  @Test
  public void testRunParagraphJob() throws IOException {
    Note note1 = ZeppelinServer.notebook.createNote(anonymous);
    note1.addNewParagraph(AuthenticationInfo.ANONYMOUS);

    Paragraph p = note1.addNewParagraph(AuthenticationInfo.ANONYMOUS);

    // run blank paragraph
    PostMethod post = httpPost("/notebook/job/" + note1.getId() + "/" + p.getId(), "");
    assertThat(post, isAllowed());
    Map<String, Object> resp = gson.fromJson(post.getResponseBodyAsString(), new TypeToken<Map<String, Object>>() {
    }.getType());
    assertEquals(resp.get("status"), "OK");
    post.releaseConnection();
    assertEquals(p.getStatus(), Job.Status.FINISHED);

    // run non-blank paragraph
    p.setText("test");
    post = httpPost("/notebook/job/" + note1.getId() + "/" + p.getId(), "");
    assertThat(post, isAllowed());
    resp = gson.fromJson(post.getResponseBodyAsString(), new TypeToken<Map<String, Object>>() {
    }.getType());
    assertEquals(resp.get("status"), "OK");
    post.releaseConnection();
    assertNotEquals(p.getStatus(), Job.Status.READY);

    //cleanup
    ZeppelinServer.notebook.removeNote(note1.getId(), anonymous);
  }

  @Test
  public void testRunAllParagraph_AllSuccess() throws IOException {
    Note note1 = ZeppelinServer.notebook.createNote(anonymous);
    // 2 paragraphs
    // P1:
    //    %python
    //    import time
    //    time.sleep(1)
    //    user='abc'
    // P2:
    //    %python
    //    from __future__ import print_function
    //    print(user)
    //
    Paragraph p1 = note1.addNewParagraph(AuthenticationInfo.ANONYMOUS);
    Paragraph p2 = note1.addNewParagraph(AuthenticationInfo.ANONYMOUS);
    p1.setText("%python import time\ntime.sleep(1)\nuser='abc'");
    p2.setText("%python from __future__ import print_function\nprint(user)");

    PostMethod post = httpPost("/notebook/job/" + note1.getId(), "");
    assertThat(post, isAllowed());
    Map<String, Object> resp = gson.fromJson(post.getResponseBodyAsString(), new TypeToken<Map<String, Object>>() {
    }.getType());
    assertEquals(resp.get("status"), "OK");
    post.releaseConnection();

    assertEquals(Job.Status.FINISHED, p1.getStatus());
    assertEquals(Job.Status.FINISHED, p2.getStatus());
    assertEquals("abc\n", p2.getResult().message().get(0).getData());
  }

  @Test
  public void testRunAllParagraph_FirstFailed() throws IOException {
    Note note1 = ZeppelinServer.notebook.createNote(anonymous);
    // 2 paragraphs
    // P1:
    //    %python
    //    import time
    //    time.sleep(1)
    //    from __future__ import print_function
    //    print(user)
    // P2:
    //    %python
    //    user='abc'
    //
    Paragraph p1 = note1.addNewParagraph(AuthenticationInfo.ANONYMOUS);
    Paragraph p2 = note1.addNewParagraph(AuthenticationInfo.ANONYMOUS);
    p1.setText("%python import time\ntime.sleep(1)\nfrom __future__ import print_function\nprint(user2)");
    p2.setText("%python user2='abc'\nprint(user2)");

    PostMethod post = httpPost("/notebook/job/" + note1.getId(), "");
    assertThat(post, isAllowed());
    Map<String, Object> resp = gson.fromJson(post.getResponseBodyAsString(), new TypeToken<Map<String, Object>>() {
    }.getType());
    assertEquals(resp.get("status"), "OK");
    post.releaseConnection();

    assertEquals(Job.Status.ERROR, p1.getStatus());
    // p2 will be skipped because p1 is failed.
    assertEquals(Job.Status.READY, p2.getStatus());
  }

  @Test
  public void testCloneNote() throws IOException {
    Note note1 = ZeppelinServer.notebook.createNote(anonymous);
    PostMethod post = httpPost("/notebook/" + note1.getId(), "");
    LOG.info("testCloneNote response\n" + post.getResponseBodyAsString());
    assertThat(post, isAllowed());
    Map<String, Object> resp = gson.fromJson(post.getResponseBodyAsString(), new TypeToken<Map<String, Object>>() {
    }.getType());
    String clonedNoteId = (String) resp.get("body");
    post.releaseConnection();

    GetMethod get = httpGet("/notebook/" + clonedNoteId);
    assertThat(get, isAllowed());
    Map<String, Object> resp2 = gson.fromJson(get.getResponseBodyAsString(), new TypeToken<Map<String, Object>>() {
    }.getType());
    Map<String, Object> resp2Body = (Map<String, Object>) resp2.get("body");

    assertEquals((String)resp2Body.get("name"), "Note " + clonedNoteId);
    get.releaseConnection();

    //cleanup
    ZeppelinServer.notebook.removeNote(note1.getId(), anonymous);
    ZeppelinServer.notebook.removeNote(clonedNoteId, anonymous);
  }

  @Test
  public void testUpdateParagraphConfig() throws IOException {
    Note note = ZeppelinServer.notebook.createNote(anonymous);
    String noteId = note.getId();
    Paragraph p = note.addNewParagraph(AuthenticationInfo.ANONYMOUS);
    assertNull(p.getConfig().get("colWidth"));
    String paragraphId = p.getId();
    String jsonRequest = "{\"colWidth\": 6.0}";

    PutMethod put = httpPut("/notebook/" + noteId + "/paragraph/" + paragraphId +"/config", jsonRequest);
    assertThat("test testUpdateParagraphConfig:", put, isAllowed());

    Map<String, Object> resp = gson.fromJson(put.getResponseBodyAsString(), new TypeToken<Map<String, Object>>() {
    }.getType());
    Map<String, Object> respBody = (Map<String, Object>) resp.get("body");
    Map<String, Object> config = (Map<String, Object>) respBody.get("config");
    put.releaseConnection();

    assertEquals(config.get("colWidth"), 6.0);
    note = ZeppelinServer.notebook.getNote(noteId);
    assertEquals(note.getParagraph(paragraphId).getConfig().get("colWidth"), 6.0);

    //cleanup
    ZeppelinServer.notebook.removeNote(noteId, anonymous);
  }

  @Test
  public void testClearAllParagraphOutput() throws IOException {
    // Create note and set result explicitly
    Note note = ZeppelinServer.notebook.createNote(anonymous);
    Paragraph p1 = note.addNewParagraph(AuthenticationInfo.ANONYMOUS);
    InterpreterResult result = new InterpreterResult(InterpreterResult.Code.SUCCESS, InterpreterResult.Type.TEXT, "result");
    p1.setResult(result);

    Paragraph p2 = note.addNewParagraph(AuthenticationInfo.ANONYMOUS);
    p2.setReturn(result, new Throwable());

    // clear paragraph result
    PutMethod put = httpPut("/notebook/" + note.getId() + "/clear", "");
    LOG.info("test clear paragraph output response\n" + put.getResponseBodyAsString());
    assertThat(put, isAllowed());
    put.releaseConnection();

    // check if paragraph results are cleared
    GetMethod get = httpGet("/notebook/" + note.getId() + "/paragraph/" + p1.getId());
    assertThat(get, isAllowed());
    Map<String, Object> resp1 = gson.fromJson(get.getResponseBodyAsString(), new TypeToken<Map<String, Object>>() {
    }.getType());
    Map<String, Object> resp1Body = (Map<String, Object>) resp1.get("body");
    assertNull(resp1Body.get("result"));

    get = httpGet("/notebook/" + note.getId() + "/paragraph/" + p2.getId());
    assertThat(get, isAllowed());
    Map<String, Object> resp2 = gson.fromJson(get.getResponseBodyAsString(), new TypeToken<Map<String, Object>>() {
    }.getType());
    Map<String, Object> resp2Body = (Map<String, Object>) resp2.get("body");
    assertNull(resp2Body.get("result"));
    get.releaseConnection();

    //cleanup
    ZeppelinServer.notebook.removeNote(note.getId(), anonymous);
  }
}