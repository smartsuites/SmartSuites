/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.display.angular.paragraphscope

import com.smartsuites.display.angular.{AbstractAngularModel, AbstractAngularModelTest}

/**
  * Test for AngularModel
  */
class AngularModelTest extends AbstractAngularModelTest {
  override def angularModel(name: String): AbstractAngularModel = {
    AngularModel(name)
  }

  override def angularModel(name: String, value: Any): AbstractAngularModel = {
    AngularModel(name, value)
  }
}
