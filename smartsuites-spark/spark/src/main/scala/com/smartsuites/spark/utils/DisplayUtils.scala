/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.spark.utils

import java.lang.StringBuilder

import org.apache.spark.rdd.RDD

object DisplayUtils {

  implicit def toDisplayRDDFunctions[T <: Product](rdd: RDD[T]): DisplayRDDFunctions[T] = new DisplayRDDFunctions[T](rdd)

  implicit def toDisplayTraversableFunctions[T <: Product](traversable: Traversable[T]): DisplayTraversableFunctions[T] = new DisplayTraversableFunctions[T](traversable)

  def html(htmlContent: String = "") = s"%html $htmlContent"

  def img64(base64Content: String = "") = s"%img $base64Content"

  def img(url: String) = s"<img src='$url' />"
}

trait DisplayCollection[T <: Product] {

  def printFormattedData(traversable: Traversable[T], columnLabels: String*): Unit = {
    val providedLabelCount: Int = columnLabels.size
    var maxColumnCount:Int = 1
    val headers = new StringBuilder("%table ")

    val data = new StringBuilder("")

    traversable.foreach(tuple => {
      maxColumnCount = math.max(maxColumnCount,tuple.productArity)
      data.append(tuple.productIterator.mkString("\t")).append("\n")
    })

    if (providedLabelCount > maxColumnCount) {
      headers.append(columnLabels.take(maxColumnCount).mkString("\t")).append("\n")
    } else if (providedLabelCount < maxColumnCount) {
      val missingColumnHeaders = ((providedLabelCount+1) to maxColumnCount).foldLeft[String](""){
        (stringAccumulator,index) =>  if (index==1) s"Column$index" else s"$stringAccumulator\tColumn$index"
      }

      headers.append(columnLabels.mkString("\t")).append(missingColumnHeaders).append("\n")
    } else {
      headers.append(columnLabels.mkString("\t")).append("\n")
    }

    headers.append(data)

    print(headers.toString)
  }

}

class DisplayRDDFunctions[T <: Product] (val rdd: RDD[T]) extends DisplayCollection[T] {

  def display(columnLabels: String*)(implicit sparkMaxResult: SparkMaxResult): Unit = {
    printFormattedData(rdd.take(sparkMaxResult.maxResult), columnLabels: _*)
  }

  def display(sparkMaxResult:Int, columnLabels: String*): Unit = {
    printFormattedData(rdd.take(sparkMaxResult), columnLabels: _*)
  }
}

class DisplayTraversableFunctions[T <: Product] (val traversable: Traversable[T]) extends DisplayCollection[T] {

  def display(columnLabels: String*): Unit = {
    printFormattedData(traversable, columnLabels: _*)
  }
}

class SparkMaxResult(val maxResult: Int) extends Serializable
