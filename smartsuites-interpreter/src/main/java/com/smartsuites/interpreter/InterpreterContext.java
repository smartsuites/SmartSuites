/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.smartsuites.display.AngularObjectRegistry;
import com.smartsuites.display.GUI;
import com.smartsuites.interpreter.remote.RemoteEventClient;
import com.smartsuites.interpreter.remote.RemoteEventClientWrapper;
import com.smartsuites.interpreter.remote.RemoteInterpreterEventClient;
import com.smartsuites.resource.ResourcePool;
import com.smartsuites.user.AuthenticationInfo;

/**
 * Interpreter context
 */
public class InterpreterContext {

  private static final ThreadLocal<InterpreterContext> threadIC = new ThreadLocal<>();

  public InterpreterOutput out;

  public static InterpreterContext get() {
    return threadIC.get();
  }

  public static void set(InterpreterContext ic) {
    threadIC.set(ic);
  }

  public static void remove() {
    threadIC.remove();
  }

  private String noteId;
  private String replName;
  private String paragraphTitle;
  private String paragraphId;
  private String paragraphText;
  private AuthenticationInfo authenticationInfo;
  private Map<String, Object> config = new HashMap<>();
  private GUI gui = new GUI();
  private AngularObjectRegistry angularObjectRegistry;
  private ResourcePool resourcePool;
  private List<InterpreterContextRunner> runners = new ArrayList<>();
  private String className;
  private RemoteEventClientWrapper client;
  private RemoteWorksController remoteWorksController;
  private Map<String, Integer> progressMap;

  /**
   * Builder class for InterpreterContext
   */
  public static class Builder {
    private InterpreterContext context = new InterpreterContext();

    public Builder setNoteId(String noteId) {
      context.noteId = noteId;
      return this;
    }

    public Builder setParagraphId(String paragraphId) {
      context.paragraphId = paragraphId;
      return this;
    }

    public InterpreterContext getContext() {
      return context;
    }
  }

  private InterpreterContext() {

  }

  // visible for testing
  public InterpreterContext(String noteId,
                            String paragraphId,
                            String replName,
                            String paragraphTitle,
                            String paragraphText,
                            AuthenticationInfo authenticationInfo,
                            Map<String, Object> config,
                            GUI gui,
                            AngularObjectRegistry angularObjectRegistry,
                            ResourcePool resourcePool,
                            List<InterpreterContextRunner> runners,
                            InterpreterOutput out
                            ) {
    this(noteId, paragraphId, replName, paragraphTitle, paragraphText, authenticationInfo,
        config, gui, angularObjectRegistry, resourcePool, runners, out, null, null);
  }

  public InterpreterContext(String noteId,
                            String paragraphId,
                            String replName,
                            String paragraphTitle,
                            String paragraphText,
                            AuthenticationInfo authenticationInfo,
                            Map<String, Object> config,
                            GUI gui,
                            AngularObjectRegistry angularObjectRegistry,
                            ResourcePool resourcePool,
                            List<InterpreterContextRunner> runners,
                            InterpreterOutput out,
                            RemoteWorksController remoteWorksController,
                            Map<String, Integer> progressMap
                            ) {
    this.noteId = noteId;
    this.paragraphId = paragraphId;
    this.replName = replName;
    this.paragraphTitle = paragraphTitle;
    this.paragraphText = paragraphText;
    this.authenticationInfo = authenticationInfo;
    this.config = config;
    this.gui = gui;
    this.angularObjectRegistry = angularObjectRegistry;
    this.resourcePool = resourcePool;
    this.runners = runners;
    this.out = out;
    this.remoteWorksController = remoteWorksController;
    this.progressMap = progressMap;
  }

  public InterpreterContext(String noteId,
                            String paragraphId,
                            String replName,
                            String paragraphTitle,
                            String paragraphText,
                            AuthenticationInfo authenticationInfo,
                            Map<String, Object> config,
                            GUI gui,
                            AngularObjectRegistry angularObjectRegistry,
                            ResourcePool resourcePool,
                            List<InterpreterContextRunner> contextRunners,
                            InterpreterOutput output,
                            RemoteWorksController remoteWorksController,
                            RemoteInterpreterEventClient eventClient,
                            Map<String, Integer> progressMap) {
    this(noteId, paragraphId, replName, paragraphTitle, paragraphText, authenticationInfo,
        config, gui, angularObjectRegistry, resourcePool, contextRunners, output,
        remoteWorksController, progressMap);
    this.client = new RemoteEventClient(eventClient);
  }

  public String getNoteId() {
    return noteId;
  }

  public String getReplName() {
    return replName;
  }

  public String getParagraphId() {
    return paragraphId;
  }

  public String getParagraphText() {
    return paragraphText;
  }

  public String getParagraphTitle() {
    return paragraphTitle;
  }

  public AuthenticationInfo getAuthenticationInfo() {
    return authenticationInfo;
  }

  public Map<String, Object> getConfig() {
    return config;
  }

  public GUI getGui() {
    return gui;
  }

  public AngularObjectRegistry getAngularObjectRegistry() {
    return angularObjectRegistry;
  }

  public ResourcePool getResourcePool() {
    return resourcePool;
  }

  public List<InterpreterContextRunner> getRunners() {
    return runners;
  }

  public String getClassName() {
    return className;
  }
  
  public void setClassName(String className) {
    this.className = className;
  }

  public RemoteEventClientWrapper getClient() {
    return client;
  }

  public RemoteWorksController getRemoteWorksController() {
    return remoteWorksController;
  }

  public void setRemoteWorksController(RemoteWorksController remoteWorksController) {
    this.remoteWorksController = remoteWorksController;
  }

  public InterpreterOutput out() {
    return out;
  }

  /**
   * Set progress of paragraph manually
   * @param n integer from 0 to 100
   */
  public void setProgress(int n) {
    if (progressMap != null) {
      n = Math.max(n, 0);
      n = Math.min(n, 100);
      progressMap.put(paragraphId, new Integer(n));
    }
  }
}
