/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote;

import org.junit.Test;

import java.io.IOException;

import static org.junit.Assert.assertTrue;

public class RemoteInterpreterUtilsTest {

  @Test
  public void testFindRandomAvailablePortOnAllLocalInterfaces() throws IOException {
    assertTrue(RemoteInterpreterUtils.findRandomAvailablePortOnAllLocalInterfaces() > 0);

    String portRange = ":30000";
    assertTrue(RemoteInterpreterUtils.findRandomAvailablePortOnAllLocalInterfaces(portRange) <= 30000);

    portRange = "30000:";
    assertTrue(RemoteInterpreterUtils.findRandomAvailablePortOnAllLocalInterfaces(portRange) >= 30000);

    portRange = "30000:40000";
    int port = RemoteInterpreterUtils.findRandomAvailablePortOnAllLocalInterfaces(portRange);
    assertTrue(port >= 30000 && port <= 40000);
  }


}
