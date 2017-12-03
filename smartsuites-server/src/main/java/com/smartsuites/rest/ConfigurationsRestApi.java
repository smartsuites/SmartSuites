/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest;

import com.smartsuites.annotation.ZeppelinApi;
import com.smartsuites.conf.ZeppelinConfiguration;
import com.smartsuites.notebook.Notebook;
import com.smartsuites.server.JsonResponse;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.util.Map;

/**
 * Configurations Rest API Endpoint
 */
@Path("/configurations")
@Produces("application/json")
public class ConfigurationsRestApi {

  private Notebook notebook;

  public ConfigurationsRestApi() {}

  public ConfigurationsRestApi(Notebook notebook) {
    this.notebook = notebook;
  }

  @GET
  @Path("all")
  @ZeppelinApi
  public Response getAll() {
    ZeppelinConfiguration conf = notebook.getConf();

    Map<String, String> configurations = conf.dumpConfigurations(conf,
        new ZeppelinConfiguration.ConfigurationKeyPredicate() {
        @Override
        public boolean apply(String key) {
          return !key.contains("password") &&
              !key.equals(ZeppelinConfiguration
                  .ConfVars
                  .ZEPPELIN_NOTEBOOK_AZURE_CONNECTION_STRING
                  .getVarName());
        }
      }
    );

    return new JsonResponse(Status.OK, "", configurations).build();
  }

  @GET
  @Path("prefix/{prefix}")
  @ZeppelinApi
  public Response getByPrefix(@PathParam("prefix") final String prefix) {
    ZeppelinConfiguration conf = notebook.getConf();

    Map<String, String> configurations = conf.dumpConfigurations(conf,
        new ZeppelinConfiguration.ConfigurationKeyPredicate() {
        @Override
        public boolean apply(String key) {
          return !key.contains("password") &&
              !key.equals(ZeppelinConfiguration
                  .ConfVars
                  .ZEPPELIN_NOTEBOOK_AZURE_CONNECTION_STRING
                  .getVarName()) &&
              key.startsWith(prefix);
        }
      }
    );

    return new JsonResponse(Status.OK, "", configurations).build();
  }

}
