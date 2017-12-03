/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.pool2.BasePooledObjectFactory;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.impl.DefaultPooledObject;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TProtocol;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TTransportException;
import com.smartsuites.interpreter.InterpreterException;
import com.smartsuites.interpreter.thrift.RemoteInterpreterService;
import com.smartsuites.interpreter.thrift.RemoteInterpreterService.Client;

/**
 *
 */
public class ClientFactory extends BasePooledObjectFactory<Client>{
  private String host;
  private int port;
  Map<Client, TSocket> clientSocketMap = new HashMap<>();

  public ClientFactory(String host, int port) {
    this.host = host;
    this.port = port;
  }

  @Override
  public Client create() throws Exception {
    TSocket transport = new TSocket(host, port);
    try {
      transport.open();
    } catch (TTransportException e) {
      throw new InterpreterException(e);
    }

    TProtocol protocol = new  TBinaryProtocol(transport);
    Client client = new RemoteInterpreterService.Client(protocol);

    synchronized (clientSocketMap) {
      clientSocketMap.put(client, transport);
    }
    return client;
  }

  @Override
  public PooledObject<Client> wrap(Client client) {
    return new DefaultPooledObject<>(client);
  }

  @Override
  public void destroyObject(PooledObject<Client> p) {
    synchronized (clientSocketMap) {
      if (clientSocketMap.containsKey(p.getObject())) {
        clientSocketMap.get(p.getObject()).close();
        clientSocketMap.remove(p.getObject());
      }
    }
  }

  @Override
  public boolean validateObject(PooledObject<Client> p) {
    return p.getObject().getOutputProtocol().getTransport().isOpen();
  }
}
