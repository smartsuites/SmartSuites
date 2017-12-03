/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.utils;

import com.smartsuites.util.Util;

import java.util.Locale;

/**
 * CommandLine Support Class
 */
public class CommandLineUtils {
  public static void main(String[] args) {
    if (args.length == 0) {
      return;
    }

    String usage = args[0].toLowerCase(Locale.US);
    switch (usage) {
      case "--version":
      case "-v":
        System.out.println(Util.getVersion());
        break;
      default:
    }
  }
}
