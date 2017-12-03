/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.scheduler;

import java.util.HashMap;
import java.util.Map;

import com.smartsuites.scheduler.Job;
import com.smartsuites.scheduler.JobListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SleepingJob extends Job{

	private int time;
	boolean abort = false;
	private long start;
	private int count;

	static Logger LOGGER = LoggerFactory.getLogger(SleepingJob.class);
	private Object results;


	public SleepingJob(String jobName, JobListener listener, int time){
		super(jobName, listener);
		this.time = time;
		count = 0;
	}
	@Override
  public Object jobRun() {
		start = System.currentTimeMillis();
		while(abort==false){
			count++;
			try {
				Thread.sleep(10);
			} catch (InterruptedException e) {
				LOGGER.error("Exception in MockInterpreterAngular while interpret Thread.sleep", e);
			}
			if(System.currentTimeMillis() - start>time) break;
		}
		return System.currentTimeMillis()-start;
	}

	@Override
  public boolean jobAbort() {
		abort = true;
		return true;
	}

	@Override
	public void setResult(Object results) {
		this.results = results;
	}

	@Override
	public Object getReturn() {
		return results;
	}

	@Override
  public int progress() {
		long p = (System.currentTimeMillis() - start)*100 / time;
		if(p<0) p = 0;
		if(p>100) p = 100;
		return (int) p;
	}

	@Override
  public Map<String, Object> info() {
		Map<String, Object> i = new HashMap<>();
		i.put("LoopCount", Integer.toString(count));
		return i;
	}


}
