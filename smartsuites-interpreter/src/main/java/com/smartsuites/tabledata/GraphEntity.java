/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.tabledata;

import java.util.Map;

/**
 * The base network entity
 * 图结构数据
 */
public abstract class GraphEntity {

  private long id;

  /**
   * The data of the entity
   * 
   */
  private Map<String, Object> data;

  /**
   * The primary type of the entity
   */
  private String label;
  
  public GraphEntity() {}

  public GraphEntity(long id, Map<String, Object> data, String label) {
    super();
    this.setId(id);
    this.setData(data);
    this.setLabel(label);
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public Map<String, Object> getData() {
    return data;
  }

  public void setData(Map<String, Object> data) {
    this.data = data;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

}
