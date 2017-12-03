/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.display.angular

import java.io.{ByteArrayOutputStream, PrintStream}
import java.util

import com.smartsuites.display.{AngularObject, AngularObjectRegistry, GUI}
import com.smartsuites.interpreter._
import com.smartsuites.user.AuthenticationInfo
import org.scalatest.concurrent.Eventually
import org.scalatest.time.{Seconds, Span}
import org.scalatest.{BeforeAndAfter, BeforeAndAfterEach, FlatSpec, Matchers}

/**
  * Test
  */
trait AbstractAngularElemTest
  extends FlatSpec with BeforeAndAfter with BeforeAndAfterEach with Eventually with Matchers {

  override def beforeEach() {
    val intpGroup = new InterpreterGroup()
    val context = new InterpreterContext("note", "paragraph", null, "title", "text",
      new AuthenticationInfo(), new util.HashMap[String, Object](), new GUI(),
      new AngularObjectRegistry(intpGroup.getId(), null),
      null,
      new util.LinkedList[InterpreterContextRunner](),
      new InterpreterOutput(null));

    InterpreterContext.set(context)
    super.beforeEach() // To be stackable, must call super.beforeEach
  }

  def angularElem(elem: scala.xml.Elem): AbstractAngularElem;
  def angularModel(name: String): AbstractAngularModel;


  "AngularElem" should "provide onclick method" in {
    registrySize should be(0)

    var a = 0
    val elem = angularElem(<div></div>).onClick(() => {
      a = a + 1
    })
    elem.angularObjects.get("ng-click") should not be(null)
    registrySize should be(1)

    // click create thread for callback function to run. So it'll may not immediately invoked
    // after click. therefore eventually should be
    click(elem)
    eventually (timeout(Span(5, Seconds))) {
      a should be(1)
    }

    click(elem)
    eventually (timeout(Span(5, Seconds))) {
      a should be(2)
    }

    // disassociate
    elem.disassociate()
    registrySize should be(0)
  }

  "AngularElem" should "print angular display directive only once in a paragraph" in {
    val out = new ByteArrayOutputStream()
    val printOut = new PrintStream(out)

    angularElem(<div></div>).display(printOut)
    out.toString should be("<div></div>")

    out.reset
    angularElem(<div></div>).display(printOut)
    out.toString should be("<div></div>")
  }

  "AngularElem" should "bind angularObject to ng-model directive " in {
    angularElem(<div></div>)
      .model("name", "value").toString should be("<div ng-model=\"name\"></div>")
    angularElem(<div></div>).model("name", "value").model() should be("value")
    angularElem(<div></div>).model() should be(None)
  }

  "AngularElem" should "able to disassociate AngularObjects" in {
    val elem1 = angularElem(<div></div>).model("name1", "value1")
    val elem2 = angularElem(<div></div>).model("name2", "value2")
    val elem3 = angularElem(<div></div>).model("name3", "value3")

    registrySize should be(3)

    elem1.disassociate()
    registrySize should be(2)

    elem2.disassociate()
    elem3.disassociate()
    registrySize should be(0)
  }

  "AngularElem" should "allow access to InterpreterContext inside of callback function" in {
    angularModel("name").value("value")

    var modelValue = ""

    val elem = angularElem(<div></div>).onClick(() =>
      modelValue = angularModel("name")().toString
    )

    click(elem)

    eventually (timeout(Span(5, Seconds))) { modelValue should be("value")}
  }


  def registry = {
    InterpreterContext.get().getAngularObjectRegistry
  }

  def registrySize = {
    registry.getAllWithGlobal("note").size()
  }

  def noteId = {
    InterpreterContext.get().getNoteId
  }

  def click(elem: AbstractAngularElem) = {
    fireEvent("ng-click", elem)
  }

  // simulate click
  def fireEvent(eventName: String, elem: AbstractAngularElem) = {
    val angularObject: AngularObject[Any] = elem.angularObjects(eventName);
    angularObject.set("event");
  }
}
