/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest.message;

import java.util.List;

import com.google.gson.Gson;
import com.smartsuites.common.JsonSerializable;
import com.smartsuites.interpreter.InterpreterOption;

/**
 *  NewNoteRequest rest api request message
 *
 */
public class NewNoteRequest implements JsonSerializable {
  private static final Gson gson = new Gson();

  String name;
  List<NewParagraphRequest> paragraphs;

  public NewNoteRequest (){

  }

  public String getName() {
    return name;
  }

  public List<NewParagraphRequest> getParagraphs() {
    return paragraphs;
  }

  public String toJson() {
    return gson.toJson(this);
  }

  public static NewNoteRequest fromJson(String json) {
    return gson.fromJson(json, NewNoteRequest.class);
  }
}
