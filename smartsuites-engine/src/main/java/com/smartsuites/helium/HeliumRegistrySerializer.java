/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.google.gson.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Type;

/**
 * HeliumRegistrySerializer (and deserializer) for gson
 * 注册表的解析
 */
public class HeliumRegistrySerializer
    implements JsonSerializer<HeliumRegistry>, JsonDeserializer<HeliumRegistry> {
  Logger logger = LoggerFactory.getLogger(HeliumRegistrySerializer.class);

  @Override
  public HeliumRegistry deserialize(JsonElement json,
                                Type type,
                                JsonDeserializationContext jsonDeserializationContext)
      throws JsonParseException {
    JsonObject jsonObject = json.getAsJsonObject();
    String className = jsonObject.get("class").getAsString();
    String uri = jsonObject.get("uri").getAsString();
    String name = jsonObject.get("name").getAsString();

    try {
      logger.info("Restore helium registry {} {} {}", name, className, uri);
      Class<HeliumRegistry> cls =
          (Class<HeliumRegistry>) getClass().getClassLoader().loadClass(className);
      Constructor<HeliumRegistry> constructor = cls.getConstructor(String.class, String.class);
      HeliumRegistry registry = constructor.newInstance(name, uri);
      return registry;
    } catch (ClassNotFoundException | NoSuchMethodException | IllegalAccessException |
        InstantiationException | InvocationTargetException e) {
      logger.error(e.getMessage(), e);
      return null;
    }
  }

  @Override
  public JsonElement serialize(HeliumRegistry heliumRegistry,
                               Type type,
                               JsonSerializationContext jsonSerializationContext) {
    JsonObject json = new JsonObject();
    json.addProperty("class", heliumRegistry.getClass().getName());
    json.addProperty("uri", heliumRegistry.uri());
    json.addProperty("name", heliumRegistry.name());
    return json;
  }
}
