/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.scheduler;

import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.ExecutorService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Parallel scheduler runs submitted job concurrently.
 */
public class ParallelScheduler implements Scheduler {
  List<Job> queue = new LinkedList<>();
  List<Job> running = new LinkedList<>();
  private ExecutorService executor;
  private SchedulerListener listener;
  boolean terminate = false;
  private String name;
  private int maxConcurrency;

  static Logger LOGGER = LoggerFactory.getLogger(ParallelScheduler.class);

  public ParallelScheduler(String name, ExecutorService executor, SchedulerListener listener,
      int maxConcurrency) {
    this.name = name;
    this.executor = executor;
    this.listener = listener;
    this.maxConcurrency = maxConcurrency;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public Collection<Job> getJobsWaiting() {
    List<Job> ret = new LinkedList<>();
    synchronized (queue) {
      for (Job job : queue) {
        ret.add(job);
      }
    }
    return ret;
  }

  @Override
  public Job removeFromWaitingQueue(String jobId) {
    synchronized (queue) {
      Iterator<Job> it = queue.iterator();
      while (it.hasNext()) {
        Job job = it.next();
        if (job.getId().equals(jobId)) {
          it.remove();
          return job;
        }
      }
    }
    return null;
  }

  @Override
  public Collection<Job> getJobsRunning() {
    List<Job> ret = new LinkedList<>();
    synchronized (queue) {
      for (Job job : running) {
        ret.add(job);
      }
    }
    return ret;
  }



  @Override
  public void submit(Job job) {
    job.setStatus(Job.Status.PENDING);
    synchronized (queue) {
      queue.add(job);
      queue.notify();
    }
  }

  @Override
  public void run() {
    while (terminate == false) {
      Job job = null;
      synchronized (queue) {
        if (running.size() >= maxConcurrency || queue.isEmpty() == true) {
          try {
            queue.wait(500);
          } catch (InterruptedException e) {
            LOGGER.error("Exception in MockInterpreterAngular while interpret queue.wait", e);
          }
          continue;
        }

        job = queue.remove(0);
        running.add(job);
      }
      Scheduler scheduler = this;

      executor.execute(new JobRunner(scheduler, job));
    }
  }

  public void setMaxConcurrency(int maxConcurrency) {
    this.maxConcurrency = maxConcurrency;
    synchronized (queue) {
      queue.notify();
    }
  }

  private class JobRunner implements Runnable {
    private Scheduler scheduler;
    private Job job;

    public JobRunner(Scheduler scheduler, Job job) {
      this.scheduler = scheduler;
      this.job = job;
    }

    @Override
    public void run() {
      if (job.isAborted()) {
        job.setStatus(Job.Status.ABORT);
        job.aborted = false;

        synchronized (queue) {
          running.remove(job);
          queue.notify();
        }

        return;
      }

      job.setStatus(Job.Status.RUNNING);
      if (listener != null) {
        listener.jobStarted(scheduler, job);
      }
      job.run();
      if (job.isAborted()) {
        job.setStatus(Job.Status.ABORT);
      } else {
        if (job.getException() != null) {
          job.setStatus(Job.Status.ERROR);
        } else {
          job.setStatus(Job.Status.FINISHED);
        }
      }

      if (listener != null) {
        listener.jobFinished(scheduler, job);
      }

      // reset aborted flag to allow retry
      job.aborted = false;
      synchronized (queue) {
        running.remove(job);
        queue.notify();
      }
    }
  }


  @Override
  public void stop() {
    terminate = true;
    synchronized (queue) {
      queue.notify();
    }
  }

}
