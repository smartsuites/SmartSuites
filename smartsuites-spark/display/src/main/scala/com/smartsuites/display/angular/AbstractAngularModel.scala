/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.display.angular

import com.smartsuites.annotation.ZeppelinApi
import com.smartsuites.display.AngularObject
import com.smartsuites.interpreter.InterpreterContext

/**
  * Represents ng-model with angular object
  */
abstract class AbstractAngularModel(name: String) {
  val context = InterpreterContext.get
  val registry = context.getAngularObjectRegistry


  /**
    * Create AngularModel with initial Value
    *
    * @param name name of model
    * @param newValue value
    */
  @ZeppelinApi
  def this(name: String, newValue: Any) = {
    this(name)
    value(newValue)
  }

  protected def getAngularObject(): AngularObject[Any]
  protected def addAngularObject(value: Any): AngularObject[Any]

  /**
    * Get value of the model
    *
    * @return
    */
  @ZeppelinApi
  def apply(): Any = {
    value()
  }

  /**
    * Get value of the model
    *
    * @return
    */
  @ZeppelinApi
  def value(): Any = {
    val angularObject = getAngularObject()
    if (angularObject == null) {
      None
    } else {
      angularObject.get
    }
  }

  @ZeppelinApi
  def apply(newValue: Any): Unit = {
    value(newValue)
  }


  /**
    * Set value of the model
    *
    * @param newValue
    */
  @ZeppelinApi
  def value(newValue: Any): Unit = {
    var angularObject = getAngularObject()
    if (angularObject == null) {
      // create new object
      angularObject = addAngularObject(newValue)
    } else {
      angularObject.set(newValue)
    }
    angularObject.get()
  }

  @ZeppelinApi
  def remove(): Any = {
    val angularObject = getAngularObject()

    if (angularObject == null) {
      None
    } else {
      registry.remove(name, angularObject.getNoteId(), angularObject.getParagraphId())
      angularObject.get
    }
  }
}
