/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.realm;

import org.jvnet.libpam.UnixUser;

import java.security.Principal;

/**
 * A {@code java.security.Principal} implememtation for use with Shiro {@code PamRealm}
 */
public class UserPrincipal implements Principal {
  private final UnixUser userName;

  public UserPrincipal(UnixUser userName) {
    this.userName = userName;
  }

  @Override
  public String getName() {
    return userName.getUserName();
  }

  public UnixUser getUnixUser() {
    return userName;
  }

  @Override
  public String toString() {
    return String.valueOf(userName.getUserName());
  }
}
