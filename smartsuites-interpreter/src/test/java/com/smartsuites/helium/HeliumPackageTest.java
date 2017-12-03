/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.helium;

import org.junit.Test;

import java.util.Map;

import static org.junit.Assert.*;

public class HeliumPackageTest {

  @Test
  public void parseSpellPackageInfo() {
    String examplePackage = "{\n" +
        "  \"type\" : \"SPELL\",\n" +
        "  \"name\" : \"echo-spell\",\n" +
        "  \"description\" : \"'%echo' - return just what receive (example)\",\n" +
        "  \"artifact\" : \"./zeppelin-examples/zeppelin-example-spell-echo\",\n" +
        "  \"license\" : \"Apache-2.0\",\n" +
        "  \"icon\" : \"<i class='fa fa-repeat'></i>\",\n" +
        "  \"spell\": {\n" +
        "    \"magic\": \"%echo\",\n" +
        "    \"usage\": \"%echo <TEXT>\"\n" +
        "  }\n" +
        "}";

    HeliumPackage p = HeliumPackage.fromJson(examplePackage);
    assertEquals(p.getSpellInfo().getMagic(), "%echo");
    assertEquals(p.getSpellInfo().getUsage(), "%echo <TEXT>");
  }

  @Test
  public void parseConfig() {
    String examplePackage = "{\n" +
        "  \"type\" : \"SPELL\",\n" +
        "  \"name\" : \"translator-spell\",\n" +
        "  \"description\" : \"Translate langauges using Google API (examaple)\",\n" +
        "  \"artifact\" : \"./zeppelin-examples/zeppelin-example-spell-translator\",\n" +
        "  \"license\" : \"Apache-2.0\",\n" +
        "  \"icon\" : \"<i class='fa fa-globe '></i>\",\n" +
        "  \"config\": {\n" +
        "    \"access-token\": {\n" +
        "      \"type\": \"string\",\n" +
        "      \"description\": \"access token for Google Translation API\",\n" +
        "      \"defaultValue\": \"EXAMPLE-TOKEN\"\n" +
        "    }\n" +
        "  },\n" +
        "  \"spell\": {\n" +
        "    \"magic\": \"%translator\",\n" +
        "    \"usage\": \"%translator <source>-<target> <access-key> <TEXT>\"\n" +
        "  }\n" +
        "}";

    HeliumPackage p = HeliumPackage.fromJson(examplePackage);
    Map<String, Object> config = p.getConfig();
    Map<String, Object> accessToken = (Map<String, Object>) config.get("access-token");

    assertEquals((String) accessToken.get("type"),"string");
    assertEquals((String) accessToken.get("description"),
        "access token for Google Translation API");
    assertEquals((String) accessToken.get("defaultValue"),
        "EXAMPLE-TOKEN");
  }
}