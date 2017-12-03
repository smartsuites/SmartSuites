/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.util.LinkedList;
import java.util.List;

/**
 * Simple Helium registry on local filesystem
 * 本地仓库
 */
public class HeliumLocalRegistry extends HeliumRegistry {
  private Logger logger = LoggerFactory.getLogger(HeliumLocalRegistry.class);

  private final Gson gson;

  public HeliumLocalRegistry(String name, String uri) {
    super(name, uri);
    gson = new Gson();

  }

  @Override
  public synchronized List<HeliumPackage> getAll() throws IOException {
    List<HeliumPackage> result = new LinkedList<>();

    File file = new File(uri());
    File [] files = file.listFiles();
    if (files == null) {
      return result;
    }

    for (File f : files) {
      if (f.getName().startsWith(".")) {
        continue;
      }

      HeliumPackage pkgInfo = readPackageInfo(f);
      if (pkgInfo != null) {
        result.add(pkgInfo);
      }
    }
    return result;
  }

  private HeliumPackage readPackageInfo(File f) {
    try {
      JsonReader reader = new JsonReader(new StringReader(FileUtils.readFileToString(f)));
      reader.setLenient(true);

      return gson.fromJson(reader, HeliumPackage.class);
    } catch (IOException e) {
      logger.error(e.getMessage(), e);
      return null;
    }
  }

}
