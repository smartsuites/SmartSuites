/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.resource;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;

import java.util.Collection;
import java.util.LinkedList;
import java.util.regex.Pattern;

/**
 * List of resources
 */
public class ResourceSet extends LinkedList<Resource> implements JsonSerializable {

  private static final Gson gson = new Gson();

  public ResourceSet(Collection<Resource> resources) {
    super(resources);
  }

  public ResourceSet() {
    super();
  }

  public ResourceSet filterByNameRegex(String regex) {
    ResourceSet result = new ResourceSet();
    for (Resource r : this) {
      if (Pattern.matches(regex, r.getResourceId().getName())) {
        result.add(r);
      }
    }
    return result;
  }

  public ResourceSet filterByName(String name) {
    ResourceSet result = new ResourceSet();
    for (Resource r : this) {
      if (r.getResourceId().getName().equals(name)) {
        result.add(r);
      }
    }
    return result;
  }

  public ResourceSet filterByClassnameRegex(String regex) {
    ResourceSet result = new ResourceSet();
    for (Resource r : this) {
      if (Pattern.matches(regex, r.getClassName())) {
        result.add(r);
      }
    }
    return result;
  }

  public ResourceSet filterByClassname(String className) {
    ResourceSet result = new ResourceSet();
    for (Resource r : this) {
      if (r.getClassName().equals(className)) {
        result.add(r);
      }
    }
    return result;
  }

  public ResourceSet filterByNoteId(String noteId) {
    ResourceSet result = new ResourceSet();
    for (Resource r : this) {
      if (equals(r.getResourceId().getNoteId(), noteId)) {
        result.add(r);
      }
    }
    return result;
  }

  public ResourceSet filterByParagraphId(String paragraphId) {
    ResourceSet result = new ResourceSet();
    for (Resource r : this) {
      if (equals(r.getResourceId().getParagraphId(), paragraphId)) {
        result.add(r);
      }
    }
    return result;
  }

  private boolean equals(String a, String b) {
    if (a == null && b == null) {
      return true;
    } else if (a != null && b != null) {
      return a.equals(b);
    } else {
      return false;
    }
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public static ResourceSet fromJson(String json) {
    return gson.fromJson(json, ResourceSet.class);
  }
}
