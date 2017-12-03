/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import com.smartsuites.annotation.ZeppelinApi;
import com.smartsuites.server.JsonResponse;
import com.smartsuites.util.Util;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

/**
 * Zeppelin root rest api endpoint.
 *
 * @since 0.3.4
 */
@Path("/")
public class ZeppelinRestApi {

  public ZeppelinRestApi() {
  }

  /**
   * Get the root endpoint Return always 200.
   *
   * @return 200 response
   */
  @GET
  public Response getRoot() {
    return Response.ok().build();
  }

  @GET
  @Path("version")
  @ZeppelinApi
  public Response getVersion() {
    Map<String, String> versionInfo = new HashMap<>();
    versionInfo.put("version", Util.getVersion());
    versionInfo.put("git-commit-id", Util.getGitCommitId());
    versionInfo.put("git-timestamp", Util.getGitTimestamp());

    return new JsonResponse<>(Response.Status.OK, "Zeppelin version", versionInfo).build();
  }

  /**
   * Set the log level for root logger
   * @param request
   * @param logLevel new log level for Rootlogger
   * @return
   */
  @PUT
  @Path("log/level/{logLevel}")
  public Response changeRootLogLevel(@Context HttpServletRequest request,
      @PathParam("logLevel") String logLevel) {
    Level level = Level.toLevel(logLevel);
    if (logLevel.toLowerCase().equalsIgnoreCase(level.toString().toLowerCase())) {
      Logger.getRootLogger().setLevel(level);
      return new JsonResponse<>(Response.Status.OK).build();
    } else {
      return new JsonResponse<>(Response.Status.NOT_ACCEPTABLE,
          "Please check LOG level specified. Valid values: DEBUG, ERROR, FATAL, "
              + "INFO, TRACE, WARN").build();
    }
  }
}
