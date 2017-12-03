/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import com.google.common.base.Preconditions;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * //TODO(zjffdu) considering to move to InterpreterSettingManager
 *
 * Manage interpreters.
 */
public class InterpreterFactory {
  private static final Logger LOGGER = LoggerFactory.getLogger(InterpreterFactory.class);

  private final InterpreterSettingManager interpreterSettingManager;

  public InterpreterFactory(InterpreterSettingManager interpreterSettingManager) {
    this.interpreterSettingManager = interpreterSettingManager;
  }

  private InterpreterSetting getInterpreterSettingByGroup(List<InterpreterSetting> settings,
      String group) {

    Preconditions.checkNotNull(group, "group should be not null");
    for (InterpreterSetting setting : settings) {
      if (group.equals(setting.getName())) {
        return setting;
      }
    }
    return null;
  }

  public Interpreter getInterpreter(String user, String noteId, String replName) {
    List<InterpreterSetting> settings = interpreterSettingManager.getInterpreterSettings(noteId);
    InterpreterSetting setting;
    Interpreter interpreter;

    if (settings == null || settings.size() == 0) {
      LOGGER.error("No interpreter is binded to this note: " + noteId);
      return null;
    }

    if (StringUtils.isBlank(replName)) {
      // Get the default interpreter of the first interpreter binding
      InterpreterSetting defaultSetting = settings.get(0);
      return defaultSetting.getDefaultInterpreter(user, noteId);
    }

    String[] replNameSplit = replName.split("\\.");
    if (replNameSplit.length == 2) {
      String group = replNameSplit[0];
      String name = replNameSplit[1];
      setting = getInterpreterSettingByGroup(settings, group);
      if (null != setting) {
        interpreter = setting.getInterpreter(user, noteId, name);
        if (null != interpreter) {
          return interpreter;
        }
        throw new RuntimeException("No such interpreter: " + replName);
      }
      throw new RuntimeException("Interpreter " + group + " is not binded to this note");
    } else if (replNameSplit.length == 1){
      // first assume replName is 'name' of interpreter. ('groupName' is ommitted)
      // search 'name' from first (default) interpreter group
      // TODO(jl): Handle with noteId to support defaultInterpreter per note.
      setting = settings.get(0);
      interpreter = setting.getInterpreter(user, noteId, replName);

      if (null != interpreter) {
        return interpreter;
      }

      // next, assume replName is 'group' of interpreter ('name' is omitted)
      // search interpreter group and return first interpreter.
      setting = getInterpreterSettingByGroup(settings, replName);

      if (null != setting) {
        return setting.getDefaultInterpreter(user, noteId);
      } else {
        throw new RuntimeException("Either no interpreter named " + replName + " or it is not " +
            "binded to this note");
      }
    }
    //TODO(zjffdu) throw InterpreterException instead of return null
    return null;
  }
}
