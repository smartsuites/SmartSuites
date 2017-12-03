/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote;

import java.util.Map;

/**
 * 
 * Wrapper interface for RemoterInterpreterEventClient
 * to expose only required methods from EventClient
 *
 */
public interface RemoteEventClientWrapper {

  public void onMetaInfosReceived(Map<String, String> infos);

  public void onParaInfosReceived(String noteId, String paragraphId,
                                            Map<String, String> infos);

}
