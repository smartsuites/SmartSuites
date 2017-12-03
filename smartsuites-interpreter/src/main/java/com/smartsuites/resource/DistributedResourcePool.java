/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.resource;

/**
 * distributed resource pool
 */
public class DistributedResourcePool extends LocalResourcePool {

  private final ResourcePoolConnector connector;

  public DistributedResourcePool(String id, ResourcePoolConnector connector) {
    super(id);
    this.connector = connector;
  }

  @Override
  public Resource get(String name) {
    return get(name, true);
  }

  @Override
  public Resource get(String noteId, String paragraphId, String name) {
    return get(noteId, paragraphId, name, true);
  }

  /**
   * get resource by name.
   * @param name
   * @param remote false only return from local resource
   * @return null if resource not found.
   */
  public Resource get(String name, boolean remote) {
    // try local first
    Resource resource = super.get(name);
    if (resource != null) {
      return resource;
    }

    if (remote) {
      ResourceSet resources = connector.getAllResources().filterByName(name);
      if (resources.isEmpty()) {
        return null;
      } else {
        return resources.get(0);
      }
    } else {
      return null;
    }
  }

  /**
   * get resource by name.
   * @param name
   * @param remote false only return from local resource
   * @return null if resource not found.
   */
  public Resource get(String noteId, String paragraphId, String name, boolean remote) {
    // try local first
    Resource resource = super.get(noteId, paragraphId, name);
    if (resource != null) {
      return resource;
    }

    if (remote) {
      ResourceSet resources = connector.getAllResources()
          .filterByNoteId(noteId)
          .filterByParagraphId(paragraphId)
          .filterByName(name);

      if (resources.isEmpty()) {
        return null;
      } else {
        return resources.get(0);
      }
    } else {
      return null;
    }
  }

  @Override
  public ResourceSet getAll() {
    return getAll(true);
  }

  /**
   * Get all resource from the pool
   * @param remote false only return local resource
   * @return
   */
  public ResourceSet getAll(boolean remote) {
    ResourceSet all = super.getAll();
    if (remote) {
      all.addAll(connector.getAllResources());
    }
    return all;
  }
}
