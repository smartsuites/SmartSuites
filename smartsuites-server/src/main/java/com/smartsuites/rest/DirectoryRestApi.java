/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest;


import com.smartsuites.annotation.ZeppelinApi;
import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.notebook.Note;
import com.smartsuites.notebook.Notebook;
import com.smartsuites.notebook.NotebookAuthorization;
import com.smartsuites.realm.ActiveDirectoryGroupRealm;
import com.smartsuites.realm.LdapRealm;
import com.smartsuites.server.JsonResponse;
import com.smartsuites.ticket.TicketContainer;
import com.smartsuites.user.DirNotes;
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

  private Notebook notebook;

  /**
   * Required by Swagger.
   */
  public DirectoryRestApi(Notebook notebook) {
    super();
    this.notebook = notebook;
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

  @POST
  @Path("{dirid}/{username}/{noteid}")
  @ZeppelinApi
  public Response addNoteToDir(@PathParam("dirid") String dirid,
                               @PathParam("username") String username,
                               @PathParam("noteid") String noteid) {
    UserService.addNoteToDir(dirid, username,noteid);

    JsonResponse response = new JsonResponse(Response.Status.OK, "");
    LOG.warn(response.toString());
    return response.build();
  }

  @DELETE
  @Path("{dirid}/{username}/{noteid}")
  @ZeppelinApi
  public Response deleteNoteToDir(@PathParam("dirid") String dirid,
                                  @PathParam("username") String username,
                                  @PathParam("noteid") String noteid) {
    UserService.removeNoteToDir(dirid, username,noteid);
    JsonResponse response = new JsonResponse(Response.Status.OK, "");
    LOG.warn(response.toString());
    return response.build();
  }

  @GET
  @Path("{dirid}/{username}")
  @ZeppelinApi
  public Response getNoteToDir(@PathParam("dirid") String dirid,@PathParam("username") String username) {
    List<String> notes = UserService.getNoteToDir(dirid, username);
    List<Note> noteList = new ArrayList<>();
    for(String noteid : notes){
      noteList.add(notebook.getNote(noteid));
    }
    JsonResponse response = new JsonResponse(Response.Status.OK, "",noteList);
    LOG.warn(response.toString());
    return response.build();
  }

  private boolean isDirExist(List<Directory> directories, String dirid){
    for(Directory directory:directories){
      if(directory.getId().equalsIgnoreCase(dirid))
        return true;
    }
    return false;
  }

  private void fillFullDir(List<Directory> allDirs, Directory dir){
    // -1 means the top tree
    if(dir.getParent_directory().equalsIgnoreCase("-1"))
      return;

    Directory parent = UserService.getDirById(dir.getParent_directory());
    if(!isDirExist(allDirs, parent.getId())){
      allDirs.add(parent);
      fillFullDir(allDirs, parent);
    }

  }

  @GET
  @Path("{username}")
  @ZeppelinApi
  public Response getUserDirs(@PathParam("username") String username) {

    // 有权限的目录
    List<Directory> ownDirs = UserService.getDirsByUser(username);

    // 获取所有路线的目录
    List<Directory> allDirs = new ArrayList<>();
    allDirs.addAll(ownDirs);

    for(Directory ownDir: ownDirs){
      fillFullDir(allDirs, ownDir);
    }

    List<DirNotes> dirNotes = new ArrayList<>();
    for(Directory dir:ownDirs){
      List<DirNotes> notes = UserService.getNoteToDir(dir.getId());
      for (DirNotes dirN : notes){
        dirN.setName(notebook.getNote(dirN.getNote()).getNameWithoutPath());
      }
      dirNotes.addAll(notes);
    }

    HashMap<String, List> result = new HashMap<>();
    result.put("dirs",allDirs);
    result.put("notes",dirNotes);

    JsonResponse response = new JsonResponse(Response.Status.OK, "",result);
    LOG.warn(response.toString());
    return response.build();
  }

}
