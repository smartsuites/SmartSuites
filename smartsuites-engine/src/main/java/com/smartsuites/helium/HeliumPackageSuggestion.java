/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;

/**
 * Suggested apps
 */
public class HeliumPackageSuggestion {
  private final List<HeliumPackageSearchResult> available = new LinkedList<>();

  /*
   * possible future improvement
   * provides n - 'favorite' list, based on occurrence of apps in notebook
   */

  public HeliumPackageSuggestion() {

  }

  public void addAvailablePackage(HeliumPackageSearchResult r) {
    available.add(r);

  }

  public void sort() {
    Collections.sort(available, new Comparator<HeliumPackageSearchResult>() {
      @Override
      public int compare(HeliumPackageSearchResult o1, HeliumPackageSearchResult o2) {
        return o1.getPkg().getName().compareTo(o2.getPkg().getName());
      }
    });
  }
}
