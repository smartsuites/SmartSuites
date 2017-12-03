/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import java.util.Properties;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import com.smartsuites.annotation.ZeppelinApi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Interpreter wrapper for Kerberos initialization
 *
 * runKerberosLogin() method you need to implement that determine how should this interpeter do a
 * kinit for this interpreter.
 * isKerboseEnabled() method needs to implement which determines if the kerberos is enabled for that
 * interpreter.
 * startKerberosLoginThread() needs to be called inside the open() and
 * shutdownExecutorService() inside close().
 *
 * 
 * Environment variables defined in zeppelin-env.sh
 * KERBEROS_REFRESH_INTERVAL controls the refresh interval for Kerberos ticket. The default value
 * is 1d.
 * KINIT_FAIL_THRESHOLD controls how many times should kinit retry. The default value is 5.
 */
public abstract class KerberosInterpreter extends Interpreter {

  private Integer kinitFailCount = 0;
  private ScheduledExecutorService scheduledExecutorService;
  private static Logger logger = LoggerFactory.getLogger(KerberosInterpreter.class);

  public KerberosInterpreter(Properties property) {
    super(property);
  }

  @ZeppelinApi
  protected abstract boolean runKerberosLogin();

  @ZeppelinApi
  protected abstract boolean isKerboseEnabled();

  public void open() {
    if (isKerboseEnabled()) {
      startKerberosLoginThread();
    }
  }

  public void close() {
    if (isKerboseEnabled()) {
      shutdownExecutorService();
    }
  }

  private Long getKerberosRefreshInterval() {
    Long refreshInterval;
    String refreshIntervalString = "1d";
    //defined in zeppelin-env.sh, if not initialized then the default value is one day.
    if (System.getenv("KERBEROS_REFRESH_INTERVAL") != null) {
      refreshIntervalString = System.getenv("KERBEROS_REFRESH_INTERVAL");
    }
    try {
      refreshInterval = getTimeAsMs(refreshIntervalString);
    } catch (IllegalArgumentException e) {
      logger.error("Cannot get time in MS for the given string, " + refreshIntervalString
          + " defaulting to 1d ", e);
      refreshInterval = getTimeAsMs("1d");
    }

    return refreshInterval;
  }

  private Integer kinitFailThreshold() {
    Integer kinitFailThreshold = 5;
    //defined in zeppelin-env.sh, if not initialized then the default value is 5.
    if (System.getenv("KINIT_FAIL_THRESHOLD") != null) {
      try {
        kinitFailThreshold = new Integer(System.getenv("KINIT_FAIL_THRESHOLD"));
      } catch (Exception e) {
        logger.error("Cannot get integer value from the given string, " + System
            .getenv("KINIT_FAIL_THRESHOLD") + " defaulting to " + kinitFailThreshold, e);
      }
    }
    return kinitFailThreshold;
  }

  private Long getTimeAsMs(String time) {
    if (time == null) {
      logger.error("Cannot convert to time value.", time);
      time = "1d";
    }

    Matcher m = Pattern.compile("(-?[0-9]+)([a-z]+)?").matcher(time.toLowerCase());
    if (!m.matches()) {
      throw new IllegalArgumentException("Invalid time string: " + time);
    }

    long val = Long.parseLong(m.group(1));
    String suffix = m.group(2);

    if (suffix != null && !Constants.TIME_SUFFIXES.containsKey(suffix)) {
      throw new IllegalArgumentException("Invalid suffix: \"" + suffix + "\"");
    }

    return TimeUnit.MILLISECONDS.convert(val,
        suffix != null ? Constants.TIME_SUFFIXES.get(suffix) : TimeUnit.MILLISECONDS);
  }

  private ScheduledExecutorService startKerberosLoginThread() {
    scheduledExecutorService = Executors.newScheduledThreadPool(1);

    scheduledExecutorService.submit(new Callable() {
      public Object call() throws Exception {

        if (runKerberosLogin()) {
          logger.info("Ran runKerberosLogin command successfully.");
          kinitFailCount = 0;
          // schedule another kinit run with a fixed delay.
          scheduledExecutorService
              .schedule(this, getKerberosRefreshInterval(), TimeUnit.MILLISECONDS);
        } else {
          kinitFailCount++;
          logger.info("runKerberosLogin failed for " + kinitFailCount + " time(s).");
          // schedule another retry at once or close the interpreter if too many times kinit fails
          if (kinitFailCount >= kinitFailThreshold()) {
            logger.error("runKerberosLogin failed for  max attempts, calling close interpreter.");
            close();
          } else {
            scheduledExecutorService.submit(this);
          }
        }
        return null;
      }
    });

    return scheduledExecutorService;
  }

  private void shutdownExecutorService() {
    if (scheduledExecutorService != null) {
      scheduledExecutorService.shutdown();
    }
  }

}
