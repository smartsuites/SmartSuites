/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo.mock;

import java.io.IOException;

import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.conf.SmartsuitesConfiguration.ConfVars;
import com.smartsuites.notebook.repo.VFSNotebookRepo;

public class VFSNotebookRepoMock extends VFSNotebookRepo {

  private static SmartsuitesConfiguration modifyNotebookDir(SmartsuitesConfiguration conf) {
    String secNotebookDir = conf.getNotebookDir() + "_secondary";
    System.setProperty(ConfVars.SMARTSUITES_NOTEBOOK_DIR.getVarName(), secNotebookDir);
    SmartsuitesConfiguration secConf = SmartsuitesConfiguration.create();
    return secConf;
  }

  public VFSNotebookRepoMock(SmartsuitesConfiguration conf) throws IOException {
    super(modifyNotebookDir(conf));
  }

}
