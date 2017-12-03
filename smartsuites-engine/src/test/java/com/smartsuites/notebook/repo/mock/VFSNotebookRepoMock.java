/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook.repo.mock;

import java.io.IOException;

import com.smartsuites.conf.ZeppelinConfiguration;
import com.smartsuites.conf.ZeppelinConfiguration.ConfVars;
import com.smartsuites.notebook.repo.VFSNotebookRepo;

public class VFSNotebookRepoMock extends VFSNotebookRepo {

  private static ZeppelinConfiguration modifyNotebookDir(ZeppelinConfiguration conf) {
    String secNotebookDir = conf.getNotebookDir() + "_secondary";
    System.setProperty(ConfVars.ZEPPELIN_NOTEBOOK_DIR.getVarName(), secNotebookDir);
    ZeppelinConfiguration secConf = ZeppelinConfiguration.create();
    return secConf;
  }

  public VFSNotebookRepoMock(ZeppelinConfiguration conf) throws IOException {
    super(modifyNotebookDir(conf));
  }

}
