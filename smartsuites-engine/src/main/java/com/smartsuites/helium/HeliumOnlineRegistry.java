/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.smartsuites.conf.SmartsuitesConfiguration;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpHost;
import com.smartsuites.util.Util;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.URI;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * This registry reads helium package json data
 * from specified url.
 *
 * File should be look like
 * [
 *    "packageName": {
 *       "0.0.1": json serialized HeliumPackage class,
 *       "0.0.2": json serialized HeliumPackage class,
 *       ...
 *    },
 *    ...
 * ]
 */
public class HeliumOnlineRegistry extends HeliumRegistry {
  private Logger logger = LoggerFactory.getLogger(HeliumOnlineRegistry.class);
  private final Gson gson;
  private final File registryCacheFile;

  public HeliumOnlineRegistry(String name, String uri, File registryCacheDir) {
    super(name, uri);
    registryCacheDir.mkdirs();

    UUID registryCacheFileUuid = UUID.nameUUIDFromBytes(uri.getBytes());
    this.registryCacheFile = new File(registryCacheDir, registryCacheFileUuid.toString());

    gson = new Gson();
  }

  @Override
  public synchronized List<HeliumPackage> getAll() throws IOException {

    List<HeliumPackage> packageList = new LinkedList<>();

    BufferedReader reader;
    //reader = new BufferedReader(new FileReader("/Users/wuyufei/Downloads/helium.json"))
    reader = new BufferedReader(new FileReader(SmartsuitesConfiguration.create().getHeliumConfPath()));

    List<Map<String, Map<String, HeliumPackage>>> packages = gson.fromJson(
            reader,
            new TypeToken<List<Map<String, Map<String, HeliumPackage>>>>() {
            }.getType());
    reader.close();

    for (Map<String, Map<String, HeliumPackage>> pkg : packages) {
      for (Map<String, HeliumPackage> versions : pkg.values()) {
        packageList.addAll(versions.values());
      }
    }

    writeToCache(packageList);
    return packageList;

    /*HttpClient client = HttpClientBuilder.create()
        .setUserAgent("ApacheZeppelin/" + Util.getVersion())
        .setProxy(getProxy(uri()))
        .build();
    HttpGet get = new HttpGet(uri());
    HttpResponse response;

    try {
      response = client.execute(get);
    } catch (Exception e) {
      logger.error(e.getMessage());
      return readFromCache();
    }

    if (response.getStatusLine().getStatusCode() != 200) {
      // try read from cache
      logger.error(uri() + " returned " + response.getStatusLine().toString());
      return readFromCache();
    } else {
      List<HeliumPackage> packageList = new LinkedList<>();

      BufferedReader reader;
      reader = new BufferedReader(
          new InputStreamReader(response.getEntity().getContent()));

      List<Map<String, Map<String, HeliumPackage>>> packages = gson.fromJson(
          reader,
          new TypeToken<List<Map<String, Map<String, HeliumPackage>>>>() {
          }.getType());
      reader.close();

      for (Map<String, Map<String, HeliumPackage>> pkg : packages) {
        for (Map<String, HeliumPackage> versions : pkg.values()) {
          packageList.addAll(versions.values());
        }
      }

      writeToCache(packageList);
      return packageList;
    }*/
  }

  private HttpHost getProxy(String uri) {
    String httpProxy = StringUtils.isBlank(System.getenv("http_proxy")) ?
            System.getenv("HTTP_PROXY") : System.getenv("http_proxy");

    String httpsProxy = StringUtils.isBlank(System.getenv("https_proxy")) ?
            System.getenv("HTTPS_PROXY") : System.getenv("https_proxy");

    try {
      String scheme = new URI(uri).getScheme();
      if (scheme.toLowerCase().startsWith("https") && StringUtils.isNotBlank(httpsProxy)) {
        URI httpsProxyUri = new URI(httpsProxy);
        return new HttpHost(httpsProxyUri.getHost(),
                httpsProxyUri.getPort(), httpsProxyUri.getScheme());
      }
      else if (scheme.toLowerCase().startsWith("http") && StringUtils.isNotBlank(httpProxy)){
        URI httpProxyUri = new URI(httpProxy);
        return new HttpHost(httpProxyUri.getHost(),
                httpProxyUri.getPort(), httpProxyUri.getScheme());
      }
      else return null;
    } catch (Exception ex) {
      logger.error(ex.getMessage(), ex);
      return null;
    }
  }

  private List<HeliumPackage> readFromCache() {
    synchronized (registryCacheFile) {
      if (registryCacheFile.isFile()) {
        try {
          return gson.fromJson(
              new FileReader(registryCacheFile),
              new TypeToken<List<HeliumPackage>>() {
              }.getType());
        } catch (FileNotFoundException e) {
          logger.error(e.getMessage(), e);
          return new LinkedList<>();
        }
      } else {
        return new LinkedList<>();
      }
    }
  }

  private void writeToCache(List<HeliumPackage> pkg) throws IOException {
    synchronized (registryCacheFile) {
      if (registryCacheFile.exists()) {
        registryCacheFile.delete();
      }
      String jsonToCache = gson.toJson(pkg);
      FileUtils.writeStringToFile(registryCacheFile, jsonToCache);
    }
  }
}
