/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.smartsuites.jupyter;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Reader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import com.google.common.base.Joiner;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.typeadapters.RuntimeTypeAdapterFactory;
import com.smartsuites.jupyter.zformat.Note;
import com.smartsuites.jupyter.zformat.Paragraph;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;

import com.smartsuites.jupyter.nbformat.Cell;
import com.smartsuites.jupyter.nbformat.CodeCell;
import com.smartsuites.jupyter.nbformat.DisplayData;
import com.smartsuites.jupyter.nbformat.ExecuteResult;
import com.smartsuites.jupyter.nbformat.HeadingCell;
import com.smartsuites.jupyter.nbformat.MarkdownCell;
import com.smartsuites.jupyter.nbformat.Nbformat;
import com.smartsuites.jupyter.nbformat.Output;
import com.smartsuites.jupyter.nbformat.RawCell;
import com.smartsuites.jupyter.nbformat.Stream;
import com.smartsuites.jupyter.zformat.Result;
import com.smartsuites.jupyter.zformat.TypeData;
import com.smartsuites.markdown.MarkdownParser;
import com.smartsuites.markdown.PegdownParser;

/**
 *
 */
public class JupyterUtil {

  private final RuntimeTypeAdapterFactory<Cell> cellTypeFactory;
  private final RuntimeTypeAdapterFactory<Output> outputTypeFactory;

  private final MarkdownParser markdownProcessor;

  public JupyterUtil() {
    this.cellTypeFactory = RuntimeTypeAdapterFactory.of(Cell.class, "cell_type")
        .registerSubtype(MarkdownCell.class, "markdown").registerSubtype(CodeCell.class, "code")
        .registerSubtype(RawCell.class, "raw").registerSubtype(HeadingCell.class, "heading");
    this.outputTypeFactory = RuntimeTypeAdapterFactory.of(Output.class, "output_type")
        .registerSubtype(ExecuteResult.class, "execute_result")
        .registerSubtype(DisplayData.class, "display_data").registerSubtype(Stream.class, "stream")
        .registerSubtype(com.smartsuites.jupyter.nbformat.Error.class, "error");
    this.markdownProcessor = new PegdownParser();
  }

  public Nbformat getNbformat(Reader in) {
    return getNbformat(in, new GsonBuilder());
  }

  public Nbformat getNbformat(Reader in, GsonBuilder gsonBuilder) {
    return getGson(gsonBuilder).fromJson(in, Nbformat.class);
  }

  public Note getNote(Reader in, String codeReplaced, String markdownReplaced) {
    return getNote(in, new GsonBuilder(), codeReplaced, markdownReplaced);
  }

  public Note getNote(Reader in, GsonBuilder gsonBuilder, String codeReplaced,
      String markdownReplaced) {
    return getNote(getNbformat(in, gsonBuilder), codeReplaced, markdownReplaced);
  }

  public Note getNote(Nbformat nbformat, String codeReplaced, String markdownReplaced) {
    Note note = new Note();

    String name = nbformat.getMetadata().getTitle();
    if (null == name) {
      name = "Note converted from Jupyter";
    }
    note.setName(name);
    
    String lineSeparator = System.lineSeparator();
    Paragraph paragraph;
    List<Paragraph> paragraphs = new ArrayList<>();
    String interpreterName;
    List<TypeData> typeDataList;

    for (Cell cell : nbformat.getCells()) {
      String status = Result.SUCCESS;
      paragraph = new Paragraph();
      typeDataList = new ArrayList<>();
      Object cellSource = cell.getSource();
      List<String> sourceRaws = new ArrayList<>();

      if (cellSource instanceof String) {
        sourceRaws.add((String) cellSource);
      } else {
        sourceRaws.addAll((List<String>) cellSource);
      }

      List<String> source = Output.verifyEndOfLine(sourceRaws);
      String codeText = Joiner.on("").join(source);

      if (cell instanceof CodeCell) {
        interpreterName = codeReplaced;
        for (Output output : ((CodeCell) cell).getOutputs()) {
          if (output instanceof com.smartsuites.jupyter.nbformat.Error) {
            typeDataList.add(output.toZeppelinResult());
          } else {
            typeDataList.add(output.toZeppelinResult());
            if (output instanceof Stream) {
              Stream streamOutput = (Stream) output;
              if (streamOutput.isError()) {
                status = Result.ERROR;
              }
            }
          }
        }
      } else if (cell instanceof MarkdownCell || cell instanceof HeadingCell) {
        interpreterName = markdownReplaced;
        String markdownContent = markdownProcessor.render(codeText);
        typeDataList.add(new TypeData(TypeData.HTML, markdownContent));
        paragraph.setUpMarkdownConfig(true);
      } else {
        interpreterName = "";
      }

      paragraph.setText(interpreterName + lineSeparator + codeText);
      paragraph.setResults(new Result(status, typeDataList));

      paragraphs.add(paragraph);
    }

    note.setParagraphs(paragraphs);

    return note;
  }


  
  private Gson getGson(GsonBuilder gsonBuilder) {
    return gsonBuilder.registerTypeAdapterFactory(cellTypeFactory)
        .registerTypeAdapterFactory(outputTypeFactory).create();
  }

  public static void main(String[] args) throws ParseException, IOException {
    Options options = new Options();
    options.addOption("i", true, "Jupyter notebook file");
    options.addOption("o", true, "Zeppelin note file. Default: note.json");

    CommandLineParser parser = new DefaultParser();
    CommandLine cmd = parser.parse(options, args);

    if (!cmd.hasOption("i")) {
      new HelpFormatter().printHelp("java " + JupyterUtil.class.getName(), options);
      System.exit(1);
    }

    Path jupyterPath = Paths.get(cmd.getOptionValue("i"));
    Path zeppelinPath = Paths.get(cmd.hasOption("o") ? cmd.getOptionValue("o") : "note.json");

    try (BufferedReader in = new BufferedReader(new FileReader(jupyterPath.toFile()));
        FileWriter fw = new FileWriter(zeppelinPath.toFile())) {
      Note note = new JupyterUtil().getNote(in, "%python", "%md");
      Gson gson = new GsonBuilder().setPrettyPrinting().create();
      gson.toJson(note, fw);
    }
  }
}
