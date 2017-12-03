/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.notebook;

/**
 * Folder listener used by FolderView
 */
public interface FolderListener {
  void onFolderRenamed(Folder folder, String oldFolderId);
}
