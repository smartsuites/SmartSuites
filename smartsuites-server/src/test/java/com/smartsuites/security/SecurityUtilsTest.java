/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.security;

import static org.junit.Assert.*;
import static org.mockito.Mockito.when;

import com.smartsuites.utils.SecurityUtils;
import org.apache.commons.configuration.ConfigurationException;
import com.smartsuites.conf.SmartsuitesConfiguration;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import sun.security.acl.PrincipalImpl;

import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.net.InetAddress;

@RunWith(PowerMockRunner.class)
@PrepareForTest(org.apache.shiro.SecurityUtils.class)
public class SecurityUtilsTest {

  @Mock
  org.apache.shiro.subject.Subject subject;

  @Test
  public void isInvalid() throws URISyntaxException, UnknownHostException {
    assertFalse(SecurityUtils.isValidOrigin("http://127.0.1.1", SmartsuitesConfiguration.create()));
  }

  @Test
  public void isInvalidFromConfig() throws URISyntaxException, UnknownHostException, ConfigurationException {
    assertFalse(SecurityUtils.isValidOrigin("http://otherinvalidhost.com",
          new SmartsuitesConfiguration(this.getClass().getResource("/zeppelin-site.xml"))));
  }

  @Test
  public void isLocalhost() throws URISyntaxException, UnknownHostException {
    assertTrue(SecurityUtils.isValidOrigin("http://localhost", SmartsuitesConfiguration.create()));
  }

  @Test
  public void isLocalMachine() throws URISyntaxException, UnknownHostException {
    String origin = "http://" + InetAddress.getLocalHost().getHostName();
    assertTrue("Origin " + origin + " is not allowed. Please check your hostname.",
               SecurityUtils.isValidOrigin(origin, SmartsuitesConfiguration.create()));
  }

  @Test
  public void isValidFromConfig() throws URISyntaxException, UnknownHostException, ConfigurationException {
    assertTrue(SecurityUtils.isValidOrigin("http://otherhost.com",
           new SmartsuitesConfiguration(this.getClass().getResource("/zeppelin-site.xml"))));
  }

  @Test
  public void isValidFromStar() throws URISyntaxException, UnknownHostException, ConfigurationException {
    assertTrue(SecurityUtils.isValidOrigin("http://anyhost.com",
           new SmartsuitesConfiguration(this.getClass().getResource("/zeppelin-site-star.xml"))));
  }

  @Test
  public void nullOrigin() throws URISyntaxException, UnknownHostException, ConfigurationException {
    assertFalse(SecurityUtils.isValidOrigin(null,
          new SmartsuitesConfiguration(this.getClass().getResource("/zeppelin-site.xml"))));
  }

  @Test
  public void nullOriginWithStar() throws URISyntaxException, UnknownHostException, ConfigurationException {
    assertTrue(SecurityUtils.isValidOrigin(null,
        new SmartsuitesConfiguration(this.getClass().getResource("/zeppelin-site-star.xml"))));
  }

  @Test
  public void emptyOrigin() throws URISyntaxException, UnknownHostException, ConfigurationException {
    assertFalse(SecurityUtils.isValidOrigin("",
          new SmartsuitesConfiguration(this.getClass().getResource("/zeppelin-site.xml"))));
  }

  @Test
  public void notAURIOrigin() throws URISyntaxException, UnknownHostException, ConfigurationException {
    assertFalse(SecurityUtils.isValidOrigin("test123",
          new SmartsuitesConfiguration(this.getClass().getResource("/zeppelin-site.xml"))));
  }


  @Test
  public void canGetPrincipalName()  {
    String expectedName = "java.security.Principal.getName()";
    SecurityUtils.setIsEnabled(true);
    PowerMockito.mockStatic(org.apache.shiro.SecurityUtils.class);
    when(org.apache.shiro.SecurityUtils.getSubject()).thenReturn(subject);
    when(subject.isAuthenticated()).thenReturn(true);
    when(subject.getPrincipal()).thenReturn(new PrincipalImpl(expectedName));

    assertEquals(expectedName, SecurityUtils.getPrincipal());
  }
}
