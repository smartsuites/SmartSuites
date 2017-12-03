/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import org.apache.thrift.TException;
import com.smartsuites.interpreter.remote.RemoteInterpreterServer;
import com.smartsuites.interpreter.remote.RemoteInterpreterUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class RemoteInterpreterServerTest {
  @Before
  public void setUp() throws Exception {
  }

  @After
  public void tearDown() throws Exception {
  }

  @Test
  public void testStartStop() throws InterruptedException, IOException, TException {
    RemoteInterpreterServer server = new RemoteInterpreterServer("localhost",
        RemoteInterpreterUtils.findRandomAvailablePortOnAllLocalInterfaces(), true);
    assertEquals(false, server.isRunning());

    server.start();
    long startTime = System.currentTimeMillis();
    boolean running = false;

    while (System.currentTimeMillis() - startTime < 10 * 1000) {
      if (server.isRunning()) {
        running = true;
        break;
      } else {
        Thread.sleep(200);
      }
    }

    assertEquals(true, running);
    assertEquals(true, RemoteInterpreterUtils.checkIfRemoteEndpointAccessible("localhost", server.getPort()));

    server.shutdown();

    while (System.currentTimeMillis() - startTime < 10 * 1000) {
      if (server.isRunning()) {
        Thread.sleep(200);
      } else {
        running = false;
        break;
      }
    }
    assertEquals(false, running);
  }

  class ShutdownRun implements Runnable {
    private RemoteInterpreterServer serv = null;
    public ShutdownRun(RemoteInterpreterServer serv) {
      this.serv = serv;
    }
    @Override
    public void run() {
      try {
        serv.shutdown();
      } catch (Exception ex) {};
    }
  };

  @Test
  public void testStartStopWithQueuedEvents() throws InterruptedException, IOException, TException {
    RemoteInterpreterServer server = new RemoteInterpreterServer("localhost",
        RemoteInterpreterUtils.findRandomAvailablePortOnAllLocalInterfaces(), true);
    assertEquals(false, server.isRunning());

    server.start();
    long startTime = System.currentTimeMillis();
    boolean running = false;

    while (System.currentTimeMillis() - startTime < 10 * 1000) {
      if (server.isRunning()) {
        running = true;
        break;
      } else {
        Thread.sleep(200);
      }
    }

    assertEquals(true, running);
    assertEquals(true, RemoteInterpreterUtils.checkIfRemoteEndpointAccessible("localhost", server.getPort()));

    //just send an event on the client queue
    server.eventClient.onAppStatusUpdate("","","","");

    ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

    Runnable task = new ShutdownRun(server);

    executor.schedule(task, 0, TimeUnit.MILLISECONDS);

    while (System.currentTimeMillis() - startTime < 10 * 1000) {
      if (server.isRunning()) {
        Thread.sleep(200);
      } else {
        running = false;
        break;
      }
    }

    executor.shutdown();

    //cleanup environment for next tests
    server.shutdown();

    assertEquals(false, running);
  }

}
