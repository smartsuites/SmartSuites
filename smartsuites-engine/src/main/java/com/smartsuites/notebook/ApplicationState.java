/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook;

import com.smartsuites.helium.HeliumPackage;

/**
 * Current state of application
 */
public class ApplicationState {

  /**
   * Status of Application
   */
  public static enum Status {
    LOADING,
    LOADED,
    UNLOADING,
    UNLOADED,
    ERROR
  };

  Status status = Status.UNLOADED;

  String id;   // unique id for this instance. Similar to note id or paragraph id
  HeliumPackage pkg;
  String output;

  public ApplicationState(String id, HeliumPackage pkg) {
    this.id = id;
    this.pkg = pkg;
  }

  /**
   * After ApplicationState is restored from NotebookRepo,
   * such as after Zeppelin daemon starts or Notebook import,
   * Application status need to be reset.
   */
  public void resetStatus() {
    if (status != Status.ERROR) {
      status = Status.UNLOADED;
    }
  }


  @Override
  public boolean equals(Object o) {
    String compareName;
    if (o instanceof ApplicationState) {
      return pkg.equals(((ApplicationState) o).getHeliumPackage());
    } else if (o instanceof HeliumPackage) {
      return pkg.equals((HeliumPackage) o);
    } else {
      return false;
    }
  }

  @Override
  public int hashCode() {
    return pkg.hashCode();
  }

  public String getId() {
    return id;
  }

  public void setStatus(Status status) {
    this.status = status;
  }

  public Status getStatus() {
    return status;
  }

  public String getOutput() {
    return output;
  }

  public void setOutput(String output) {
    this.output = output;
  }

  public synchronized void appendOutput(String output) {
    if (this.output == null) {
      this.output = output;
    } else {
      this.output += output;
    }
  }

  public HeliumPackage getHeliumPackage() {
    return pkg;
  }
}
