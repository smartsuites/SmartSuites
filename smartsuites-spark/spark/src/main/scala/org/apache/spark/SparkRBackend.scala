/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */
package org.apache.spark

import org.apache.spark.api.r.RBackend

object SparkRBackend {
  val backend : RBackend = new RBackend()
  private var started = false;
  private var portNumber = 0;

  val backendThread : Thread = new Thread("SparkRBackend") {
    override def run() {
      backend.run()
    }
  }

  def init() : Int = {
    portNumber = backend.init()
    portNumber
  }

  def start() : Unit = {
    backendThread.start()
    started = true
  }

  def close() : Unit = {
    backend.close()
    backendThread.join()
  }

  def isStarted() : Boolean = {
    started
  }

  def port(): Int = {
    return portNumber
  }
}
