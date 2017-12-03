/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.commons.io.IOUtils;
import com.smartsuites.common.JsonSerializable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonatype.aether.repository.RemoteRepository;

import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFilePermission;
import java.util.*;

import static java.nio.file.attribute.PosixFilePermission.OWNER_READ;
import static java.nio.file.attribute.PosixFilePermission.OWNER_WRITE;

/**
 * 主要负责解析器所有配置的保存和读取
 */
public class InterpreterInfoSaving implements JsonSerializable {

  private static final Logger LOGGER = LoggerFactory.getLogger(InterpreterInfoSaving.class);
  private static final Gson gson =  new GsonBuilder().setPrettyPrinting().create();

  // 解析器的配置
  public Map<String, InterpreterSetting> interpreterSettings = new HashMap<>();

  // Note的绑定
  public Map<String, List<String>> interpreterBindings = new HashMap<>();

  // Maven仓库
  public List<RemoteRepository> interpreterRepositories = new ArrayList<>();

  public static InterpreterInfoSaving loadFromFile(Path file) throws IOException {
    LOGGER.info("Load interpreter setting from file: " + file);
    InterpreterInfoSaving infoSaving = null;
    try (BufferedReader json = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {
      JsonParser jsonParser = new JsonParser();
      JsonObject jsonObject = jsonParser.parse(json).getAsJsonObject();
      infoSaving = InterpreterInfoSaving.fromJson(jsonObject.toString());

      if (infoSaving != null && infoSaving.interpreterSettings != null) {
        for (InterpreterSetting interpreterSetting : infoSaving.interpreterSettings.values()) {
          interpreterSetting.convertPermissionsFromUsersToOwners(
              jsonObject.getAsJsonObject("interpreterSettings")
                  .getAsJsonObject(interpreterSetting.getId()));
        }
      }
    }
    return infoSaving == null ? new InterpreterInfoSaving() : infoSaving;
  }

  public void saveToFile(Path file) throws IOException {
    if (!Files.exists(file)) {
      Files.createFile(file);
      try {
        Set<PosixFilePermission> permissions = EnumSet.of(OWNER_READ, OWNER_WRITE);
        Files.setPosixFilePermissions(file, permissions);
      } catch (UnsupportedOperationException e) {
        // File system does not support Posix file permissions (likely windows) - continue anyway.
        LOGGER.warn("unable to setPosixFilePermissions on '{}'.", file);
      };
    }
    LOGGER.info("Save Interpreter Settings to " + file);
    IOUtils.write(this.toJson(), new FileOutputStream(file.toFile()));
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public static InterpreterInfoSaving fromJson(String json) {
    return gson.fromJson(json, InterpreterInfoSaving.class);
  }
}
