/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.scheduler;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 *
 */
public class ExecutorFactory {
  private static ExecutorFactory _executor;
  private static Long _executorLock = new Long(0);

  Map<String, ExecutorService> executor = new HashMap<>();

  public ExecutorFactory() {

  }

  public static ExecutorFactory singleton() {
    if (_executor == null) {
      synchronized (_executorLock) {
        if (_executor == null) {
          _executor = new ExecutorFactory();
        }
      }
    }
    return _executor;
  }

  public ExecutorService getDefaultExecutor() {
    return createOrGet("default");
  }

  public ExecutorService createOrGet(String name) {
    return createOrGet(name, 100);
  }

  public ExecutorService createOrGet(String name, int numThread) {
    synchronized (executor) {
      if (!executor.containsKey(name)) {
        executor.put(name, Executors.newScheduledThreadPool(numThread));
      }
      return executor.get(name);
    }
  }

  public void shutdown(String name) {
    synchronized (executor) {
      if (executor.containsKey(name)) {
        ExecutorService e = executor.get(name);
        e.shutdown();
        executor.remove(name);
      }
    }
  }


  public void shutdownAll() {
    synchronized (executor) {
      for (String name : executor.keySet()){
        shutdown(name);
      }
    }
  }
}
