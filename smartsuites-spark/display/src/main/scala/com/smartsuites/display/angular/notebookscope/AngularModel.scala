/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.display.angular.notebookscope

import com.smartsuites.display.angular.AbstractAngularModel
import com.smartsuites.display.AngularObject
import com.smartsuites.display.angular.AbstractAngularModel
import com.smartsuites.interpreter.InterpreterContext

/**
  * Represents ng-model in notebook scope
  */
class AngularModel(name: String)
  extends AbstractAngularModel(name) {

  def this(name: String, newValue: Any) = {
    this(name)
    value(newValue)
  }

  override protected def getAngularObject(): AngularObject[Any] = {
    registry.get(name, context.getNoteId, null).asInstanceOf[AngularObject[Any]]
  }

  override protected def addAngularObject(value: Any): AngularObject[Any] = {
    registry.add(name, value, context.getNoteId, null).asInstanceOf[AngularObject[Any]]
  }
}


object AngularModel {
  def apply(name: String): AbstractAngularModel = {
    new AngularModel(name)
  }

  def apply(name: String, newValue: Any): AbstractAngularModel = {
    new AngularModel(name, newValue)
  }
}