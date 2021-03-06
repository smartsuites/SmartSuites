/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */


package com.smartsuites.interpreter;

import com.smartsuites.interpreter.remote.RemoteInterpreterProcess;
import com.smartsuites.scheduler.Job;
import com.smartsuites.scheduler.Scheduler;
import com.smartsuites.scheduler.SchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

/**
 * ManagedInterpreterGroup runs under zeppelin server
 */
public class ManagedInterpreterGroup extends InterpreterGroup {

  private static final Logger LOGGER = LoggerFactory.getLogger(ManagedInterpreterGroup.class);

  private InterpreterSetting interpreterSetting;
  private RemoteInterpreterProcess remoteInterpreterProcess; // attached remote interpreter process

  /**
   * Create InterpreterGroup with given id and interpreterSetting, used in ZeppelinServer
   * @param id
   * @param interpreterSetting
   */
  ManagedInterpreterGroup(String id, InterpreterSetting interpreterSetting) {
    super(id);
    this.interpreterSetting = interpreterSetting;
    interpreterSetting.getLifecycleManager().onInterpreterGroupCreated(this);
  }

  public InterpreterSetting getInterpreterSetting() {
    return interpreterSetting;
  }

  public synchronized RemoteInterpreterProcess getOrCreateInterpreterProcess() throws IOException {
    if (remoteInterpreterProcess == null) {
      LOGGER.info("Create InterperterProcess for InterpreterGroup: " + getId());
      remoteInterpreterProcess = interpreterSetting.createInterpreterProcess();
    }
    return remoteInterpreterProcess;
  }

  public RemoteInterpreterProcess getRemoteInterpreterProcess() {
    return remoteInterpreterProcess;
  }


  /**
   * Close all interpreter instances in this group
   */
  public synchronized void close() {
    LOGGER.info("Close InterpreterGroup: " + id);
    for (String sessionId : sessions.keySet()) {
      close(sessionId);
    }
  }

  /**
   * Close all interpreter instances in this session
   * @param sessionId
   */
  public synchronized void close(String sessionId) {
    LOGGER.info("Close Session: " + sessionId + " for interpreter setting: " +
        interpreterSetting.getName());
    close(sessions.remove(sessionId));
    //TODO(zjffdu) whether close InterpreterGroup if there's no session left in Zeppelin Server
    if (sessions.isEmpty() && interpreterSetting != null) {
      LOGGER.info("Remove this InterpreterGroup: {} as all the sessions are closed", id);
      interpreterSetting.removeInterpreterGroup(id);
      if (remoteInterpreterProcess != null) {
        LOGGER.info("Kill RemoteInterpreterProcess");
        remoteInterpreterProcess.stop();
        remoteInterpreterProcess = null;
      }
    }
  }

  private void close(Collection<Interpreter> interpreters) {
    if (interpreters == null) {
      return;
    }

    for (Interpreter interpreter : interpreters) {
      Scheduler scheduler = interpreter.getScheduler();
      for (Job job : scheduler.getJobsRunning()) {
        job.abort();
        job.setStatus(Job.Status.ABORT);
        LOGGER.info("Job " + job.getJobName() + " aborted ");
      }
      for (Job job : scheduler.getJobsWaiting()) {
        job.abort();
        job.setStatus(Job.Status.ABORT);
        LOGGER.info("Job " + job.getJobName() + " aborted ");
      }

      try {
        interpreter.close();
      } catch (InterpreterException e) {
        LOGGER.warn("Fail to close interpreter " + interpreter.getClassName(), e);
      }
      //TODO(zjffdu) move the close of schedule to Interpreter
      if (null != scheduler) {
        SchedulerFactory.singleton().removeScheduler(scheduler.getName());
      }
    }
  }

  public synchronized List<Interpreter> getOrCreateSession(String user, String sessionId) {
    if (sessions.containsKey(sessionId)) {
      return sessions.get(sessionId);
    } else {
      List<Interpreter> interpreters = interpreterSetting.createInterpreters(user, sessionId);
      for (Interpreter interpreter : interpreters) {
        interpreter.setInterpreterGroup(this);
      }
      LOGGER.info("Create Session: {} in InterpreterGroup: {} for user: {}", sessionId, id, user);
      interpreterSetting.getLifecycleManager().onInterpreterSessionCreated(this, sessionId);
      sessions.put(sessionId, interpreters);
      return interpreters;
    }
  }

}
