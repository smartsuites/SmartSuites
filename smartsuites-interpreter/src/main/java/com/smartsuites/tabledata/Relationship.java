/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.tabledata;

import java.util.Map;

/**
 * The Zeppelin Relationship entity
 * 图的边
 */
public class Relationship extends GraphEntity {

  /**
   * Source node ID
   */
  private long source;

  /**
   * End node ID
   */
  private long target;

  public Relationship() {}

  public Relationship(long id, Map<String, Object> data, long source,
      long target, String label) {
    super(id, data, label);
    this.setSource(source);
    this.setTarget(target);
  }

  public long getSource() {
    return source;
  }

  public void setSource(long startNodeId) {
    this.source = startNodeId;
  }

  public long getTarget() {
    return target;
  }

  public void setTarget(long endNodeId) {
    this.target = endNodeId;
  }

}
