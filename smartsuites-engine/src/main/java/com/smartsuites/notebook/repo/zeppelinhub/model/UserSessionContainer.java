/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo.zeppelinhub.model;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.lang.StringUtils;

/**
 * Simple and yet dummy container for zeppelinhub session.
 * 
 */
public class UserSessionContainer {
  private static class Entity {
    public final String userSession;
    
    Entity(String userSession) {
      this.userSession = userSession;
    }
  }

  private Map<String, Entity> sessions = new ConcurrentHashMap<>();

  public static final UserSessionContainer instance = new UserSessionContainer();

  public synchronized String getSession(String principal) {
    Entity entry = sessions.get(principal);
    if (entry == null) {
      return StringUtils.EMPTY;
    }
    return entry.userSession;
  }
  
  public synchronized String setSession(String principal, String userSession) {
    Entity entry = new Entity(userSession);
    sessions.put(principal, entry);
    return entry.userSession;
  }
}
