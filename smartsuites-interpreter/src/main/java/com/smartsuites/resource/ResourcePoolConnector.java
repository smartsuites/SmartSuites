/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.resource;

/**
 * Connect resource pools running in remote process
 */
public interface ResourcePoolConnector {
  /**
   * Get list of resources from all other resource pools in remote processes
   * @return
   */
  public ResourceSet getAllResources();

  /**
   * Read remote object
   * @return
   */
  public Object readResource(ResourceId id);

  /**
   * Invoke method of Resource and get return
   * @return
   */
  public Object invokeMethod(
      ResourceId id,
      String methodName,
      Class[] paramTypes,
      Object[] params);

  /**
   * Invoke method, put result into resource pool and return
   */
  public Resource invokeMethod(
      ResourceId id,
      String methodName,
      Class[] paramTypes,
      Object[] params,
      String returnResourceName);
}
