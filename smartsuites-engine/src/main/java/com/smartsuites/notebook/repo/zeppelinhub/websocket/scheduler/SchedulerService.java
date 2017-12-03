/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo.zeppelinhub.websocket.scheduler;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Creates a thread pool that can schedule zeppelinhub commands.
 *
 */
public class SchedulerService {

  private final ScheduledExecutorService pool;
  private static SchedulerService instance = null;

  private SchedulerService(int numberOfThread) {
    pool = Executors.newScheduledThreadPool(numberOfThread);
  }

  public static SchedulerService create(int numberOfThread) {
    if (instance == null) {
      instance = new SchedulerService(numberOfThread);
    }
    return instance;
  }

  public static SchedulerService getInstance() {
    if (instance == null) {
      instance = new SchedulerService(2);
    }
    return instance;
  }

  public void add(Runnable service, int firstExecution, int period) {
    pool.scheduleAtFixedRate(service, firstExecution, period, TimeUnit.SECONDS);
  }

  public void addOnce(Runnable service, int firstExecution) {
    pool.schedule(service, firstExecution, TimeUnit.SECONDS);
  }

  public void close() {
    pool.shutdown();
  }

}
