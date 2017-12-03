/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.display.angular.paragraphscope

import com.smartsuites.display.angular.{AbstractAngularElem, AbstractAngularElemTest, AbstractAngularModel}

import scala.xml.Elem

/**
  * Test
  */
class AngularElemTest extends AbstractAngularElemTest {

  override def angularElem(elem: Elem): AbstractAngularElem = {
    AngularElem.Elem2AngularDisplayElem(elem)
  }

  override def angularModel(name: String): AbstractAngularModel = {
    AngularModel(name)
  }

  "AngularElem" should "able to be created from implicit conversion" in {
    import AngularElem._
    <div></div>.model("modelname")
  }
}
