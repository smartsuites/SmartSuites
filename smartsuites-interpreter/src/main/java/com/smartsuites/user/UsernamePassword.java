/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.user;

/**
 * Username and Password POJO
 */
public class UsernamePassword {
  private String username;
  private String password;

  public UsernamePassword(String username, String password) {
    this.username = username;
    this.password = password;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  @Override
  public String toString() {
    return "UsernamePassword{" +
        "username='" + username + '\'' +
        ", password='" + password + '\'' +
        '}';
  }
}
