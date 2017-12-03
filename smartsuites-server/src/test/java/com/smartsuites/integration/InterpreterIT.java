/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.integration;

import com.smartsuites.AbstractZeppelinIT;
import com.smartsuites.WebDriverManager;
import org.hamcrest.CoreMatchers;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ErrorCollector;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class InterpreterIT extends AbstractZeppelinIT {
  private static final Logger LOG = LoggerFactory.getLogger(InterpreterIT.class);

  @Rule
  public ErrorCollector collector = new ErrorCollector();

  @Before
  public void startUp() {
    if (!endToEndTestEnabled()) {
      return;
    }
    driver = WebDriverManager.getWebDriver();
  }

  @After
  public void tearDown() {
    if (!endToEndTestEnabled()) {
      return;
    }
    driver.quit();
  }

  @Test
  public void testShowDescriptionOnInterpreterCreate() throws Exception {
    if (!endToEndTestEnabled()) {
      return;
    }
    try {
      // navigate to interpreter page
      WebElement settingButton = driver.findElement(By.xpath("//button[@class='nav-btn dropdown-toggle ng-scope']"));
      settingButton.click();
      WebElement interpreterLink = driver.findElement(By.xpath("//a[@href='#/interpreter']"));
      interpreterLink.click();

      WebElement createButton = driver.findElement(By.xpath("//button[contains(., 'Create')]"));
      createButton.click();

      Select select = new Select(driver.findElement(By.xpath("//select[@ng-change='newInterpreterGroupChange()']")));
      select.selectByVisibleText("spark");

      collector.checkThat("description of interpreter property is displayed",
          driver.findElement(By.xpath("//tr/td[contains(text(), 'spark.app.name')]/following-sibling::td[3]")).getText(),
          CoreMatchers.equalTo("The name of spark application."));

    } catch (Exception e) {
      handleException("Exception in InterpreterIT while testShowDescriptionOnInterpreterCreate ", e);
    }
  }
}