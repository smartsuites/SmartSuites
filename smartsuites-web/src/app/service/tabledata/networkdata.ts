/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

import TableData from './tabledata'
import {DatasetType} from './dataset'

/**
 * Create network data object from paragraph graph type result
 */
export default class NetworkData extends TableData {

  graph

  networkNodes

  networkRelationships

  constructor(graph) {
    super(null,null,null)
    this.graph = graph || {}
    if (this.graph.nodes) {
      this.loadParagraphResult({msg: JSON.stringify(graph), type: DatasetType.NETWORK})
    }
  }

  loadParagraphResult(paragraphResult) {
    if (!paragraphResult || paragraphResult.type !== DatasetType.NETWORK) {
      console.log('Can not load paragraph result')
      return
    }

    this.graph = JSON.parse(paragraphResult.msg.trim() || '{}')

    if (!this.graph.nodes) {
      console.log('Graph result is empty')
      return
    }

    this.setNodesDefaults()
    this.setEdgesDefaults()

    //this.networkNodes = angular.equals({}, this.graph.labels || {}) ? null : {count: this.graph.nodes.length, labels: this.graph.labels}
    this.networkNodes = ({} == this.graph.labels || {}) ? null : {count: this.graph.nodes.length, labels: this.graph.labels}
    //this.networkRelationships = angular.equals([], this.graph.types || []) ? null : {count: this.graph.edges.length, types: this.graph.types}
    this.networkRelationships = ([] == this.graph.types || []) ? null : {count: this.graph.edges.length, types: this.graph.types}

    let rows = []
    let comment = ''
    let entities = this.graph.nodes.concat(this.graph.edges)
    let baseColumnNames = [{name: 'id', index: 0, aggr: 'sum'},
                       {name: 'label', index: 1, aggr: 'sum'}]
    let internalFieldsToJump = ['count', 'size', 'totalCount',
      'data', 'x', 'y', 'labels']
    let baseCols = baseColumnNames.map( function(col) { return col.name })
    let keys = entities.map( function(elem) { return Object.keys(elem.data || {}) })
    keys = keys.flatten()
    keys = keys.uniq().filter(function(key) {
      return baseCols.indexOf(key) === -1
    })
    let columnNames = baseColumnNames.concat(keys.map( function(elem, i) {
      return {name: elem, index: i + baseColumnNames.length, aggr: 'sum'}
    }))
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i]
      let col = []
      let col2 = []
      entity.data = entity.data || {}
      for (let j = 0; j < columnNames.length; j++) {
        let name = columnNames[j].name
        let value = name in entity && internalFieldsToJump.indexOf(name) === -1
            ? entity[name] : entity.data[name]
        let parsedValue = value === null || value === undefined ? '' : value
        col.push(parsedValue)
        col2.push({key: name, value: parsedValue})
      }
      rows.push(col)
    }

    this.comment = comment
    this.columns = columnNames
    this.rows = rows
  }

  setNodesDefaults() {
  }

  setEdgesDefaults() {
    this.graph.edges
      .sort((a, b) => {
        if (a.source > b.source) {
          return 1
        } else if (a.source < b.source) {
          return -1
        } else if (a.target > b.target) {
          return 1
        } else if (a.target < b.target) {
          return -1
        } else {
          return 0
        }
      })
    this.graph.edges
      .forEach((edge, index) => {
        let prevEdge = this.graph.edges[index - 1]
        edge.count = (index > 0 && +edge.source === +prevEdge.source && +edge.target === +prevEdge.target
            ? prevEdge.count : 0) + 1
        edge.totalCount = this.graph.edges
          .filter((innerEdge) => +edge.source === +innerEdge.source && +edge.target === +innerEdge.target)
          .length
      })
    this.graph.edges
      .forEach((edge) => {
        if (typeof +edge.source === 'number') {
          edge.source = this.graph.nodes.filter((node) => +edge.source === +node.id)[0] || null
        }
        if (typeof +edge.target === 'number') {
          edge.target = this.graph.nodes.filter((node) => +edge.target === +node.id)[0] || null
        }
      })
  }

  getNetworkProperties() {
    let baseCols = ['id', 'label']
    let properties = {}
    this.graph.nodes.forEach(function(node) {
      let hasLabel = 'label' in node && node.label !== ''
      if (!hasLabel) {
        return
      }
      let label = node.label
      let hasKey = hasLabel && label in properties
      //let keys = _.uniq(Object.keys(node.data || {}).concat(hasKey ? properties[label].keys : baseCols))
      let keys = Object.keys(node.data || {}).concat(hasKey ? properties[label].keys : baseCols)
      if (!hasKey) {
        properties[label] = {selected: 'label'}
      }
      properties[label].keys = keys
    })
    return properties
  }
}
