/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest;


import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.smartsuites.annotation.ZeppelinApi;
import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.realm.ActiveDirectoryGroupRealm;
import com.smartsuites.realm.LdapRealm;
import com.smartsuites.realm.SmartRealm;
import com.smartsuites.server.JsonResponse;
import com.smartsuites.ticket.TicketContainer;
import com.smartsuites.user.Directory;
import com.smartsuites.user.User;
import com.smartsuites.user.UserService;
import com.smartsuites.utils.SecurityUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.realm.Realm;
import org.apache.shiro.realm.jdbc.JdbcRealm;
import org.apache.shiro.realm.ldap.JndiLdapRealm;
import org.apache.shiro.realm.text.IniRealm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;
import java.util.*;

/**
 * SmartSuites security rest api endpoint.
 */
@Path("/users")
@Produces("application/json")
public class UserRestApi {
  private static final Logger LOG = LoggerFactory.getLogger(UserRestApi.class);

  /**
   * Required by Swagger.
   */
  public UserRestApi() {
    super();
  }

  @GET
  @ZeppelinApi
  public Response getAllUsers() {

    JsonArray result = new JsonArray();
    for(User user: UserService.getAllUsers()){
      JsonObject userElement = new JsonObject();
      userElement.addProperty("username", user.getUsername());
      userElement.addProperty("email", user.getUser_mail());
      userElement.addProperty("time", user.getRegister_time());

      StringBuilder rolesb = new StringBuilder("");
      for(String role : UserService.getRolesByUser(user.getUsername())){
        rolesb.append(role);
        rolesb.append(";");
      }
      String roles = rolesb.toString();
      if(StringUtils.isNotEmpty(roles)){
        roles = roles.substring(0,roles.length()-1);
      }
      userElement.addProperty("roles", roles);

      StringBuilder viewsb = new StringBuilder("");
      for(Directory dir : UserService.getDirsByUser(user.getUsername())){
        viewsb.append(dir);
        viewsb.append(";");
      }
      String views = viewsb.toString();
      if(StringUtils.isNotEmpty(views)){
        views = views.substring(0,views.length()-1);
      }
      userElement.addProperty("views", views);
      result.add(userElement);
    }

    JsonResponse response = new JsonResponse(Response.Status.OK, "", result);
    LOG.warn(response.toString());
    return response.build();
  }

  @POST
  @Path("{username}")
  @Consumes(MediaType.APPLICATION_JSON)
  public Response createNewUser(@PathParam("username") String username, String param) {
    Gson gson = new Gson();
    JsonObject jsonObject = gson.fromJson(param, JsonElement.class).getAsJsonObject();

    User user = new User();
    user.setUsername(username);
    user.setPassword(SmartRealm.getCryptoCredential(jsonObject.get("password").getAsString()));
    user.setUser_mail(jsonObject.get("email").getAsString());
    JsonResponse response = null;
    if(UserService.isUsernameExist(username)){
      response = new JsonResponse(Response.Status.INTERNAL_SERVER_ERROR, "Username Must Unique!");
    }else{
      boolean success = UserService.createNewUser(user);

      if(success){
        UserService.setRoleToUser(user,jsonObject.get("role").getAsString());
      }

      JsonObject userElement = new JsonObject();
      userElement.addProperty("username", user.getUsername());
      userElement.addProperty("email", user.getUser_mail());
      userElement.addProperty("time", user.getRegister_time());
      userElement.addProperty("roles", jsonObject.get("role").getAsString());
      userElement.addProperty("views", "");

      response = new JsonResponse(Response.Status.OK, "", userElement);
    }
    LOG.warn(response.toString());
    return response.build();
  }

  @PUT
  @Path("{username}")
  public Response updateUser(@PathParam("username") String username,
                               String email) {
    User user = UserService.getUserByUsername(username);
    user.setUser_mail(email);
    UserService.updateUser(user);

    JsonObject userElement = new JsonObject();
    userElement.addProperty("username", user.getUsername());
    userElement.addProperty("email", user.getUser_mail());
    userElement.addProperty("time", user.getRegister_time());

    StringBuilder rolesb = new StringBuilder("");
    for(String role : UserService.getRolesByUser(user.getUsername())){
      rolesb.append(role);
      rolesb.append(";");
    }
    String roles = rolesb.toString();
    if(StringUtils.isNotEmpty(roles)){
      roles = roles.substring(0,roles.length()-1);
    }
    userElement.addProperty("roles", roles);

    StringBuilder viewsb = new StringBuilder("");
    for(Directory dir : UserService.getDirsByUser(user.getUsername())){
      viewsb.append(dir);
      viewsb.append(";");
    }
    String views = viewsb.toString();
    if(StringUtils.isNotEmpty(views)){
      views = views.substring(0,views.length()-1);
    }
    userElement.addProperty("views", views);

    JsonResponse response = new JsonResponse(Response.Status.OK, "", userElement);
    LOG.warn(response.toString());
    return response.build();
  }

  @DELETE
  @Path("{username}")
  @ZeppelinApi
  public Response deleteUser(@PathParam("username") String username) {
    User user = UserService.getUserByUsername(username);
    UserService.deleteUser(username);
    JsonResponse response = new JsonResponse(Response.Status.OK, "",user);
    LOG.warn(response.toString());
    return response.build();
  }

  @POST
  @Path("{username}/dir")
  public Response updateUserDirs(@PathParam("username") String username, List<String> param) {
    for(String dir : param){
      UserService.addDirToUser(dir,username);
    }
    JsonResponse response = new JsonResponse(Response.Status.OK, "");
    LOG.warn(response.toString());
    return response.build();
  }

}
