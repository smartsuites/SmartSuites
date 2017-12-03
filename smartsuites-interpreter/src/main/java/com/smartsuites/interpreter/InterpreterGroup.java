/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import com.smartsuites.resource.ResourcePool;
import com.smartsuites.display.AngularObjectRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.security.SecureRandom;
import java.util.concurrent.ConcurrentHashMap;

/**
 * InterpreterGroup is collections of interpreter sessions.
 * One session could include multiple interpreters.
 * For example spark, pyspark, sql interpreters are in the same 'spark' interpreter session.
 *
 * Remember, list of interpreters are dedicated to a session. Session could be shared across user
 * or notes, so the sessionId could be user or noteId or their combination.
 * So InterpreterGroup internally manages map of [sessionId(noteId, user, or
 * their combination), list of interpreters]
 *
 * A InterpreterGroup runs interpreter process while its subclass ManagedInterpreterGroup runs
 * in zeppelin server process.
 */
public class InterpreterGroup {

  private static final Logger LOGGER = LoggerFactory.getLogger(InterpreterGroup.class);

  protected String id;
  // sessionId --> interpreters
  protected Map<String, List<Interpreter>> sessions = new ConcurrentHashMap();
  private AngularObjectRegistry angularObjectRegistry;
  private InterpreterHookRegistry hookRegistry;
  private ResourcePool resourcePool;
  private boolean angularRegistryPushed = false;

  /**
   * Create InterpreterGroup with given id, used in InterpreterProcess
   * @param id
   */
  public InterpreterGroup(String id) {
    this.id = id;
  }

  /**
   * Create InterpreterGroup with autogenerated id
   */
  public InterpreterGroup() {
    this.id = generateId();
  }

  private static String generateId() {
    return "InterpreterGroup_" + System.currentTimeMillis() + "_" + new SecureRandom().nextInt();
  }

  public String getId() {
    return this.id;
  }

  //TODO(zjffdu) change it to getSession. For now just keep this method to reduce code change
  public synchronized List<Interpreter> get(String sessionId) {
    return sessions.get(sessionId);
  }

  //TODO(zjffdu) change it to addSession. For now just keep this method to reduce code change
  public synchronized void put(String sessionId, List<Interpreter> interpreters) {
    this.sessions.put(sessionId, interpreters);
  }

  public synchronized void addInterpreterToSession(Interpreter interpreter, String sessionId) {
    LOGGER.debug("Add Interpreter {} to session {}", interpreter.getClassName(), sessionId);
    List<Interpreter> interpreters = get(sessionId);
    if (interpreters == null) {
      interpreters = new ArrayList<>();
    }
    interpreters.add(interpreter);
    put(sessionId, interpreters);
  }

  //TODO(zjffdu) rename it to a more proper name.
  //For now just keep this method to reduce code change
  public Collection<List<Interpreter>> values() {
    return sessions.values();
  }

  public AngularObjectRegistry getAngularObjectRegistry() {
    return angularObjectRegistry;
  }
  
  public void setAngularObjectRegistry(AngularObjectRegistry angularObjectRegistry) {
    this.angularObjectRegistry = angularObjectRegistry;
  }
  
  public InterpreterHookRegistry getInterpreterHookRegistry() {
    return hookRegistry;
  }
  
  public void setInterpreterHookRegistry(InterpreterHookRegistry hookRegistry) {
    this.hookRegistry = hookRegistry;
  }

  public int getSessionNum() {
    return sessions.size();
  }

  public void setResourcePool(ResourcePool resourcePool) {
    this.resourcePool = resourcePool;
  }

  public ResourcePool getResourcePool() {
    return resourcePool;
  }

  public boolean isAngularRegistryPushed() {
    return angularRegistryPushed;
  }

  public void setAngularRegistryPushed(boolean angularRegistryPushed) {
    this.angularRegistryPushed = angularRegistryPushed;
  }

  public boolean isEmpty() {
    return sessions.isEmpty();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof InterpreterGroup)) {
      return false;
    }

    InterpreterGroup that = (InterpreterGroup) o;

    return id != null ? id.equals(that.id) : that.id == null;
  }

  @Override
  public int hashCode() {
    return id != null ? id.hashCode() : 0;
  }
}