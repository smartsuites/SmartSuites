/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.display;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * AngularObjectRegistry keeps all the object that binded to Angular Display System.
 * AngularObjectRegistry is created per interpreter group. 每一个解析器组
 * It provides three different scope of AngularObjects :
 *  - Paragraphscope : AngularObject is valid in specific paragraph
 *  - Notebook scope: AngularObject is valid in a single notebook
 *  - Global scope : Shared to all notebook that uses the same interpreter group
 */
public class AngularObjectRegistry {
  Map<String, Map<String, AngularObject>> registry = new HashMap<>();
  private final String GLOBAL_KEY = "_GLOBAL_";
  private AngularObjectRegistryListener listener;
  private String interpreterId;
  

  AngularObjectListener angularObjectListener;

  public AngularObjectRegistry(final String interpreterId,
      final AngularObjectRegistryListener listener) {
    this.interpreterId = interpreterId;
    this.listener = listener;
    angularObjectListener = new AngularObjectListener() {
      @Override
      public void updated(AngularObject updatedObject) {
        if (listener != null) {
          listener.onUpdate(interpreterId, updatedObject);
        }
      }
    };
  }

  public AngularObjectRegistryListener getListener() {
    return listener;
  }

  /**
   * Add object into registry
   *
   * Paragraph scope when noteId and paragraphId both not null
   * Notebook scope when paragraphId is null
   * Global scope when noteId and paragraphId both null
   *
   * @param name Name of object
   * @param o Reference to the object
   * @param noteId noteId belonging to. null for global scope
   * @param paragraphId paragraphId belongs to. null for notebook scope
   * @return AngularObject that added
   */
  public AngularObject add(String name, Object o, String noteId, String paragraphId) {
    return add(name, o, noteId, paragraphId, true);
  }

  /**
   * 不同的Key就表示了不同的范围 Global、Note、Paragraph
   * @param noteId
   * @param paragraphId
   * @return
   */
  private String getRegistryKey(String noteId, String paragraphId) {
    if (noteId == null) {
      return GLOBAL_KEY;
    } else {
      if (paragraphId == null) {
        return noteId;
      } else {
        return noteId + "_" + paragraphId;
      }
    }
  }
  
  private Map<String, AngularObject> getRegistryForKey(String noteId, String paragraphId) {
    synchronized (registry) {
      String key = getRegistryKey(noteId, paragraphId);
      if (!registry.containsKey(key)) {
        registry.put(key, new HashMap<String, AngularObject>());
      }
      
      return registry.get(key);
    }
  }

  /**
   * Add object into registry
   *
   * Paragraph scope when noteId and paragraphId both not null
   * Notebook scope when paragraphId is null
   * Global scope when noteId and paragraphId both null
   *
   * @param name Name of object
   * @param o Reference to the object
   * @param noteId noteId belonging to. null for global scope
   * @param paragraphId paragraphId belongs to. null for notebook scope
   * @param emit skip firing onAdd event on false
   * @return AngularObject that added
   */
  public AngularObject add(String name, Object o, String noteId, String paragraphId,
                           boolean emit) {
    AngularObject ao = createNewAngularObject(name, o, noteId, paragraphId);

    synchronized (registry) {
      Map<String, AngularObject> noteLocalRegistry = getRegistryForKey(noteId, paragraphId);
      noteLocalRegistry.put(name, ao);
      if (listener != null && emit) {
        listener.onAdd(interpreterId, ao);
      }
    }

    return ao;
  }

  protected AngularObject createNewAngularObject(String name, Object o, String noteId,
                                                 String paragraphId) {
    return new AngularObject(name, o, noteId, paragraphId, angularObjectListener);
  }

  protected AngularObjectListener getAngularObjectListener() {
    return angularObjectListener;
  }

  /**
   * Remove a object from registry
   *
   * @param name Name of object to remove
   * @param noteId noteId belongs to. null for global scope
   * @param paragraphId paragraphId belongs to. null for notebook scope
   * @return removed object. null if object is not found in registry
   */
  public AngularObject remove(String name, String noteId, String paragraphId) {
    return remove(name, noteId, paragraphId, true);
  }

  /**
   * Remove a object from registry
   *
   * @param name Name of object to remove
   * @param noteId noteId belongs to. null for global scope
   * @param paragraphId paragraphId belongs to. null for notebook scope
   * @param emit skip fireing onRemove event on false
   * @return removed object. null if object is not found in registry
   */
  public AngularObject remove(String name, String noteId, String paragraphId, boolean emit) {
    synchronized (registry) {
      Map<String, AngularObject> r = getRegistryForKey(noteId, paragraphId);
      AngularObject o = r.remove(name);
      if (listener != null && emit) {
        listener.onRemove(interpreterId, name, noteId, paragraphId);
      }
      return o;
    }
  }

  /**
   * Remove all angular object in the scope.
   *
   * Remove all paragraph scope angular object when noteId and paragraphId both not null
   * Remove all notebook scope angular object when paragraphId is null
   * Remove all global scope angular objects when noteId and paragraphId both null
   *
   * @param noteId noteId
   * @param paragraphId paragraphId
   */
  public void removeAll(String noteId, String paragraphId) {
    synchronized (registry) {
      List<AngularObject> all = getAll(noteId, paragraphId);
      for (AngularObject ao : all) {
        remove(ao.getName(), noteId, paragraphId);
      }
    }
  }

  /**
   * Get a object from registry
   * @param name name of object
   * @param noteId noteId that belongs to
   * @param paragraphId paragraphId that belongs to
   * @return angularobject. null when not found
   */
  public AngularObject get(String name, String noteId, String paragraphId) {
    synchronized (registry) {
      Map<String, AngularObject> r = getRegistryForKey(noteId, paragraphId);
      return r.get(name);
    }
  }

  /**
   * Get all object in the scope
   * @param noteId noteId that belongs to
   * @param paragraphId paragraphId that belongs to
   * @return all angularobject in the scope
   */
  public List<AngularObject> getAll(String noteId, String paragraphId) {
    List<AngularObject> all = new LinkedList<>();
    synchronized (registry) {
      Map<String, AngularObject> r = getRegistryForKey(noteId, paragraphId);
      if (r != null) {
        all.addAll(r.values());
      }
    }
    return all;
  }
  
  /**
   * Get all angular object related to specific note.
   * That includes all global scope objects, notebook scope objects and paragraph scope objects
   * belongs to the noteId.
   *
   * @param noteId
   * @return
   */
  public List<AngularObject> getAllWithGlobal(String noteId) {
    List<AngularObject> all = new LinkedList<>();
    synchronized (registry) {
      Map<String, AngularObject> global = getRegistryForKey(null, null);
      if (global != null) {
        all.addAll(global.values());
      }
      for (String key : registry.keySet()) {
        if (key.startsWith(noteId)) {
          all.addAll(registry.get(key).values());
        }
      }
    }
    return all;
  }

  public String getInterpreterGroupId() {
    return interpreterId;
  }

  public Map<String, Map<String, AngularObject>> getRegistry() {
    return registry;
  }

  public void setRegistry(Map<String, Map<String, AngularObject>> registry) {
    this.registry = registry;
    for (Map<String, AngularObject> map : registry.values()) {
      for (AngularObject ao : map.values()) {
        ao.setListener(angularObjectListener);
      }
    }
  }
}
