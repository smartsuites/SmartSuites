/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.display;

/**
 *
 *
 */
public interface AngularObjectRegistryListener {
  public void onAdd(String interpreterGroupId, AngularObject object);
  public void onUpdate(String interpreterGroupId, AngularObject object);
  public void onRemove(String interpreterGroupId, String name, String noteId, String paragraphId);
}
