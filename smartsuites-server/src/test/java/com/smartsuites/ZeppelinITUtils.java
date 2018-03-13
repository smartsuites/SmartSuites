/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.openqa.selenium.WebDriver;
import java.util.concurrent.TimeUnit;

public class ZeppelinITUtils {

  public final static Logger LOG = LoggerFactory.getLogger(ZeppelinITUtils.class);

  public static void sleep(long millis, boolean logOutput) {
    if (logOutput) {
      LOG.info("Starting sleeping for " + (millis / 1000) + " seconds...");
      LOG.info("Caller: " + Thread.currentThread().getStackTrace()[2]);
    }
    try {
      Thread.sleep(millis);
    } catch (InterruptedException e) {
      LOG.error("Exception in WebDriverManager while getWebDriver ", e);
    }
    if (logOutput) {
      LOG.info("Finished.");
    }
  }

  public static void restartZeppelin() {
    CommandExecutor.executeCommandLocalHost("../bin/smartsuites-daemon.sh restart",
        false, ProcessData.Types_Of_Data.OUTPUT);
    //wait for server to start.
    sleep(5000, false);
  }

  public static void turnOffImplicitWaits(WebDriver driver) {
    driver.manage().timeouts().implicitlyWait(0, TimeUnit.SECONDS);
  }

  public static void turnOnImplicitWaits(WebDriver driver) {
    driver.manage().timeouts().implicitlyWait(AbstractZeppelinIT.MAX_IMPLICIT_WAIT,
        TimeUnit.SECONDS);
  }
}
