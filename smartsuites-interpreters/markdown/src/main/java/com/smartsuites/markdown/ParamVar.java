/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.markdown;

import org.parboiled.support.Var;

import java.util.HashMap;
import java.util.Map;

/**
 * Implementation of Var to support parameter parsing.
 *
 * @param <K> Key
 * @param <V> Value
 */
public class ParamVar<K, V> extends Var<Map<K, V>> {

  public ParamVar() {
    super(new HashMap<K, V>());
  }

  public boolean put(K key, V value) {
    get().put(key, value);
    return true;
  }
}
