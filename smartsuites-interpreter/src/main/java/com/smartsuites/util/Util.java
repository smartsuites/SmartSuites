/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.util;

import org.apache.commons.lang.StringUtils;

import java.io.IOException;
import java.util.Properties;

public class Util {
    private static final String PROJECT_PROPERTIES_VERSION_KEY = "version";
    private static final String GIT_PROPERTIES_COMMIT_ID_KEY = "git.commit.id.abbrev";
    private static final String GIT_PROPERTIES_COMMIT_TS_KEY = "git.commit.time";

    private static Properties projectProperties;
    private static Properties gitProperties;

    static {
        projectProperties = new Properties();
        gitProperties = new Properties();
        try {
            projectProperties.load(Util.class.getResourceAsStream("/project.properties"));
            //gitProperties.load(Util.class.getResourceAsStream("/git.properties"));
        } catch (IOException e) {
            //Fail to read project.properties
        }
    }

    /**
     * Get Zeppelin version
     *
     * @return Current Zeppelin version
     */
    public static String getVersion() {
        return StringUtils.defaultIfEmpty(projectProperties.getProperty(PROJECT_PROPERTIES_VERSION_KEY),
                StringUtils.EMPTY);
    }

    /**
     * Get Zeppelin Git latest commit id
     *
     * @return Latest Zeppelin commit id
     */
    public static String getGitCommitId() {
        return StringUtils.defaultIfEmpty(gitProperties.getProperty(GIT_PROPERTIES_COMMIT_ID_KEY),
                StringUtils.EMPTY);
    }

    /**
     * Get Zeppelin Git latest commit timestamp
     *
     * @return Latest Zeppelin commit timestamp
     */
    public static String getGitTimestamp() {
        return StringUtils.defaultIfEmpty(gitProperties.getProperty(GIT_PROPERTIES_COMMIT_TS_KEY),
                StringUtils.EMPTY);
    }
}
