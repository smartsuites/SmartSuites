/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.user;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * User Credentials POJO
 */
public class UserCredentials {

  private Map<String, UsernamePassword> userCredentials = new ConcurrentHashMap<>();

  public UsernamePassword getUsernamePassword(String entity) {
    return userCredentials.get(entity);
  }

  public void putUsernamePassword(String entity, UsernamePassword up) {
    userCredentials.put(entity, up);
  }

  public void removeUsernamePassword(String entity) {
    userCredentials.remove(entity);
  }

  public boolean existUsernamePassword(String entity) {
    return userCredentials.containsKey(entity);
  }

  @Override
  public String toString() {
    return "UserCredentials{" +
        "userCredentials=" + userCredentials +
        '}';
  }
}
