/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.scheduler;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Factory class for creating schedulers
 * 调度器工厂
 */
public class SchedulerFactory implements SchedulerListener {
  private static final Logger logger = LoggerFactory.getLogger(SchedulerFactory.class);
  protected ExecutorService executor;
  protected Map<String, Scheduler> schedulers = new LinkedHashMap<>();

  private static SchedulerFactory singleton;
  private static Long singletonLock = new Long(0);

  public static SchedulerFactory singleton() {
    if (singleton == null) {
      synchronized (singletonLock) {
        if (singleton == null) {
          try {
            singleton = new SchedulerFactory();
          } catch (Exception e) {
            logger.error(e.toString(), e);
          }
        }
      }
    }
    return singleton;
  }

  SchedulerFactory() throws Exception {
    executor = ExecutorFactory.singleton().createOrGet("SchedulerFactory", 100);
  }

  public void destroy() {
    ExecutorFactory.singleton().shutdown("SchedulerFactory");
  }

  public Scheduler createOrGetFIFOScheduler(String name) {
    synchronized (schedulers) {
      if (!schedulers.containsKey(name)) {
        Scheduler s = new FIFOScheduler(name, executor, this);
        schedulers.put(name, s);
        executor.execute(s);
      }
      return schedulers.get(name);
    }
  }

  public Scheduler createOrGetParallelScheduler(String name, int maxConcurrency) {
    synchronized (schedulers) {
      if (!schedulers.containsKey(name)) {
        Scheduler s = new ParallelScheduler(name, executor, this, maxConcurrency);
        schedulers.put(name, s);
        executor.execute(s);
      }
      return schedulers.get(name);
    }
  }

  public Scheduler createOrGetScheduler(Scheduler scheduler) {
    synchronized (schedulers) {
      if (!schedulers.containsKey(scheduler.getName())) {
        schedulers.put(scheduler.getName(), scheduler);
        executor.execute(scheduler);
      }
      return schedulers.get(scheduler.getName());
    }
  }

  public void removeScheduler(String name) {
    synchronized (schedulers) {
      Scheduler s = schedulers.remove(name);
      if (s != null) {
        s.stop();
      }
    }
  }

  public ExecutorService getExecutor() {
    return executor;
  }

  @Override
  public void jobStarted(Scheduler scheduler, Job job) {
    logger.info("Job " + job.getId() + " started by scheduler " + scheduler.getName());

  }

  @Override
  public void jobFinished(Scheduler scheduler, Job job) {
    logger.info("Job " + job.getId() + " finished by scheduler " + scheduler.getName());

  }
}
