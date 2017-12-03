/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.utils;

import com.smartsuites.interpreter.InterpreterSetting;
import com.smartsuites.notebook.Notebook;
import com.smartsuites.types.InterpreterSettingsList;

import java.util.LinkedList;
import java.util.List;

/**
 * Utils for interpreter bindings
 */
public class InterpreterBindingUtils {
  public static List<InterpreterSettingsList> getInterpreterBindings(Notebook notebook,
                                                                     String noteId) {
    List<InterpreterSettingsList> settingList = new LinkedList<>();
    List<InterpreterSetting> selectedSettings =
        notebook.getBindedInterpreterSettings(noteId);
    for (InterpreterSetting setting : selectedSettings) {
      settingList.add(new InterpreterSettingsList(setting.getId(), setting.getName(),
          setting.getInterpreterInfos(), true));
    }

    List<InterpreterSetting> availableSettings = notebook.getInterpreterSettingManager().get();
    for (InterpreterSetting setting : availableSettings) {
      boolean selected = false;
      for (InterpreterSetting selectedSetting : selectedSettings) {
        if (selectedSetting.getId().equals(setting.getId())) {
          selected = true;
          break;
        }
      }

      if (!selected) {
        settingList.add(new InterpreterSettingsList(setting.getId(), setting.getName(),
            setting.getInterpreterInfos(), false));
      }
    }

    return settingList;
  }
}
