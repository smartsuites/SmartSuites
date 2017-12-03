/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.display.angular.paragraphscope

import com.smartsuites.display.angular.AbstractAngularElem
import com.smartsuites.display.{AngularObject, angular}
import com.smartsuites.interpreter.InterpreterContext

import scala.collection.JavaConversions
import scala.xml._

/**
  * AngularElement in paragraph scope
  */
class AngularElem(override val interpreterContext: InterpreterContext,
                  override val modelName: String,
                  override val angularObjects: Map[String, AngularObject[Any]],
                  prefix: String,
                  label: String,
                  attributes1: MetaData,
                  scope: NamespaceBinding,
                  minimizeEmpty: Boolean,
                  child: Node*)
  extends AbstractAngularElem(
    interpreterContext, modelName, angularObjects, prefix, label, attributes1, scope,
    minimizeEmpty, child: _*) {

  override protected def addAngularObject(name: String, value: Any): AngularObject[Any] = {
    val registry = interpreterContext.getAngularObjectRegistry
    registry.add(name, value, interpreterContext.getNoteId, interpreterContext.getParagraphId)
      .asInstanceOf[AngularObject[Any]]

  }

  override protected def newElem(interpreterContext: InterpreterContext,
                                 name: String,
                                 angularObjects: Map[String, AngularObject[Any]],
                                 elem: scala.xml.Elem): AbstractAngularElem = {
    new AngularElem(
      interpreterContext,
      name,
      angularObjects,
      elem.prefix,
      elem.label,
      elem.attributes,
      elem.scope,
      elem.minimizeEmpty,
      elem.child:_*)
  }
}

object AngularElem {
  implicit def Elem2AngularDisplayElem(elem: Elem): AbstractAngularElem = {
    new AngularElem(InterpreterContext.get(), null,
      Map[String, AngularObject[Any]](),
      elem.prefix, elem.label, elem.attributes, elem.scope, elem.minimizeEmpty, elem.child:_*);
  }

  /**
    * Disassociate (remove) all angular object in this note
    */
  def disassociate() = {
    val ic = InterpreterContext.get
    val registry = ic.getAngularObjectRegistry

    JavaConversions.asScalaBuffer(registry.getAll(ic.getNoteId, ic.getParagraphId)).foreach(ao =>
      registry.remove(ao.getName, ao.getNoteId, ao.getParagraphId)
    )
  }
}