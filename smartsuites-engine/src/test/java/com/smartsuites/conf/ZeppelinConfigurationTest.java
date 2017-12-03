/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.conf;

import junit.framework.Assert;

import org.apache.commons.configuration.ConfigurationException;
import com.smartsuites.conf.ZeppelinConfiguration.ConfVars;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

import java.net.MalformedURLException;
import java.util.List;


/**
 * Created by joelz on 8/19/15.
 */
public class ZeppelinConfigurationTest {
    @Before
    public void clearSystemVariables() {
        System.clearProperty(ConfVars.ZEPPELIN_NOTEBOOK_DIR.getVarName());
    }

    @Test
    public void getAllowedOrigins2Test() throws MalformedURLException, ConfigurationException {

        ZeppelinConfiguration conf  = new ZeppelinConfiguration(this.getClass().getResource("/test-zeppelin-site2.xml"));
        List<String> origins = conf.getAllowedOrigins();
        Assert.assertEquals(2, origins.size());
        Assert.assertEquals("http://onehost:8080", origins.get(0));
        Assert.assertEquals("http://otherhost.com", origins.get(1));
    }

    @Test
    public void getAllowedOrigins1Test() throws MalformedURLException, ConfigurationException {

        ZeppelinConfiguration conf  = new ZeppelinConfiguration(this.getClass().getResource("/test-zeppelin-site1.xml"));
        List<String> origins = conf.getAllowedOrigins();
        Assert.assertEquals(1, origins.size());
        Assert.assertEquals("http://onehost:8080", origins.get(0));
    }

    @Test
    public void getAllowedOriginsNoneTest() throws MalformedURLException, ConfigurationException {

        ZeppelinConfiguration conf  = new ZeppelinConfiguration(this.getClass().getResource("/zeppelin-site.xml"));
        List<String> origins = conf.getAllowedOrigins();
        Assert.assertEquals(1, origins.size());
    }

    @Test
    public void isWindowsPathTestTrue() throws ConfigurationException {

        ZeppelinConfiguration conf  = new ZeppelinConfiguration(this.getClass().getResource("/zeppelin-site.xml"));
        Boolean isIt = conf.isWindowsPath("c:\\test\\file.txt");
        Assert.assertTrue(isIt);
    }

    @Test
    public void isWindowsPathTestFalse() throws ConfigurationException {

        ZeppelinConfiguration conf  = new ZeppelinConfiguration(this.getClass().getResource("/zeppelin-site.xml"));
        Boolean isIt = conf.isWindowsPath("~/test/file.xml");
        Assert.assertFalse(isIt);
    }

    @Test
    public void getNotebookDirTest() throws ConfigurationException {

        ZeppelinConfiguration conf  = new ZeppelinConfiguration(this.getClass().getResource("/zeppelin-site.xml"));
        String notebookLocation = conf.getNotebookDir();
        Assert.assertEquals("notebook", notebookLocation);
    }
    
    @Test
    public void isNotebookPublicTest() throws ConfigurationException {
      
      ZeppelinConfiguration conf  = new ZeppelinConfiguration(this.getClass().getResource("/zeppelin-site.xml"));
      boolean isIt = conf.isNotebokPublic();
      assertTrue(isIt);
    }
}
