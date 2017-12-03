/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.search;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.smartsuites.notebook.Note;
import com.smartsuites.notebook.Paragraph;

/**
 * Search (both, indexing and query) the notes.
 * 
 * Intended to have multiple implementation, i.e:
 *  - local Lucene (in-memory, on-disk)
 *  - remote Elasticsearch
 */
public interface SearchService {

  /**
   * Full-text search in all the notes
   *
   * @param queryStr a query
   * @return A list of matching paragraphs (id, text, snippet w/ highlight)
   */
  public List<Map<String, String>> query(String queryStr);

  /**
   * Updates all documents in index for the given note:
   *  - name
   *  - all paragraphs
   *
   * @param note a Note to update index for
   * @throws IOException
   */
  public void updateIndexDoc(Note note) throws IOException;

  /**
   * Indexes full collection of notes: all the paragraphs + Note names
   *
   * @param collection of Notes
   */
  public void addIndexDocs(Collection<Note> collection);

  /**
   * Indexes the given note.
   *
   * @throws IOException If there is a low-level I/O error
   */
  public void addIndexDoc(Note note);

  /**
   * Deletes all docs on given Note from index
   */
  public void deleteIndexDocs(Note note);

  /**
   * Deletes doc for a given
   *
   * @param note
   * @param p
   * @throws IOException
   */
  public void deleteIndexDoc(Note note, Paragraph p);

  /**
   * Frees the recourses used by index
   */
  public void close();

}
