/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.notebook;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;

import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Locale;

/**
 *  importNote date format deserializer
 */
public class NotebookImportDeserializer implements JsonDeserializer<Date> {
  private static final String[] DATE_FORMATS = new String[] {
    "yyyy-MM-dd'T'HH:mm:ssZ",
    "MMM d, yyyy h:mm:ss a",
    "MMM dd, yyyy HH:mm:ss",
    "yyyy-MM-dd HH:mm:ss.SSS"
  };

  @Override
  public Date deserialize(JsonElement jsonElement, Type typeOF,
    JsonDeserializationContext context) throws JsonParseException {
    for (String format : DATE_FORMATS) {
      try {
        return new SimpleDateFormat(format, Locale.US).parse(jsonElement.getAsString());
      } catch (ParseException e) {
      }
    }
    throw new JsonParseException("Unparsable date: \"" + jsonElement.getAsString()
      + "\". Supported formats: " + Arrays.toString(DATE_FORMATS));
  }
}
