/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.server;

import com.smartsuites.utils.SecurityUtils;
import com.smartsuites.conf.SmartsuitesConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URISyntaxException;
import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Cors filter
 *
 */
public class CorsFilter implements Filter {

  private static final Logger LOGGER = LoggerFactory.getLogger(CorsFilter.class);

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
      throws IOException, ServletException {
    String sourceHost = ((HttpServletRequest) request).getHeader("Origin");
    String origin = "";

    try {
      if (SecurityUtils.isValidOrigin(sourceHost, SmartsuitesConfiguration.create())) {
        origin = sourceHost;
      }
    } catch (URISyntaxException e) {
      LOGGER.error("Exception in WebDriverManager while getWebDriver ", e);
    }

    if (((HttpServletRequest) request).getMethod().equals("OPTIONS")) {
      HttpServletResponse resp = ((HttpServletResponse) response);
      addCorsHeaders(resp, origin);
      return;
    }

    if (response instanceof HttpServletResponse) {
      HttpServletResponse alteredResponse = ((HttpServletResponse) response);
      addCorsHeaders(alteredResponse, origin);
    }
    filterChain.doFilter(request, response);
  }

  private void addCorsHeaders(HttpServletResponse response, String origin) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Headers", "authorization,Content-Type");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, HEAD, DELETE");
    DateFormat fullDateFormatEN =
        DateFormat.getDateTimeInstance(DateFormat.FULL, DateFormat.FULL, new Locale("EN", "en"));
    response.setHeader("Date", fullDateFormatEN.format(new Date()));
    SmartsuitesConfiguration smartsuitesConfiguration = SmartsuitesConfiguration.create();
    response.setHeader("X-FRAME-OPTIONS", smartsuitesConfiguration.getXFrameOptions());
    if (smartsuitesConfiguration.useSsl()) {
      response.setHeader("Strict-Transport-Security", smartsuitesConfiguration.getStrictTransport());
    }
    response.setHeader("X-XSS-Protection", smartsuitesConfiguration.getXxssProtection());
  }

  @Override
  public void destroy() {}

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {}
}
