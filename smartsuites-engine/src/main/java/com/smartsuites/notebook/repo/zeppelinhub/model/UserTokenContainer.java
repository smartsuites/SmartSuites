/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo.zeppelinhub.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import com.smartsuites.notebook.repo.zeppelinhub.rest.ZeppelinhubRestApiHandler;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * User token manager class.
 *
 */

public class UserTokenContainer {
  private static final Logger LOG = LoggerFactory.getLogger(UserTokenContainer.class);
  private static UserTokenContainer instance = null;
  private ConcurrentMap<String, String> userTokens = new ConcurrentHashMap<String, String>();
  private final ZeppelinhubRestApiHandler restApiClient;
  private String defaultToken;

  public static UserTokenContainer init(ZeppelinhubRestApiHandler restClient, 
      String defaultToken) {
    if (instance == null) {
      instance = new UserTokenContainer(restClient, defaultToken);
    }
    return instance;
  }

  private UserTokenContainer(ZeppelinhubRestApiHandler restClient, String defaultToken) {
    restApiClient = restClient;
    this.defaultToken = defaultToken;
  }

  public static UserTokenContainer getInstance() {
    return instance;
  }
  
  public void setUserToken(String username, String token) {
    if (StringUtils.isBlank(username) || StringUtils.isBlank(token)) {
      LOG.warn("Can't set empty user token");
      return;
    }
    userTokens.put(username, token);
  }
  
  public String getUserToken(String principal) {
    if (StringUtils.isBlank(principal) || "anonymous".equals(principal)) {
      if (StringUtils.isBlank(defaultToken)) {
        return StringUtils.EMPTY;
      } else {
        userTokens.putIfAbsent(principal, defaultToken);
        return defaultToken;
      }
    }
    String token = userTokens.get(principal);
    if (StringUtils.isBlank(token)) {
      String ticket = UserSessionContainer.instance.getSession(principal);
      try {
        token = getDefaultZeppelinInstanceToken(ticket);
        if (StringUtils.isBlank(token)) {
          if (!StringUtils.isBlank(defaultToken)) {
            token = defaultToken;
          }
        } else {
          userTokens.putIfAbsent(principal, token);
        }
      } catch (IOException e) {
        LOG.error("Cannot get user token", e);
        token = StringUtils.EMPTY;
      }
    }
    return token;
  }
  
  public String getExistingUserToken(String principal) {
    if (StringUtils.isBlank(principal) || "anonymous".equals(principal)) {
      return StringUtils.EMPTY;
    }
    String token = userTokens.get(principal);
    if (token == null) {
      return StringUtils.EMPTY;
    }
    return token;
  }
  
  public String removeUserToken(String username) {
    return userTokens.remove(username);
  }
  
  /**
   * Get user default instance.
   * From now, it will be from the first instance from the list,
   * But later we can think about marking a default one and return it instead :)
   */
  public String getDefaultZeppelinInstanceToken(String ticket) throws IOException {
    List<Instance> instances = getUserInstances(ticket);
    if (instances.isEmpty()) {
      return StringUtils.EMPTY;
    }

    String token = instances.get(0).token;
    LOG.debug("The following instance has been assigned {} with token {}", instances.get(0).name,
        token);
    return token;
  }
  
  /**
   * Get list of user instances from Zeppelinhub.
   * This will avoid and remove the needs of setting up token in zeppelin-env.sh.
   */
  public List<Instance> getUserInstances(String ticket) throws IOException {
    if (StringUtils.isBlank(ticket)) {
      return Collections.emptyList();
    }
    return restApiClient.getInstances(ticket);
  }
  
  public List<String> getAllTokens() {
    return new ArrayList<String>(userTokens.values());
  }
  
  public Map<String, String> getAllUserTokens() {
    return new HashMap<String, String>(userTokens);
  }
}
