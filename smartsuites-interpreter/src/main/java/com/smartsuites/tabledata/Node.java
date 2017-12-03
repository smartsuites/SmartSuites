/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.tabledata;

import java.util.Map;
import java.util.Set;

/**
 * The Zeppelin Node Entity
 * 顶点数据
 */
public class Node extends GraphEntity {

  /**
   * The labels (types) attached to a node
   */
  private Set<String> labels;

  public Node() {}

  
  public Node(long id, Map<String, Object> data, Set<String> labels) {
    super(id, data, labels.iterator().next());
  }

  public Set<String> getLabels() {
    return labels;
  }

  public void setLabels(Set<String> labels) {
    this.labels = labels;
  }
 
}
