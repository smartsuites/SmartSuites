/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.smartsuites.helium.HeliumRegistry;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

public class HeliumTestRegistry extends HeliumRegistry {
  private List<HeliumPackage> infos = new LinkedList<>();

  public HeliumTestRegistry(String name, String uri) {
    super(name, uri);
  }

  @Override
  public List<HeliumPackage> getAll() throws IOException {
    return infos;
  }

  public void add(HeliumPackage info) {
    infos.add(info);
  }
}
