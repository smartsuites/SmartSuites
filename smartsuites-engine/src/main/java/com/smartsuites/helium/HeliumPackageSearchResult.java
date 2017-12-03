/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

/**
 * search result
 */
public class HeliumPackageSearchResult {
  private final String registry;
  private final HeliumPackage pkg;
  private final boolean enabled;

  /**
   * Create search result item
   * @param registry registry name
   * @param pkg package information
   */
  public HeliumPackageSearchResult(String registry, HeliumPackage pkg, boolean enabled) {
    this.registry = registry;
    this.pkg = pkg;
    this.enabled = enabled;
  }

  public String getRegistry() {
    return registry;
  }

  public HeliumPackage getPkg() {
    return pkg;
  }

  public boolean isEnabled() {
    return enabled;
  }
}
