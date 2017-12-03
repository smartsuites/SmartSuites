/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.smartsuites.common.JsonSerializable;

import java.util.*;

/**
 * Helium config. This object will be persisted to conf/helium.conf
 */
public class HeliumConf implements JsonSerializable {
  private static final Gson gson =  new GsonBuilder()
    .setPrettyPrinting()
    .registerTypeAdapter(HeliumRegistry.class, new HeliumRegistrySerializer())
    .create();

  // enabled packages {name, version}
  private Map<String, String> enabled = Collections.synchronizedMap(new HashMap<String, String>());

  // {artifact, {configKey, configValue}}
  private Map<String, Map<String, Object>> packageConfig =
      Collections.synchronizedMap(
          new HashMap<String, Map<String, Object>>());

  // enabled visualization package display order
  private List<String> bundleDisplayOrder =
          Collections.synchronizedList(new LinkedList<String>());

  public Map<String, String> getEnabledPackages() {
    return new HashMap<>(enabled);
  }

  public void enablePackage(String name, String artifact) {
    enabled.put(name, artifact);
  }

  public void updatePackageConfig(String artifact,
                                  Map<String, Object> newConfig) {
    if (!packageConfig.containsKey(artifact)) {
      packageConfig.put(artifact,
          Collections.synchronizedMap(new HashMap<String, Object>()));
    }
    packageConfig.put(artifact, newConfig);
  }

  /**
   * @return versioned package config `{artifact, {configKey, configVal}}`
   */
  public Map<String, Map<String, Object>> getAllPackageConfigs () {
    return packageConfig;
  }

  public Map<String, Object> getPackagePersistedConfig(String artifact) {
    if (!packageConfig.containsKey(artifact)) {
      packageConfig.put(artifact,
          Collections.synchronizedMap(new HashMap<String, Object>()));
    }

    return packageConfig.get(artifact);
  }

  public void disablePackage(HeliumPackage pkg) {
    disablePackage(pkg.getName());
  }

  public void disablePackage(String name) {
    enabled.remove(name);
  }

  public List<String> getBundleDisplayOrder() {
    if (bundleDisplayOrder == null) {
      return new LinkedList<>();
    } else {
      return bundleDisplayOrder;
    }
  }

  public void setBundleDisplayOrder(List<String> orderedPackageList) {
    bundleDisplayOrder = Collections.synchronizedList(orderedPackageList);
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public static HeliumConf fromJson(String json) {
    return gson.fromJson(json, HeliumConf.class);
  }
}
