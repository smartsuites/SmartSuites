/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import java.io.IOException;
import java.net.URI;
import java.util.List;

/**
 * Helium package registry
 * 包的仓库
 */
public abstract class HeliumRegistry {
  private final String name;
  private final String uri;

  public HeliumRegistry(String name, String uri) {
    this.name = name;
    this.uri = uri;
  }
  public String name() {
    return name;
  }
  public String uri() {
    return uri;
  }
  public abstract List<HeliumPackage> getAll() throws IOException;
}
