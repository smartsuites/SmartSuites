/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.scheduler;

import java.util.Collection;

/**
 * Interface for scheduler
 */
public interface Scheduler extends Runnable {
  public String getName();

  public Collection<Job> getJobsWaiting();

  public Collection<Job> getJobsRunning();

  public void submit(Job job);

  public Job removeFromWaitingQueue(String jobId);

  public void stop();
}
