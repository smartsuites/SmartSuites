/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Polls job progress with given interval
 *
 * @see Job#progress()
 * @see JobListener#onProgressUpdate(Job, int)
 *
 * TODO(moon) : add description.
 */
public class JobProgressPoller extends Thread {
  public static final long DEFAULT_INTERVAL_MSEC = 500;
  private static final Logger logger = LoggerFactory.getLogger(JobProgressPoller.class);

  private Job job;
  private long intervalMs;

  public JobProgressPoller(Job job, long intervalMs) {
    super("JobProgressPoller, jobId=" + job.getId());
    this.job = job;
    if (intervalMs < 0) {
      throw new IllegalArgumentException("polling interval can't be " + intervalMs);
    }
    this.intervalMs = intervalMs == 0 ? DEFAULT_INTERVAL_MSEC : intervalMs;
  }

  @Override
  public void run() {
    try {
      while (!Thread.interrupted()) {
        JobListener listener = job.getListener();
        if (listener != null) {
          try {
            if (job.isRunning()) {
              listener.onProgressUpdate(job, job.progress());
            }
          } catch (Exception e) {
            logger.error("Can not get or update progress", e);
          }
        }
        Thread.sleep(intervalMs);
      }
    } catch (InterruptedException ignored) {}
  }
}
