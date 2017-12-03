/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.resource;

import java.util.*;

/**
 * ResourcePool
 */
public class LocalResourcePool implements ResourcePool {
  private final String resourcePoolId;
  private final Map<ResourceId, Resource> resources = Collections.synchronizedMap(
      new HashMap<ResourceId, Resource>());

  /**
   * @param id unique id
   */
  public LocalResourcePool(String id) {
    resourcePoolId = id;
  }

  /**
   * Get unique id of this resource pool
   * @return
   */
  @Override
  public String id() {
    return resourcePoolId;
  }

  /**
   * Get resource
   * @return null if resource not found
   */
  @Override
  public Resource get(String name) {
    ResourceId resourceId = new ResourceId(resourcePoolId, name);
    return resources.get(resourceId);
  }

  @Override
  public Resource get(String noteId, String paragraphId, String name) {
    ResourceId resourceId = new ResourceId(resourcePoolId, noteId, paragraphId, name);
    return resources.get(resourceId);
  }

  @Override
  public ResourceSet getAll() {
    return new ResourceSet(resources.values());
  }

  /**
   * Put resource into the pull
   * @param
   * @param object object to put into the resource
   */
  @Override
  public void put(String name, Object object) {
    ResourceId resourceId = new ResourceId(resourcePoolId, name);

    Resource resource = new Resource(this, resourceId, object);
    resources.put(resourceId, resource);
  }

  @Override
  public void put(String noteId, String paragraphId, String name, Object object) {
    ResourceId resourceId = new ResourceId(resourcePoolId, noteId, paragraphId, name);

    Resource resource = new Resource(this, resourceId, object);
    resources.put(resourceId, resource);
  }

  @Override
  public Resource remove(String name) {
    return resources.remove(new ResourceId(resourcePoolId, name));
  }

  @Override
  public Resource remove(String noteId, String paragraphId, String name) {
    return resources.remove(new ResourceId(resourcePoolId, noteId, paragraphId, name));
  }
}
