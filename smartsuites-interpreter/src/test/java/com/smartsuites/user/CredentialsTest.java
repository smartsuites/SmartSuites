/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.user;

import static org.junit.Assert.*;

import org.junit.Test;

import java.io.IOException;

public class CredentialsTest {

  @Test
  public void testDefaultProperty() throws IOException {
    Credentials credentials = new Credentials(false, null, null);
    UserCredentials userCredentials = new UserCredentials();
    UsernamePassword up1 = new UsernamePassword("user2", "password");
    userCredentials.putUsernamePassword("hive(vertica)", up1);
    credentials.putUserCredentials("user1", userCredentials);
    UserCredentials uc2 = credentials.getUserCredentials("user1");
    UsernamePassword up2 = uc2.getUsernamePassword("hive(vertica)");
    assertEquals(up1.getUsername(), up2.getUsername());
    assertEquals(up1.getPassword(), up2.getPassword());
  }
}
