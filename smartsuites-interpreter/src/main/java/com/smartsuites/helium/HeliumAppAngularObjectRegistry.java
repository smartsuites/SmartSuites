/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.smartsuites.display.AngularObject;
import com.smartsuites.display.AngularObjectRegistry;

import java.util.List;

/**
 * Angular Registry for helium app
 */
public class HeliumAppAngularObjectRegistry {
  private final String noteId;
  private final String appId;
  private final AngularObjectRegistry angularObjectRegistry;

  public HeliumAppAngularObjectRegistry(AngularObjectRegistry angularObjectRegistry,
                                        String noteId,
                                        String appId) {
    this.angularObjectRegistry = angularObjectRegistry;
    this.noteId = noteId;
    this.appId = appId;
  }

  public AngularObject add(String name, Object o) {
    return angularObjectRegistry.add(name, o, noteId, appId);
  }

  public AngularObject remove(String name) {
    return angularObjectRegistry.remove(name, noteId, appId);
  }

  public AngularObject get(String name) {
    return angularObjectRegistry.get(name, noteId, appId);
  }

  public List<AngularObject> getAll() {
    return angularObjectRegistry.getAll(noteId, appId);
  }
}
