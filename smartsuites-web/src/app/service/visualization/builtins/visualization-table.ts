/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

import Visualization from '../visualization'
import PassthroughTransformation from '../../tabledata/passthrough'

import {
  Widget, ValueType,
  isInputWidget, isOptionWidget, isCheckboxWidget,
  isTextareaWidget, isBtnGroupWidget,
  initializeTableConfig, resetTableOptionConfig,
  DefaultTableColumnType, TableColumnType, updateColumnTypeState,
  parseTableOption,
} from './visualization-util'

//const SETTING_TEMPLATE = require('./visualization-table-setting.html')

export const TABLE_OPTION_SPECS = [
  {
    name: 'useFilter',
    valueType: ValueType.BOOLEAN,
    defaultValue: false,
    widget: Widget.CHECKBOX,
    description: 'Enable filter for columns',
  },
  {
    name: 'showPagination',
    valueType: ValueType.BOOLEAN,
    defaultValue: false,
    widget: Widget.CHECKBOX,
    description: 'Enable pagination for better navigation',
  },
  {
    name: 'showAggregationFooter',
    valueType: ValueType.BOOLEAN,
    defaultValue: false,
    widget: Widget.CHECKBOX,
    description: 'Enable a footer for displaying aggregated values',
  },
]

/**
 * Visualize data in table format
 */
export default class TableVisualization extends Visualization {

  passthrough
  emitTimeout
  isRestoring

  gridOptions

  constructor (targetElId, config, emitter, jitCompiler, commonService) {
    super(targetElId, config, emitter, jitCompiler, commonService)
    this.passthrough = new PassthroughTransformation(config, emitter, jitCompiler)
    this.emitTimeout = null
    this.isRestoring = false

    initializeTableConfig(config, TABLE_OPTION_SPECS)
  }


  getColumnMinWidth(colName) {
    let width = 150 // default
    const calculatedWidth = colName.length * 10

    // use the broad one
    if (calculatedWidth > width) { width = calculatedWidth }

    return width
  }

  createGridOptions(tableData) {
    const rows = tableData.rows
    const columnNames = tableData.columns.map(c => {
      return {
        'title':c.name, 'data':c.name
      }
    })

    const gridData = rows.map(r => {
      return columnNames.reduce((acc, colName, index) => {
        acc[colName.data] = r[index]
        return acc
      }, {})
    })

    const gridOptions = {
      data: gridData,
      scrollY:"253px",
      scrollCollapse: true,
      paging: false,
      autoWidth: true,
      columns: columnNames
    }

    return gridOptions
  }

  getGridElemId() {
    const gridElemId = `${this.targetElId}_grid`.replace('-', '_')
    return gridElemId
  }

  getGridApiId() {
    // angular doesn't allow `-` in scope variable name
    const gridApiId = `${this.targetElId}_gridApi`.replace('-', '_')
    return gridApiId
  }

  // 刷新
  refresh() {
    const gridElemId = this.getGridElemId()
    const gridElem = this.jQuery(`#${gridElemId}`)

    if (gridElem > 0) {
      gridElem.css('height', this.jQuery(`#${this.targetElId}`).height() - 10)
    }
  }

  refreshGrid() {
    const gridElemId = this.getGridElemId()
    const gridElem = this.jQuery(`#${gridElemId}`)

    if (gridElem) {
      /*const scope = this.getScope()
      const gridApiId = this.getGridApiId()*/
      //scope[gridApiId].core.notifyDataChange(this._uiGridConstants.dataChange.ALL)
    }
  }

  updateColDefType(colDef, type) {
    if (type === colDef.type) { return }

    colDef.type = type
    const colName = colDef.name
    const config = this.config
    if (config.tableColumnTypeState.names && config.tableColumnTypeState.names[colName]) {
      config.tableColumnTypeState.names[colName] = type
      this.persistConfigWithGridState(this.config)
    }
  }

  // 添加列的目录
  addColumnMenus(gridOptions) {
    /*if (!gridOptions || !gridOptions.columnDefs) { return }

    const self = this // for closure

    // SHOULD use `function() { ... }` syntax for each action to get `this`
    gridOptions.columnDefs.map(colDef => {
      colDef.menuItems = [
        {
          title: 'Type: String',
          action: function() {
            self.updateColDefType(this.context.col.colDef, TableColumnType.STRING)
          },
          active: function() {
            return this.context.col.colDef.type === TableColumnType.STRING
          },
        },
        {
          title: 'Type: Number',
          action: function() {
            self.updateColDefType(this.context.col.colDef, TableColumnType.NUMBER)
          },
          active: function() {
            return this.context.col.colDef.type === TableColumnType.NUMBER
          },
        },
        {
          title: 'Type: Date',
          action: function() {
            self.updateColDefType(this.context.col.colDef, TableColumnType.DATE)
          },
          active: function() {
            return this.context.col.colDef.type === TableColumnType.DATE
          },
        },
      ]
    })*/
  }

  setDynamicGridOptions(gridOptions, config) {
    // parse based on their type definitions
    /*const parsed = parseTableOption(TABLE_OPTION_SPECS, config.tableOptionValue)

    const { showAggregationFooter, useFilter, showPagination, } = parsed

    gridOptions.showGridFooter = false
    gridOptions.showColumnFooter = showAggregationFooter
    gridOptions.enableFiltering = useFilter

    gridOptions.enablePagination = showPagination
    gridOptions.enablePaginationControls = showPagination

    if (showPagination) {
      gridOptions.paginationPageSize = 50
      gridOptions.paginationPageSizes = [25, 50, 100, 250, 1000]
    }

    // selection can't be rendered dynamically in ui-grid 4.0.4
    gridOptions.enableRowSelection = false
    gridOptions.enableRowHeaderSelection = false
    gridOptions.enableFullRowSelection = false
    gridOptions.enableSelectAll = false
    gridOptions.enableGroupHeaderSelection = false
    gridOptions.enableSelectionBatchEvent = false*/
  }

  // 渲染
  render (tableData) {
    const gridElemId = this.getGridElemId()
    let gridElem = document.getElementById(gridElemId)

    const config = this.config
    const self = this // for closure

    if (!gridElem) {
      // create, compile and append grid elem
      this.jQuery(`#${this.targetElId}`).append(`<table class="cell-border order-column hover" id="${gridElemId}"></table>`)

      // 设置图表的属性
      const gridOptions = this.createGridOptions(tableData)

      // 根据Config动态设置图表的属性
      this.setDynamicGridOptions(gridOptions, config)

      // 设置图表列的目录
      this.addColumnMenus(gridOptions)

      this.jQuery(`#${gridElemId}`).DataTable(gridOptions);


      // 设置变量
      this.gridOptions = gridOptions

    } else {
      // 获取已经有的图表配置项
      const gridOptions = this.getGridOptions()

      // 根据onfig动态设置图表的属性
      this.setDynamicGridOptions(gridOptions, config)

      // 刷新图表
      this.refreshGrid()
    }

  }

  /*restoreGridState(gridState) {
    if (!gridState) { return }

    // should set isRestoring to avoid that changed* events are triggered while restoring
    this.isRestoring = true
    const gridApi = this.getGridApi()

    // restore grid state when gridApi is available
    if (!gridApi) {
      setTimeout(() => this.restoreGridState(gridState), 100)
    } else {
      gridApi.saveState.restore(this.getScope(), gridState)
      this.isRestoring = false
    }
  }*/

  // 移除
  destroy () {
  }

  // 获取数据转换器
  getTransformation () {
    return this.passthrough
  }

  getGridOptions() {
    return this.gridOptions;
  }

  getGridApi() {
    /*const scope = this.getScope()
    const gridApiId = this.getGridApiId()
    return scope[gridApiId]*/
  }

  persistConfigImmediatelyWithGridState(config) {
    this.persistConfigWithGridState(config)
  }

  persistConfigWithGridState(config) {
    if (this.isRestoring) { return }

    const gridApi = this.getGridApi()
    //config.tableGridState = gridApi.saveState.save()
    this.emitConfig(config)
  }

  persistConfig(config) {
    this.emitConfig(config)
  }

  // 提供图表配置
  getSetting ():any {
    const self = this // for closure in scope
    const configObj = self.config

    // emit config if it's updated in `render`
    if (configObj.initialized) {
      configObj.initialized = false
      this.persistConfig(configObj) // should persist w/o state
    } else if (configObj.tableColumnTypeState &&
      configObj.tableColumnTypeState.updated) {
      configObj.tableColumnTypeState.updated = false
      this.persistConfig(configObj) // should persist w/o state
    }

    return {
      //template: SETTING_TEMPLATE,
      scope: {
        config: configObj,
        tableOptionSpecs: TABLE_OPTION_SPECS,
        isInputWidget: isInputWidget,
        isOptionWidget: isOptionWidget,
        isCheckboxWidget: isCheckboxWidget,
        isTextareaWidget: isTextareaWidget,
        isBtnGroupWidget: isBtnGroupWidget,
        tableOptionValueChanged: () => {
          self.persistConfigWithGridState(configObj)
        },
        saveTableOption: () => {
          self.persistConfigWithGridState(configObj)
        },
        resetTableOption: () => {
          resetTableOptionConfig(configObj)
          initializeTableConfig(configObj, TABLE_OPTION_SPECS)
          self.persistConfigWithGridState(configObj)
        },
        tableWidgetOnKeyDown: (event, optSpec) => {
          const code = event.keyCode || event.which
          if (code === 13 && isInputWidget(optSpec)) {
            self.persistConfigWithGridState(configObj)
          } else if (code === 13 && event.shiftKey && isTextareaWidget(optSpec)) {
            self.persistConfigWithGridState(configObj)
          }

          event.stopPropagation() /** avoid to conflict with paragraph shortcuts */
        }
      }
    }
  }
}
