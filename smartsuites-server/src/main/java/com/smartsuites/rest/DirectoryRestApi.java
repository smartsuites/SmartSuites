/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest;


import com.smartsuites.annotation.ZeppelinApi;
import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.notebook.NotebookAuthorization;
import com.smartsuites.realm.ActiveDirectoryGroupRealm;
import com.smartsuites.realm.LdapRealm;
import com.smartsuites.server.JsonResponse;
import com.smartsuites.ticket.TicketContainer;
import com.smartsuites.user.Directory;
import com.smartsuites.user.UserService;
import com.smartsuites.utils.SecurityUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.realm.Realm;
import org.apache.shiro.realm.jdbc.JdbcRealm;
import org.apache.shiro.realm.ldap.JndiLdapRealm;
import org.apache.shiro.realm.text.IniRealm;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.io.File;
import java.util.*;

/**
 * SmartSuites Directory rest api endpoint.
 */
@Path("/directory")
@Produces("application/json")
public class DirectoryRestApi {
  private static final Logger LOG = LoggerFactory.getLogger(DirectoryRestApi.class);

  /**
   * Required by Swagger.
   */
  public DirectoryRestApi() {
    super();
  }

  @GET
  @ZeppelinApi
  public Response getAllDirectories() {
    JsonResponse response = new JsonResponse(Response.Status.OK, "", UserService.getAllDirs());
    LOG.warn(response.toString());
    return response.build();
  }

  @POST
  @Path("{id}/{dirname}")
  @ZeppelinApi
  public Response createNewDir(@PathParam("id") String id,
                              @PathParam("dirname") String dirname) {
    Directory directory = UserService.getDirById(id);
    Directory current = new Directory();
    current.setDirectory_name(dirname);
    current.setDirectory_path(directory.getDirectory_path() + File.separator + dirname);
    current.setParent_directory(directory.getId());
    boolean success = UserService.createNewDir(directory,current);
    JsonResponse response = new JsonResponse(Response.Status.OK, "", current);
    LOG.warn(response.toString());
    return response.build();
  }

  @PUT
  @Path("{id}/{dirname}")
  @ZeppelinApi
  public Response updateNewDir(@PathParam("id") String id,
                               @PathParam("dirname") String dirname) {
    Directory directory = UserService.getDirById(id);
    directory.setDirectory_name(dirname);
    directory.setDirectory_path(directory.getDirectory_path().substring(0, directory.getDirectory_path().lastIndexOf(File.separator) + 1) + dirname);

    boolean success = UserService.updateDir(directory);
    JsonResponse response = new JsonResponse(Response.Status.OK, "", directory);
    LOG.warn(response.toString());
    return response.build();
  }

  @DELETE
  @Path("{id}")
  @ZeppelinApi
  public Response deleteDir(@PathParam("id") String id) {
    Directory directory = UserService.getDirById(id);
    boolean success = UserService.deleteDir(directory);
    JsonResponse response = new JsonResponse(Response.Status.OK, "",directory);
    LOG.warn(response.toString());
    return response.build();
  }

}
