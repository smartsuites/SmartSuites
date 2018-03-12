/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.google.gson.Gson;
import com.smartsuites.annotation.Experimental;
import com.smartsuites.common.JsonSerializable;

import java.util.Map;

/**
 * Helium package definition 可插拔的包的定义
 */

/*

{
  "type" : "SPELL",
  "name" : "echo-spell",
  "description" : "Return just what receive (example)",
  "artifact" : "./zeppelin-examples/zeppelin-example-spell-echo",
  "license" : "Apache-2.0",
  "icon" : "<i class='fa fa-repeat'></i>",
  "config": {
    "repeat": {
      "type": "number",
      "description": "How many times to repeat",
      "defaultValue": 1
    }
  },
  "spell": {
    "magic": "%echo",
    "usage": "%echo <TEXT>"
  }
}

{
  "type" : "VISUALIZATION",
  "name" : "zeppelin_horizontalbar",
  "description" : "Horizontal Bar chart (example)",
  "artifact" : "./zeppelin-examples/zeppelin-example-horizontalbar",
  "license" : "Apache-2.0",
  "icon" : "<i class='fa fa-bar-chart rotate90flipX'></i>"
}

{
  "type" : "APPLICATION",
  "name" : "zeppelin.clock",
  "description" : "Clock (example)",
  "artifact" : "zeppelin-examples/zeppelin-example-clock/target/zeppelin-example-clock-0.9.0-SNAPSHOT.jar",
  "className" : "org.apache.zeppelin.example.app.clock.Clock",
  "resources" : [[":java.util.Date"]],
  "license" : "Apache-2.0",
  "icon" : '<i class="fa fa-clock-o"></i>'
}
*/

@Experimental
public class HeliumPackage implements JsonSerializable {
  private static final Gson gson = new Gson();

  private HeliumType type;
  private String name;           // user friendly name of this application
  private String description;    // description
  private String artifact;       // artifact name e.g) groupId:artifactId:versionId
  private String className;      // entry point
  private String [][] resources; // resource classnames that requires
                                 // [[ .. and .. and .. ] or [ .. and .. and ..] ..]
  private String license;
  private String icon;
  private String published;

  private String groupId;        // get groupId of INTERPRETER type package
  private String artifactId;     // get artifactId of INTERPRETER type package

  private SpellPackageInfo spell;
  private Map<String, Object> config;

  public HeliumPackage(HeliumType type,
                       String name,
                       String description,
                       String artifact,
                       String className,
                       String[][] resources,
                       String license,
                       String icon) {
    this.type = type;
    this.name = name;
    this.description = description;
    this.artifact = artifact;
    this.className = className;
    this.resources = resources;
    this.license = license;
    this.icon = icon;
  }

  @Override
  public int hashCode() {
    return (type.toString() + artifact + className).hashCode();
  }

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof HeliumPackage)) {
      return false;
    }

    HeliumPackage info = (HeliumPackage) o;
    return type == info.type && artifact.equals(info.artifact) && className.equals(info.className);
  }

  public HeliumType getType() {
    return type;
  }

  // 只有前端服务才会打成 Bundle 包
  public static boolean isBundleType(HeliumType type) {
    return (type == HeliumType.VISUALIZATION ||
        type == HeliumType.SPELL);
  }

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }

  public String getArtifact() {
    return artifact;
  }

  public String getClassName() {
    return className;
  }

  public String[][] getResources() {
    return resources;
  }

  public String getLicense() {
    return license;
  }

  public String getIcon() {
    return icon;
  }

  public String getPublishedDate() {
    return published;
  }

  public String getGroupId() {
    return groupId;
  }

  public String getArtifactId() {
    return artifactId;
  }

  public SpellPackageInfo getSpellInfo() {
    return spell;
  }

  public Map<String, Object> getConfig() { return config; }

  public String toJson() {
    return gson.toJson(this);
  }

  public static HeliumPackage fromJson(String json) {
    return gson.fromJson(json, HeliumPackage.class);
  }
}
