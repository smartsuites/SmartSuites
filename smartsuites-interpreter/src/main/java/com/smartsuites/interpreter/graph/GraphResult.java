/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.graph;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

import com.smartsuites.interpreter.InterpreterResult;
import com.smartsuites.tabledata.Node;
import com.smartsuites.tabledata.Relationship;

import com.google.gson.Gson;

/**
 * The intepreter result template for Networks
 *
 */
public class GraphResult extends InterpreterResult {

  /**
   * The Graph structure parsed from the front-end
   *
   */
  public static class Graph {
    private Collection<Node> nodes;
    
    private Collection<Relationship> edges;
    
    /**
     * The node types in the whole graph, and the related colors
     * 
     */
    private Map<String, String> labels;
    
    /**
     * The relationship types in the whole graph
     * 
     */
    private Set<String> types;

    /**
     * Is a directed graph
     */
    private boolean directed;
    
    public Graph() {}

    public Graph(Collection<Node> nodes, Collection<Relationship> edges,
        Map<String, String> labels, Set<String> types, boolean directed) {
      super();
      this.setNodes(nodes);
      this.setEdges(edges);
      this.setLabels(labels);
      this.setTypes(types);
      this.setDirected(directed);
    }

    public Collection<Node> getNodes() {
      return nodes;
    }

    public void setNodes(Collection<Node> nodes) {
      this.nodes = nodes;
    }

    public Collection<Relationship> getEdges() {
      return edges;
    }

    public void setEdges(Collection<Relationship> edges) {
      this.edges = edges;
    }

    public Map<String, String> getLabels() {
      return labels;
    }

    public void setLabels(Map<String, String> labels) {
      this.labels = labels;
    }

    public Set<String> getTypes() {
      return types;
    }
    
    public void setTypes(Set<String> types) {
      this.types = types;
    }

    public boolean isDirected() {
      return directed;
    }

    public void setDirected(boolean directed) {
      this.directed = directed;
    }

  }
  
  private static final Gson gson = new Gson();

  public GraphResult(Code code, Graph graphObject) {
    super(code, Type.NETWORK, gson.toJson(graphObject));
  }

}
