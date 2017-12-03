/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.util;

import org.junit.Test;
import static org.junit.Assert.assertNotNull;

public class UtilTest {

    @Test
    public void getVersionTest() {
        assertNotNull(Util.getVersion());
    }

    @Test
    public void getGitInfoTest() {
        assertNotNull(Util.getGitCommitId());
        assertNotNull(Util.getGitTimestamp());
    }
}
