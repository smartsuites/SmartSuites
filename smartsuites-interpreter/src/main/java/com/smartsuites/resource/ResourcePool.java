/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.resource;

/**
 * Interface for ResourcePool
 * 资源池
 */
public interface ResourcePool {
  /**
   * Get unique id of the resource pool
   * @return
   */
  public String id();

  /**
   * Get resource from name
   * @param name Resource name
   * @return null if resource not found
   */
  public Resource get(String name);

  /**
   * Get resource from name
   * @param noteId
   * @param paragraphId
   * @param name Resource name
   * @return null if resource not found
   */
  public Resource get(String noteId, String paragraphId, String name);

  /**
   * Get all resources
   * @return
   */
  public ResourceSet getAll();

  /**
   * Put an object into resource pool
   * @param name
   * @param object
   */
  public void put(String name, Object object);

  /**
   * Put an object into resource pool
   * Given noteId and paragraphId is identifying resource along with name.
   * Object will be automatically removed on related note or paragraph removal.
   *
   * @param noteId
   * @param paragraphId
   * @param name
   * @param object
   */
  public void put(String noteId, String paragraphId, String name, Object object);

  /**
   * Remove object
   * @param name Resource name to remove
   * @return removed Resource. null if resource not found
   */
  public Resource remove(String name);

  /**
   * Remove object
   * @param noteId
   * @param paragraphId
   * @param name Resource name to remove
   * @return removed Resource. null if resource not found
   */
  public Resource remove(String noteId, String paragraphId, String name);
}
