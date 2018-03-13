/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote;

import com.google.gson.Gson;
import com.smartsuites.display.AngularObject;
import com.smartsuites.display.AngularObjectRegistry;
import com.smartsuites.display.AngularObjectRegistryListener;
import com.smartsuites.interpreter.InterpreterGroup;
import com.smartsuites.interpreter.ManagedInterpreterGroup;
import com.smartsuites.interpreter.thrift.RemoteInterpreterService.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * Proxy for AngularObjectRegistry that exists in remote interpreter process
 */
public class RemoteAngularObjectRegistry extends AngularObjectRegistry {
  Logger logger = LoggerFactory.getLogger(RemoteAngularObjectRegistry.class);
  private ManagedInterpreterGroup interpreterGroup;

  public RemoteAngularObjectRegistry(String interpreterId,
                                     AngularObjectRegistryListener listener,
                                     ManagedInterpreterGroup interpreterGroup) {
    super(interpreterId, listener);
    this.interpreterGroup = interpreterGroup;
  }

  private RemoteInterpreterProcess getRemoteInterpreterProcess() {
    return interpreterGroup.getRemoteInterpreterProcess();
  }

  /**
   * When SmartsuitesServer side code want to add angularObject to the registry,
   * this method should be used instead of add()
   * @param name
   * @param o
   * @param noteId
   * @return
   */
  public AngularObject addAndNotifyRemoteProcess(final String name,
                                                 final Object o,
                                                 final String noteId,
                                                 final String paragraphId) {

    RemoteInterpreterProcess remoteInterpreterProcess = getRemoteInterpreterProcess();
    if (!remoteInterpreterProcess.isRunning()) {
      return super.add(name, o, noteId, paragraphId, true);
    }

    remoteInterpreterProcess.callRemoteFunction(
        new RemoteInterpreterProcess.RemoteFunction<Void>() {
          @Override
          public Void call(Client client) throws Exception {
            Gson gson = new Gson();
            client.angularObjectAdd(name, noteId, paragraphId, gson.toJson(o));
            return null;
          }
        }
    );

    return super.add(name, o, noteId, paragraphId, true);

  }

  /**
   * When SmartsuitesServer side code want to remove angularObject from the registry,
   * this method should be used instead of remove()
   * @param name
   * @param noteId
   * @param paragraphId
   * @return
   */
  public AngularObject removeAndNotifyRemoteProcess(final String name,
                                                    final String noteId,
                                                    final String paragraphId) {
    RemoteInterpreterProcess remoteInterpreterProcess = getRemoteInterpreterProcess();
    if (remoteInterpreterProcess == null || !remoteInterpreterProcess.isRunning()) {
      return super.remove(name, noteId, paragraphId);
    }
    remoteInterpreterProcess.callRemoteFunction(
      new RemoteInterpreterProcess.RemoteFunction<Void>() {
        @Override
        public Void call(Client client) throws Exception {
          client.angularObjectRemove(name, noteId, paragraphId);
          return null;
        }
      }
    );

    return super.remove(name, noteId, paragraphId);
  }
  
  public void removeAllAndNotifyRemoteProcess(String noteId, String paragraphId) {
    List<AngularObject> all = getAll(noteId, paragraphId);
    for (AngularObject ao : all) {
      removeAndNotifyRemoteProcess(ao.getName(), noteId, paragraphId);
    }
  }

  @Override
  protected AngularObject createNewAngularObject(String name, Object o, String noteId, String
          paragraphId) {
    return new RemoteAngularObject(name, o, noteId, paragraphId, interpreterGroup,
        getAngularObjectListener());
  }
}
