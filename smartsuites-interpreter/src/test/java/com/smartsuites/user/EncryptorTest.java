/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.user;

import java.io.IOException;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

public class EncryptorTest {

  @Test
  public void testEncryption() throws IOException {
    Encryptor encryptor = new Encryptor("foobar1234567890");

    String input = "test";

    String encrypted = encryptor.encrypt(input);
    assertNotEquals(input, encrypted);

    String decrypted = encryptor.decrypt(encrypted);
    assertEquals(input, decrypted);
  }
}
