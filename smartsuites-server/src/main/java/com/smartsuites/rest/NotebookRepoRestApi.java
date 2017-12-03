/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.rest;

import java.util.Collections;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.smartsuites.utils.SecurityUtils;
import org.apache.commons.lang.StringUtils;
import com.smartsuites.annotation.ZeppelinApi;
import com.smartsuites.notebook.repo.NotebookRepoSync;
import com.smartsuites.notebook.repo.NotebookRepoWithSettings;
import com.smartsuites.rest.message.NotebookRepoSettingsRequest;
import com.smartsuites.server.JsonResponse;
import com.smartsuites.socket.NotebookServer;
import com.smartsuites.user.AuthenticationInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.ImmutableMap;
import com.google.gson.JsonSyntaxException;

/**
 * NoteRepo rest API endpoint.
 *
 */
@Path("/notebook-repositories")
@Produces("application/json")
public class NotebookRepoRestApi {

  private static final Logger LOG = LoggerFactory.getLogger(NotebookRepoRestApi.class);

  private NotebookRepoSync noteRepos;
  private NotebookServer notebookWsServer;

  public NotebookRepoRestApi() {}

  public NotebookRepoRestApi(NotebookRepoSync noteRepos, NotebookServer notebookWsServer) {
    this.noteRepos = noteRepos;
    this.notebookWsServer = notebookWsServer;
  }

  /**
   * List all notebook repository
   */
  @GET
  @ZeppelinApi
  public Response listRepoSettings() {
    AuthenticationInfo subject = new AuthenticationInfo(SecurityUtils.getPrincipal());
    LOG.info("Getting list of NoteRepo with Settings for user {}", subject.getUser());
    List<NotebookRepoWithSettings> settings = noteRepos.getNotebookRepos(subject);
    return new JsonResponse<>(Status.OK, "", settings).build();
  }

  /**
   * Reload notebook repository
   */
  @GET
  @Path("reload")
  @ZeppelinApi
  public Response refreshRepo(){
    AuthenticationInfo subject = new AuthenticationInfo(SecurityUtils.getPrincipal());
    LOG.info("Reloading notebook repository for user {}", subject.getUser());
    notebookWsServer.broadcastReloadedNoteList(subject, null);
    return new JsonResponse<>(Status.OK, "", null).build();
  }

  /**
   * Update a specific note repo.
   *
   * @param payload
   * @return
   */
  @PUT
  @ZeppelinApi
  public Response updateRepoSetting(String payload) {
    if (StringUtils.isBlank(payload)) {
      return new JsonResponse<>(Status.NOT_FOUND, "", Collections.emptyMap()).build();
    }
    AuthenticationInfo subject = new AuthenticationInfo(SecurityUtils.getPrincipal());
    NotebookRepoSettingsRequest newSettings = NotebookRepoSettingsRequest.EMPTY;
    try {
      newSettings = NotebookRepoSettingsRequest.fromJson(payload);
    } catch (JsonSyntaxException e) {
      LOG.error("Cannot update notebook repo settings", e);
      return new JsonResponse<>(Status.NOT_ACCEPTABLE, "",
          ImmutableMap.of("error", "Invalid payload structure")).build();
    }

    if (NotebookRepoSettingsRequest.isEmpty(newSettings)) {
      LOG.error("Invalid property");
      return new JsonResponse<>(Status.NOT_ACCEPTABLE, "",
          ImmutableMap.of("error", "Invalid payload")).build();
    }
    LOG.info("User {} is going to change repo setting", subject.getUser());
    NotebookRepoWithSettings updatedSettings =
        noteRepos.updateNotebookRepo(newSettings.name, newSettings.settings, subject);
    if (!updatedSettings.isEmpty()) {
      LOG.info("Broadcasting note list to user {}", subject.getUser());
      notebookWsServer.broadcastReloadedNoteList(subject, null);
    }
    return new JsonResponse<>(Status.OK, "", updatedSettings).build();
  }
}
