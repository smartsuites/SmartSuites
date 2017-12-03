/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.scheduler;

/**
 * TODO(moon) : add description.
 */
public interface SchedulerListener {
  public void jobStarted(Scheduler scheduler, Job job);

  public void jobFinished(Scheduler scheduler, Job job);
}
