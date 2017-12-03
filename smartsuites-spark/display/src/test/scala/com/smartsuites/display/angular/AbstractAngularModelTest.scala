/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.display.angular

import com.smartsuites.display.{AngularObjectRegistry, GUI}
import com.smartsuites.interpreter._
import com.smartsuites.user.AuthenticationInfo
import org.scalatest.concurrent.Eventually
import org.scalatest.{BeforeAndAfter, BeforeAndAfterEach, FlatSpec, Matchers}

/**
  * Abstract Test for AngularModel
  */
trait AbstractAngularModelTest extends FlatSpec
with BeforeAndAfter with BeforeAndAfterEach with Eventually with Matchers {
  override def beforeEach() {
    val intpGroup = new InterpreterGroup()
    val context = new InterpreterContext("note", "id", null, "title", "text", new AuthenticationInfo(),
      new java.util.HashMap[String, Object](), new GUI(), new AngularObjectRegistry(
        intpGroup.getId(), null),
      null,
      new java.util.LinkedList[InterpreterContextRunner](),
      new InterpreterOutput(null));

    InterpreterContext.set(context)
    super.beforeEach() // To be stackable, must call super.beforeEach
  }

  def angularModel(name: String): AbstractAngularModel
  def angularModel(name: String, value: Any): AbstractAngularModel

  "AngularModel" should "able to create AngularObject" in {
    val registry = InterpreterContext.get().getAngularObjectRegistry
    registrySize should be(0)

    angularModel("model1")() should be(None)
    registrySize should be(0)

    angularModel("model1", "value1")() should be("value1")
    registrySize should be(1)

    angularModel("model1")() should be("value1")
    registrySize should be(1)
  }

  "AngularModel" should "able to update AngularObject" in {
    val registry = InterpreterContext.get().getAngularObjectRegistry

    val model1 = angularModel("model1", "value1")
    model1() should be("value1")
    registrySize should be(1)

    model1.value("newValue1")
    model1() should be("newValue1")
    registrySize should be(1)

    angularModel("model1", "value2")() should be("value2")
    registrySize should be(1)
  }

  "AngularModel" should "able to remove AngularObject" in {
    angularModel("model1", "value1")
    registrySize should be(1)

    angularModel("model1").remove()
    registrySize should be(0)
  }


  def registry() = {
    InterpreterContext.get().getAngularObjectRegistry
  }

  def registrySize() = {
    registry().getAllWithGlobal(InterpreterContext.get().getNoteId).size
  }
}
