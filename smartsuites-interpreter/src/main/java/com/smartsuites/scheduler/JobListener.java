/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.scheduler;

/**
 * TODO(moon) : add description.
 */
public interface JobListener {
  public void onProgressUpdate(Job job, int progress);

  public void beforeStatusChange(Job job, Job.Status before, Job.Status after);

  public void afterStatusChange(Job job, Job.Status before, Job.Status after);
}
