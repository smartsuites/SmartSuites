/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.interpreter.remote;

import com.google.gson.Gson;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.apache.thrift.TException;
import com.smartsuites.helium.ApplicationEventListener;
import com.smartsuites.interpreter.InterpreterException;
import com.smartsuites.interpreter.launcher.InterpreterClient;
import com.smartsuites.interpreter.thrift.RemoteInterpreterService.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Abstract class for interpreter process
 * 解析器进程客户端
 */
public abstract class RemoteInterpreterProcess implements InterpreterClient {
  private static final Logger logger = LoggerFactory.getLogger(RemoteInterpreterProcess.class);

  // 客户端连接池
  private GenericObjectPool<Client> clientPool;
  private RemoteInterpreterEventPoller remoteInterpreterEventPoller;
  private final InterpreterContextRunnerPool interpreterContextRunnerPool;
  private int connectTimeout;

  public RemoteInterpreterProcess(
      int connectTimeout) {
    this.interpreterContextRunnerPool = new InterpreterContextRunnerPool();
    this.connectTimeout = connectTimeout;
  }

  public RemoteInterpreterEventPoller getRemoteInterpreterEventPoller() {
    return remoteInterpreterEventPoller;
  }

  public void setRemoteInterpreterEventPoller(RemoteInterpreterEventPoller eventPoller) {
    this.remoteInterpreterEventPoller = eventPoller;
  }

  public abstract String getHost();
  public abstract int getPort();
  public abstract void start(String userName, Boolean isUserImpersonate);
  public abstract void stop();
  public abstract boolean isRunning();

  public int getConnectTimeout() {
    return connectTimeout;
  }

  public synchronized Client getClient() throws Exception {
    if (clientPool == null || clientPool.isClosed()) {
      clientPool = new GenericObjectPool<>(new ClientFactory(getHost(), getPort()));
    }
    return clientPool.borrowObject();
  }

  private void releaseClient(Client client) {
    releaseClient(client, false);
  }

  private void releaseClient(Client client, boolean broken) {
    if (broken) {
      releaseBrokenClient(client);
    } else {
      try {
        clientPool.returnObject(client);
      } catch (Exception e) {
        logger.warn("exception occurred during releasing thrift client", e);
      }
    }
  }

  private void releaseBrokenClient(Client client) {
    try {
      clientPool.invalidateObject(client);
    } catch (Exception e) {
      logger.warn("exception occurred during releasing thrift client", e);
    }
  }

  /**
   * Called when angular object is updated in client side to propagate
   * change to the remote process
   * @param name
   * @param o
   */
  public void updateRemoteAngularObject(String name, String noteId, String paragraphId, Object o) {
    Client client = null;
    try {
      client = getClient();
    } catch (NullPointerException e) {
      // remote process not started
      logger.info("NullPointerException in RemoteInterpreterProcess while " +
          "updateRemoteAngularObject getClient, remote process not started", e);
      return;
    } catch (Exception e) {
      logger.error("Can't update angular object", e);
    }

    boolean broken = false;
    try {
      Gson gson = new Gson();
      client.angularObjectUpdate(name, noteId, paragraphId, gson.toJson(o));
    } catch (TException e) {
      broken = true;
      logger.error("Can't update angular object", e);
    } catch (NullPointerException e) {
      logger.error("Remote interpreter process not started", e);
      return;
    } finally {
      if (client != null) {
        releaseClient(client, broken);
      }
    }
  }

  public InterpreterContextRunnerPool getInterpreterContextRunnerPool() {
    return interpreterContextRunnerPool;
  }

  public <T> T callRemoteFunction(RemoteFunction<T> func) {
    Client client = null;
    boolean broken = false;
    try {
      client = getClient();
      if (client != null) {
        return func.call(client);
      }
    } catch (TException e) {
      broken = true;
      throw new RuntimeException(e);
    } catch (Exception e1) {
      throw new RuntimeException(e1);
    } finally {
      if (client != null) {
        releaseClient(client, broken);
      }
    }
    return null;
  }

  /**
   *
   * @param <T>
   */
  public interface RemoteFunction<T> {
    T call(Client client) throws Exception;
  }
}
