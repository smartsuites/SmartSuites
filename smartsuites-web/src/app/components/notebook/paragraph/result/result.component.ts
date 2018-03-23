import {
  AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer, Renderer2, ViewChild, ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {DefaultDisplayType, SpellResult} from "../../../../service/spell";
import BarchartVisualization from "../../../../service/visualization/builtins/visualization-barchart";
import AreachartVisualization from "../../../../service/visualization/builtins/visualization-areachart";
import DatasetFactory from "../../../../service/tabledata/datasetfactory";
import {WebsocketMessageService} from "../../../../service/websocket/websocket-message.service";
import {NotebookComponent} from "../../notebook.component";
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../../../service/base-url/base-url.service";
import {JitCompileService} from "../../../../service/jitcompile/jitcompile.service";
import {MenuItem} from "primeng/primeng";
import {EventService} from "../../../../service/event/event.service";
import {CommonService} from "../../../../service/common/common.service";
import PiechartVisualization from "../../../../service/visualization/builtins/visualization-piechart";
import LinechartVisualization from "../../../../service/visualization/builtins/visualization-linechart";
import ScatterchartVisualization from "../../../../service/visualization/builtins/visualization-scatterchart";
import {HighlightJsService} from "angular2-highlight-js";
import {DeepClone, ObjectEqual} from "../../../../utils/Utils";
import {ParagraphStatus} from "../paragraph.status";
/*import {AnsiUp} from "ansi_up/ansi_up"*/

@Component({
  selector: 'app-result',
  inputs: ['paragraphid','index','noteid'],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  providers:[JitCompileService]
})
export class ResultComponent implements OnInit,OnDestroy {

  //**************** 导出数据按钮 *******************//

  //导出数据按钮
  items: MenuItem[] = [
    {label: 'CSV', command: () => {
        this.exportToDSV(',');
      }},
    {label: 'TSV', command: () => {
        this.exportToDSV('\t');
      }}
  ];

  //导出数据方法
  exportToDSV(delimiter) {
    /*let dsv = ''
    let dateFinished = moment(paragraph.dateFinished).format('YYYY-MM-DD hh:mm:ss A')
    let exportedFileName = paragraph.title ? paragraph.title + '_' + dateFinished : 'data_' + dateFinished

    for (let titleIndex in tableData.columns) {
      dsv += tableData.columns[titleIndex].name + delimiter
    }
    dsv = dsv.substring(0, dsv.length - 1) + '\n'
    for (let r in tableData.rows) {
      let row = tableData.rows[r]
      let dsvRow = ''
      for (let index in row) {
        let stringValue = (row[index]).toString()
        if (stringValue.indexOf(delimiter) > -1) {
          dsvRow += '"' + stringValue + '"' + delimiter
        } else {
          dsvRow += row[index] + delimiter
        }
      }
      dsv += dsvRow.substring(0, dsvRow.length - 1) + '\n'
    }
    let extension = ''
    if (delimiter === '\t') {
      extension = 'tsv'
    } else if (delimiter === ',') {
      extension = 'csv'
    }
    saveAsService.saveAs(dsv, exportedFileName, extension)*/
  }

  //**************** 内置可视化配置 *******************//

  //内置的可视化
  builtInTableDataVisualizationList = [
    {
      id: 'table',   // paragraph.config.graph.mode
      name: 'Table', // human readable name. tooltip
      icon: 'fa fa-table',
      supports: [DefaultDisplayType.TABLE, DefaultDisplayType.NETWORK]
    },
    {
      id: 'multiBarChart',
      name: 'Bar Chart',
      icon: 'fa fa-bar-chart',
      transformation: 'pivot',
      supports: [DefaultDisplayType.TABLE, DefaultDisplayType.NETWORK]
    },
    {
      id: 'pieChart',
      name: 'Pie Chart',
      icon: 'fa fa-pie-chart',
      transformation: 'pivot',
      supports: [DefaultDisplayType.TABLE, DefaultDisplayType.NETWORK]
    },
    {
      id: 'stackedAreaChart',
      name: 'Area Chart',
      icon: 'fa fa-area-chart',
      transformation: 'pivot',
      supports: [DefaultDisplayType.TABLE, DefaultDisplayType.NETWORK]
    },
    {
      id: 'lineChart',
      name: 'Line Chart',
      icon: 'fa fa-line-chart',
      transformation: 'pivot',
      supports: [DefaultDisplayType.TABLE, DefaultDisplayType.NETWORK]
    },
    {
      id: 'scatterChart',
      name: 'Scatter Chart',
      icon: 'cf cf-scatter-chart',
      supports: [DefaultDisplayType.TABLE, DefaultDisplayType.NETWORK]
    },
    {
      id: 'network',
      name: 'Network',
      icon: 'fa fa-share-alt',
      supports: [DefaultDisplayType.NETWORK]
    }
  ]

  //内置的可视化实例信息
  builtInVisualizations = {
    /*'table': {
      class: TableVisualization,
      instance: undefined   // created from setGraphMode()
    },*/
    'multiBarChart': {
      class: BarchartVisualization,
      instance: undefined
    },
    'pieChart': {
      class: PiechartVisualization,
      instance: undefined
    },
    'stackedAreaChart': {
      class: AreachartVisualization,
      instance: undefined
    },
    'lineChart': {
      class: LinechartVisualization,
      instance: undefined
    },
    'scatterChart': {
      class: ScatterchartVisualization,
      instance: undefined
    },
    /*'network': {
      class: NetworkVisualization,
      instance: undefined
    }*/
  }


  //*************** 渲染显示结果 *******************//

  //内置可视化渲染切换
  switchViz(newMode) {
    // 注意
    let newConfig = DeepClone(this.config)
    let newParams = DeepClone(this.paragraph.settings.params)

    // graph options
    newConfig.graph.mode = newMode

    // see switchApp()
    //newConfig.set('helium.activeApp', undefined)
    newConfig.helium.activeApp = undefined

    this.commitParagraphResult(this.paragraph.title, this.paragraph.text, newConfig, newParams)
  }

  //App可视化渲染切换
  switchApp(appId) {
    //let newConfig = Object.assign({}, this.config)
    let newConfig = this.config
    //let newParams = Object.assign({}, this.paragraph.settings.params)
    let newParams = this.paragraph.settings.params

    // 'helium.activeApp' can be cleared by switchViz()
    newConfig.set('helium.activeApp', appId)

    //this.commitConfig(newConfig, newParams)
  }

  // 渲染结果数据
  renderResult(type, refresh) {
    let activeApp
    if (this.enableHelium) {
      //this.getApplicationStates()
      activeApp = this.config['helium.activeApp']
    }

    if (activeApp) {
      //插件式Spell渲染方式
      /*const appState = _.find($scope.apps, {id: activeApp})
      renderApp(`p${appState.id}`, appState)*/
    } else {
      if (!DefaultDisplayType[type]) {
        //渲染自定义方式
        //this.renderCustomDisplay(type, this.data)
      } else {
        //渲染内置的结果
        const targetElemId = this.createDisplayDOMId(`p${this.id}`, type)
        this.renderDefaultDisplay(targetElemId, type, this.data, refresh)
      }
    }
  }

  // 渲染内置的结果
  renderDefaultDisplay(targetElemId, type, data, refresh) {
    const afterLoaded = () => {
      if (type === DefaultDisplayType.TABLE || type === DefaultDisplayType.NETWORK) {
        this.renderGraph(targetElemId, this.graphMode, refresh)
      } else if (type === DefaultDisplayType.HTML) {
        this.renderHtml(targetElemId, data)
      } else if (type === DefaultDisplayType.ANGULAR) {
        this.renderAngular(targetElemId, data)
      } else if (type === DefaultDisplayType.TEXT) {
        this.renderText(targetElemId, data)
      } else if (type === DefaultDisplayType.ELEMENT) {
        this.renderElem(targetElemId, data)
      } else {
        console.error(`Unknown Display Type: ${type}`)
      }
    }

    this.retryUntilElemIsLoaded(targetElemId, afterLoaded)

    // send message to parent that this result is rendered
    const paragraphId = this.paragraphid
    this.eventService.broadcast('resultRendered', paragraphId)
  }

  // 渲染图表
  renderGraph(graphElemId, graphMode, refresh) {
    // set graph height
    let self = this;
    let height = self.config.graph.height
    if(!height){
      height = 350
    }
    //TODO height统一为350
    height = 350

    const graphElem = self.getDomById(`#${graphElemId}`)
    self.commonService._jQuery(`#${graphElemId}`).height(height)

    if (!graphMode) { graphMode = 'table' }

    let builtInViz = this.builtInVisualizations[graphMode]
    if (!builtInViz) {
      /** helium package is not available, fallback to table vis */
      graphMode = 'table'
      this.graphMode = graphMode /** html depends on this scope value */
      builtInViz = this.builtInVisualizations[graphMode]
    }

    // deactive previsouly active visualization
    for (let t in this.builtInVisualizations) {
      const v = this.builtInVisualizations[t].instance

      if (t !== graphMode && v && v.isActive()) {
        v.deactivate()
        break
      }
    }

    let afterLoaded = function (loadedElem):any { /** will be overwritten */ }

    if (!builtInViz.instance) { // not instantiated yet
      // render when targetEl is available
      afterLoaded = function (loadedElem) {
        try {
          //const transformationSettingTargetEl = self.getTrSettingElem(self.id, graphMode)
          //const visualizationSettingTargetEl = self.getVizSettingElem(self.id, graphMode)
          // set height
          self.commonService._jQuery(`#${loadedElem}`).height(height)

          // instantiate visualization
          const config = self.getVizConfig(graphMode)
          const Visualization = builtInViz.class

          // inject emitter, $templateRequest
          const emitter = function (graphSetting) {
            self.commitVizConfigChange(graphSetting, graphMode)
          }

          builtInViz.instance = new Visualization(loadedElem, config, self.renderer2, emitter, self.jitCompile, self.commonService)

          /*builtInViz.instance._emitter = emitter
          builtInViz.instance._jitCompiler = self.jitCompile*/

          //builtInViz.instance._renderer2 = self.renderer2

          //builtInViz.instance._compile = $compile

          // ui-grid related
          /*$templateCache.put('ui-grid/ui-grid-filter', TableGridFilterTemplate)
          builtInViz.instance._uiGridConstants = uiGridConstants
          builtInViz.instance._timeout = $timeout
          */

          //builtInViz.instance._createNewScope = createNewScope
          //builtInViz.instance._templateRequest = $templateRequest

          const transformation = builtInViz.instance.getTransformation()

          //transformation._emitter = emitter
          //transformation._jitCompiler = self.jitCompile

          //transformation._templateRequest = $templateRequest
          //transformation._compile = $compile
          //transformation._createNewScope = createNewScope

          // 渲染数据配置
          //transformation.renderSetting(self.transformationSettingTargetEl)

          // render
          const transformed = transformation.transform(self.tableData)

          // 渲染图表配置
          //builtInViz.instance.renderSetting(self.visualizationSettingTargetEl)

          // 渲染图标
          builtInViz.instance.render(transformed)

          builtInViz.instance.activate()

          /*angular.element(window).resize(() => {
            builtInViz.instance.resize()
          })*/
        } catch (err) {
          console.error('Graph drawing error %o', err)
        }
      }
    } else if (refresh) {
      // when graph options or data are changed
      console.log('Refresh data %o', self.tableData)

      afterLoaded = function (loadedElem) {
        const transformationSettingTargetEl = self.getTrSettingElem(self.id, graphMode)
        const visualizationSettingTargetEl = self.getVizSettingElem(self.id, graphMode)
        const config = self.getVizConfig(graphMode)
        self.commonService._jQuery(`#${loadedElem}`).height(height)
        const transformation = builtInViz.instance.getTransformation()
        transformation.setConfig(config)
        const transformed = transformation.transform(self.tableData)

        //transformation.renderSetting(transformationSettingTargetEl)

        builtInViz.instance.setConfig(config)
        builtInViz.instance.render(transformed)

        //builtInViz.instance.renderSetting(visualizationSettingTargetEl)
      }
    } else {
      afterLoaded = function (loadedElem) {
        //loadedElem.height(height)
        self.commonService._jQuery(`#${loadedElem}`).height(height)
        builtInViz.instance.activate()
      }
    }

    const tableElemId = `p${self.id}_${self.graphMode}`
    //具体的类型
    self.retryUntilElemIsLoaded(tableElemId, afterLoaded)
  }

  // 渲染HTML
  renderHtml(targetElemId, data) {
    let self = this;
    const elem = self.commonService._jQuery(`#${targetElemId}`)
    this.handleData(data, DefaultDisplayType.HTML,
      (generated) => {
        elem.html(generated)
        elem.find('pre code').each(function (i, e) {
          self.highlightJsService.highlight(e,false)
        })
        /*
        /!* eslint new-cap: [2, {"capIsNewExceptions": ["MathJax.Hub.Queue"]}] *!/
        */
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, elem[0]])
      },
      (error) => { elem.html(`${error.stack}`) }
    )
  }

  // 渲染Angular对象
  renderAngular(targetElemId, data) {
    /*const elem = angular.element(`#${targetElemId}`)
    const paragraphScope = noteVarShareService.get(`${paragraph.id}_paragraphScope`)
    handleData(data, DefaultDisplayType.ANGULAR,
      (generated) => {
        elem.html(generated)
        $compile(elem.contents())(paragraphScope)
      },
      (error) => { elem.html(`${error.stack}`) }
    )*/
  }

  // 渲染文本数据
  renderText(targetElemId, data) {
    let self = this;
    const elem = self.commonService._jQuery(`#${targetElemId}`)
    this.handleData(data, DefaultDisplayType.TEXT,
      (generated) => {
        // clear all lines before render
        self.removeChildrenDOM(targetElemId)

        if (generated) {
          /*let ansi = new AnsiUp()
          const escaped = ansi.ansi_to_html(generated)*/
          /*let ansi = new AnsiUp()
          const escaped = ansi.ansi_to_html(generated)*/
          //const divDom = self.renderer2.createElement('<div>');
          //self.renderer2.setValue(divDom,generated)
          const divDOM = document.createElement("div").innerHTML = generated
          //self.renderer2.appendChild(elem,divDom)
          elem.append(divDOM)
        }

        elem.bind('mousewheel', (e) => { /*self.keepScrollDown = false*/ })
      },
      (error) => { elem.html(`${error.stack}`) }
    )
  }

  // 渲染元素
  renderElem(targetElemId, data) {
    const elem = this.getDomById(`#${targetElemId}`)
    this.handleData(() => { data(targetElemId) }, DefaultDisplayType.ELEMENT,
      () => {}, /** HTML element will be filled with data. thus pass empty success callback */
      (error) => { elem.nativeElement.html(`${error.stack}`) }
    )
  }

  //定制化渲染
  renderCustomDisplay(type, data) {
    let self = this;
    // get result from intp
    /*if (!self.heliumService.getSpellByMagic(type)) {
      console.error(`Can't execute spell due to unknown display type: ${type}`)
      return
    }*/

    // custom display result can include multiple subset results
    /*self.heliumService.executeSpellAsDisplaySystem(type, data)
      .then(dataWithTypes => {
        const containerDOMId = `p${self.id}_custom`
        const afterLoaded = () => {
          const containerDOM = angular.element(`#${containerDOMId}`)
          // Spell.interpret() can create multiple outputs
          for (let i = 0; i < dataWithTypes.length; i++) {
            const dt = dataWithTypes[i]
            const data = dt.data
            const type = dt.type

            // prepare each DOM to be filled
            const subResultDOMId = $scope.createDisplayDOMId(`p${$scope.id}_custom_${i}`, type)
            const subResultDOM = document.createElement('div')
            containerDOM.append(subResultDOM)
            subResultDOM.setAttribute('id', subResultDOMId)

            $scope.renderDefaultDisplay(subResultDOMId, type, data, true)
          }
        }

        self.retryUntilElemIsLoaded(containerDOMId, afterLoaded)
      })
      .catch(error => {
        console.error(`Failed to render custom display: ${self.type}\n` + error)
      })*/
  }

  /**
   * generates actually object which will be consumed from `data` property
   * feed it to the success callback.
   * if error occurs, the error is passed to the failure callback
   *
   * @param data {Object or Function}
   * @param type {string} Display Type
   * @param successCallback
   * @param failureCallback
   */
  handleData(data, type, successCallback, failureCallback) {
    if (SpellResult.isFunction(data)) {
      try {
        successCallback(data())
      } catch (error) {
        failureCallback(error)
        console.error(`Failed to handle ${type} type, function data\n`, error)
      }
    } else if (SpellResult.isObject(data)) {
      try {
        successCallback(data)
      } catch (error) {
        console.error(`Failed to handle ${type} type, object data\n`, error)
      }
    }
  }

  isDefaultDisplay() {
    return DefaultDisplayType[this.type]
  }

  //渲染Spell方法
  renderApp(targetElemId, appState) {
    /*const afterLoaded = (loadedElem) => {
      try {
        console.log('renderApp %o', appState)
        loadedElem.html(appState.output)
        $compile(loadedElem.contents())(getAppScope(appState))
      } catch (err) {
        console.log('App rendering error %o', err)
      }
    }
    this.retryUntilElemIsLoaded(targetElemId, afterLoaded)*/
  }


  //**************** 提交保存配置 *******************//

  //提交配置变更
  commitParagraphResult(title, text, config, params) {
    let self = this;
    //let newParagraphConfig = angular.copy(paragraph.config)
    let newParagraphConfig = DeepClone(self.paragraph.config)
    newParagraphConfig.results = newParagraphConfig.results || []
    newParagraphConfig.results[self.resultIndex] = config
    if (self.revisionView === true) {
      // local update without commit
      self.updateData({
        type: self.type,
        data: self.data
      }, newParagraphConfig.results[self.resultIndex], self.paragraph, self.resultIndex)
      self.renderResult(self.type, true)
    } else {
      return self.websocketMsgSrv.commitParagraph(self.paragraphid, title, text, newParagraphConfig, params,self.noteid)
    }
  }

  //提交配置变更
  commitConfig(config, params) {
    this.commitParagraphResult(this.paragraph.title, this.paragraph.text, config, params)
  }

  //提交可视化配置变更
  commitVizConfigChange(config, vizId) {
    let self = this;
    //let newConfig = angular.copy($scope.config)
    let newConfig = self.config
    if (!newConfig.graph) {
      newConfig.graph = {}
    }

    // copy setting for vizId
    if (!newConfig.graph.setting) {
      newConfig.graph.setting = {}
    }
    //newConfig.graph.setting[vizId] = angular.copy(config)
    newConfig.graph.setting[vizId] = Object.assign(config)

    // copy common setting
    if (newConfig.graph.setting[vizId]) {
      newConfig.graph.commonSetting = newConfig.graph.setting[vizId].common
      delete newConfig.graph.setting[vizId].common
    }

    // copy pivot setting
    if (newConfig.graph.commonSetting && newConfig.graph.commonSetting.pivot) {
      newConfig.graph.keys = newConfig.graph.commonSetting.pivot.keys
      newConfig.graph.groups = newConfig.graph.commonSetting.pivot.groups
      newConfig.graph.values = newConfig.graph.commonSetting.pivot.values
      delete newConfig.graph.commonSetting.pivot
    }
    console.debug('committVizConfig', newConfig)
    //let newParams = angular.copy(paragraph.settings.params)
    let newParams = Object.assign({},self.paragraph.settings.params)

    self.commitParagraphResult(self.paragraph.title, self.paragraph.text, newConfig, newParams)
  }

  //*************** App可视化插件管理 *******************//

  // app states
  apps = []

  // suggested apps
  suggestion = {
    available:[]
  }

  getSuggestions() {
    // Get suggested apps
    let self = this;
    let noteId = this.notebookCom.noteId
    if (!noteId) {
      return
    }
    this.httpCient.get(this.baseUrlSrv.getRestApiBase() + '/helium/suggest/' + noteId + '/' + this.paragraph.id)
      .subscribe(
        response => {
          self.suggestion = response['body']
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      )
  }

  loadApp(heliumPackage) {
    /*let noteId = $route.current.pathParams.noteId
    $http.post(baseUrlSrv.getRestApiBase() + '/helium/load/' + noteId + '/' + paragraph.id, heliumPackage)
      .success(function (data, status, headers, config) {
        console.log('Load app %o', data)
      })
      .error(function (err, status, headers, config) {
        console.log('Error %o', err)
      })*/
  }

  getApplicationStates() {
    let appStates = []

    // Display ApplicationState
    /*if (this.paragraph.apps) {
      forEach(this.paragraph.apps, function (app) {
        appStates.push({
          id: app.id,
          pkg: app.pkg,
          status: app.status,
          output: app.output
        })
      })
    }*/

    // update or remove app states no longer exists
    /*forEach(this.apps, function (currentAppState, idx) {
      let newAppState = appStates.find({id: currentAppState.id})
      if (newAppState) {
        angular.extend($scope.apps[idx], newAppState)
      } else {
        $scope.apps.splice(idx, 1)
      }
    })

    // add new app states
    _.forEach(appStates, function (app, idx) {
      if ($scope.apps.length <= idx || $scope.apps[idx].id !== app.id) {
        $scope.apps.splice(idx, 0, app)
      }
    })*/
  }

  getAppRegistry(appState) {
    if (!appState.registry) {
      appState.registry = {}
    }

    return appState.registry
  }

  getAppScope(appState) {
    if (!appState.scope) {
      //appState.scope = $rootScope.$new(true, $rootScope)
    }
    return appState.scope
  }

  //*************** 改变图表大小 *******************//

  resizeTimer

  mouseDown = false
  onMouseDown(){ this.mouseDown = true}
  onMouseUp(){ this.mouseDown = false}

  mouseOver = false
  onMouseOver(){ this.mouseOver = true }
  onMouseOut(){ this.mouseOver = false }

  test(e){
    if(this.mouseDown && this.mouseOver){
      console.log(">>>>>>>>>>>>>>>")
      console.log(e)
      //this.startResizeTimer(800,500)
    }
  }

  killResizeTimer() {
    let self = this;
    if (self.resizeTimer) {
      clearTimeout(self.resizeTimer)
      self.resizeTimer = null
    }
  }

  // 启动保存
  startResizeTimer(width, height) {
    let self = this;
    self.killResizeTimer()
    self.resizeTimer = setTimeout(function () {
      console.log("resize start")
      self.changeHeight(width, height)
    }, 2000)
  }

  changeHeight(width, height) {
    let newParams = this.paragraph.settings.params
    let newConfig = DeepClone(this.config)

    newConfig.graph.height = height
    //this.paragraph.config.colWidth = width

    this.commitParagraphResult(this.paragraph.title, this.paragraph.text, newConfig, newParams)
  }

  //*************** 展示图表配置 *******************//

  toggleGraphSetting() {
    //let newConfig = angular.copy($scope.config)
    let newConfig = this.config
    if (newConfig.graph.optionOpen) {
      newConfig.graph.optionOpen = false
    } else {
      newConfig.graph.optionOpen = true
    }

    //let newParams = angular.copy(paragraph.settings.params)
    let newParams = this.paragraph.settings.params
    this.commitParagraphResult(this.paragraph.title, this.paragraph.text, newConfig, newParams)
  }

  getVizConfig(vizId) {
    let self = this;
    let config
    let graph = self.config.graph
    if (graph) {
      // copy setting for vizId
      if (graph.setting) {
        //config = angular.copy(graph.setting[vizId])
        //config = graph.setting[vizId]
        config = Object.assign({}, graph.setting[vizId])
      }

      if (!config) {
        config = {}
      }

      // copy common setting
      //config.common = angular.copy(graph.commonSetting) || {}
      config.common = Object.assign({}, graph.commonSetting)

      // copy pivot setting
      if (graph.keys) {
        /*config.common.pivot = {
          keys: angular.copy(graph.keys),
          groups: angular.copy(graph.groups),
          values: angular.copy(graph.values)
        }*/
        config.common.pivot = {
          keys: Object.assign({},graph.keys),
          groups: Object.assign({},graph.groups),
          values: Object.assign({},graph.values)
        }
      }
    }
    console.debug('getVizConfig', config)
    return config
  }








  // prevent body area scrollbar from blocking due to scroll in paragraph results


  getPointerEvent() {
    return (this.mouseOver) ? {'pointer-events': 'auto' }
      : {'pointer-events': 'none' }
  }

  getTextResultElemId(resultId) {
    return `p${resultId}_text`
  }

  removeChildrenDOM(targetElemId) {
    const elem = this.commonService._jQuery(`#${targetElemId}`)
    if (elem.length) {
      elem.children().remove()
    }
  }

  appendTextOutput(data) {
    /*const elemId = getTextResultElemId($scope.id)
    textResultQueueForAppend.push(data)

    // if DOM is not loaded, just push data and return
    if (!isDOMLoaded(elemId)) {
      return
    }

    const elem = angular.element(`#${elemId}`)

    // pop all stacked data and append to the DOM
    while (textResultQueueForAppend.length > 0) {
      const line = textResultQueueForAppend.pop()
      elem.append(angular.element('<div></div>').text(line))

      if ($scope.keepScrollDown) {
        const doc = angular.element(`#${elemId}`)
        doc[0].scrollTop = doc[0].scrollHeight
      }
    }*/
  }


  //********************* 公用数据 ********************//

  //外部传入字段
  paragraphid
  index
  noteid

  //结果的类型 TABLE NETWORK
  type = null

  //结果数据
  data

  //结果的配置
  config = null

  //resultId = paragraph.id + index
  id = null

  //片段对象
  paragraph

  //结果的索引【第几个结果】
  resultIndex

  //Table结果的实例
  tableData

  // available columns in tabledata
  tableDataColumns = []

  tableDataComment


  networkNodes
  networkRelationships
  networkProperties


  // enable helium
  enableHelium = false

  //图表的类型
  graphMode = null

  // image data
  imageData = null

  // queue for append output
  textResultQueueForAppend = []

  revisionView

  result

  //当初次加载时的初始化方法
  init(result, config, paragraph, index) {
    // register helium plugin vis packages
    let self = this;

    //let visPackages = heliumService.getVisualizationCachedPackages()
    //const visPackageOrder = heliumService.getVisualizationCachedPackageOrder()

    // push the helium vis packages following the order
    /*visPackageOrder.map(visName => {
      visPackages.map(vis => {
        if (vis.name !== visName) { return }
        self.builtInTableDataVisualizationList.push({
          id: vis.id,
          name: vis.name,
          icon: $sce.trustAsHtml(vis.icon),
          supports: [DefaultDisplayType.TABLE, DefaultDisplayType.NETWORK]
        })
        self.builtInVisualizations[vis.id] = {
          class: vis.class
        }
      })
    })*/

    self.updateData(result, config, paragraph, index)
    self.renderResult(self.type,false)
  }

  // 更新组件内部数据
  updateData(result, config, paragraphRef, index) {
    this.data = result.data
    this.paragraph = paragraphRef
    this.resultIndex = parseInt(index)

    this.id = this.paragraph.id + '_' + index
    this.type = result.type
    this.config = config ? config : {}

    // initialize default config values
    if (!this.config.graph) {
      this.config.graph = {}
    }

    if (!this.config.graph.mode) {
      this.config.graph.mode = 'table'
    }

    if (!this.config.graph.height) {
      this.config.graph.height = 300
    }

    if (!this.config.graph.optionOpen) {
      this.config.graph.optionOpen = false
    }

    this.graphMode = this.config.graph.mode
    this.config = Object.assign({},config)

    // enable only when it is last result
    this.enableHelium = (index === paragraphRef.results.msg.length - 1)

    if (this.type === 'TABLE' || this.type === 'NETWORK') {
      this.tableData = new DatasetFactory().createDataset(this.type)
      this.tableData.loadParagraphResult({type: this.type, msg: this.data})
      this.tableDataColumns = this.tableData.columns
      this.tableDataComment = this.tableData.comment
      if (this.type === 'NETWORK') {
        this.networkNodes = this.tableData.networkNodes
        this.networkRelationships = this.tableData.networkRelationships
        this.networkProperties = this.tableData.networkProperties
      }
    } else if (this.type === 'IMG') {
      this.imageData = this.data
    }
  }

  constructor(private websocketMsgSrv:WebsocketMessageService,
              private elementRef: ElementRef,
              private notebookCom:NotebookComponent,
              private httpCient:HttpClient,
              private baseUrlSrv:BaseUrlService,
              private jitCompile:JitCompileService,
              private renderer2:Renderer2,
              private commonService:CommonService,
              private eventService:EventService,
              private highlightJsService : HighlightJsService) {
  }

  subscribers = []

  ngOnInit() {
    let self = this;
    let paragraph = self.notebookCom.getParagraphById(self.paragraphid);

    this.init(paragraph.results.msg[self.index],paragraph.config.results[self.index],paragraph,self.index)


    self.eventService.subscribeRegister(self.subscribers,'appendAppOutput', function (event, data) {
      let self = this;
      /*if (paragraph.id === data.paragraphId) {
        let app = self.apps.find({id: data.appId})
        if (app) {
          app.output += data.data

          let paragraphAppState = self.paragraph.apps.find({id: data.appId})
          paragraphAppState.output = app.output

          let targetEl = angular.element(document.getElementById('p' + app.id))
          targetEl.html(app.output)
          $compile(targetEl.contents())(getAppScope(app))
          console.log('append app output %o', $scope.apps)
        }
      }*/
    })

    self.eventService.subscribeRegister(self.subscribers,'updateAppOutput', function (event, data) {
      /*if (paragraph.id === data.paragraphId) {
        let app = _.find($scope.apps, {id: data.appId})
        if (app) {
          app.output = data.data

          let paragraphAppState = _.find(paragraph.apps, {id: data.appId})
          paragraphAppState.output = app.output

          let targetEl = angular.element(document.getElementById('p' + app.id))
          targetEl.html(app.output)
          $compile(targetEl.contents())(getAppScope(app))
          console.log('append app output')
        }
      }*/
    })

    self.eventService.subscribeRegister(self.subscribers,'appLoad', function (event, data) {
      /*if (paragraph.id === data.paragraphId) {
        let app = _.find($scope.apps, {id: data.appId})
        if (!app) {
          app = {
            id: data.appId,
            pkg: data.pkg,
            status: 'UNLOADED',
            output: ''
          }

          $scope.apps.push(app)
          paragraph.apps.push(app)
          $scope.switchApp(app.id)
        }
      }*/
    })

    self.eventService.subscribeRegister(self.subscribers,'appStatusChange', function (event, data) {
      /*if (paragraph.id === data.paragraphId) {
        let app = _.find($scope.apps, {id: data.appId})
        if (app) {
          app.status = data.status
          let paragraphAppState = _.find(paragraph.apps, {id: data.appId})
          paragraphAppState.status = app.status
        }
      }*/
    })

    self.eventService.subscribeRegister(self.subscribers,'angularObjectUpdate', function (event, data) {
      /*let noteId = $route.current.pathParams.noteId
      if (!data.noteId || data.noteId === noteId) {
        let scope
        let registry

        let app = _.find($scope.apps, {id: data.paragraphId})
        if (app) {
          scope = getAppScope(app)
          registry = getAppRegistry(app)
        } else {
          // no matching app in this paragraph
          return
        }

        let varName = data.angularObject.name

        if (angular.equals(data.angularObject.object, scope[varName])) {
          // return when update has no change
          return
        }

        if (!registry[varName]) {
          registry[varName] = {
            interpreterGroupId: data.interpreterGroupId,
            noteId: data.noteId,
            paragraphId: data.paragraphId
          }
        } else {
          registry[varName].noteId = registry[varName].noteId || data.noteId
          registry[varName].paragraphId = registry[varName].paragraphId || data.paragraphId
        }

        registry[varName].skipEmit = true

        if (!registry[varName].clearWatcher) {
          registry[varName].clearWatcher = scope.$watch(varName, function (newValue, oldValue) {
            console.log('angular object (paragraph) updated %o %o', varName, registry[varName])
            if (registry[varName].skipEmit) {
              registry[varName].skipEmit = false
              return
            }
            websocketMsgSrv.updateAngularObject(
              registry[varName].noteId,
              registry[varName].paragraphId,
              varName,
              newValue,
              registry[varName].interpreterGroupId)
          })
        }
        console.log('angular object (paragraph) created %o', varName)
        scope[varName] = data.angularObject.object

        // create proxy for AngularFunction
        if (varName.indexOf(ANGULAR_FUNCTION_OBJECT_NAME_PREFIX) === 0) {
          let funcName = varName.substring((ANGULAR_FUNCTION_OBJECT_NAME_PREFIX).length)
          scope[funcName] = function () {
            // eslint-disable-next-line prefer-rest-params
            scope[varName] = arguments
            // eslint-disable-next-line prefer-rest-params
            console.log('angular function (paragraph) invoked %o', arguments)
          }

          console.log('angular function (paragraph) created %o', scope[funcName])
        }
      }*/
    })

    self.eventService.subscribeRegister(self.subscribers,'angularObjectRemove', function (event, data) {
      /*let noteId = $route.current.pathParams.noteId
      if (!data.noteId || data.noteId === noteId) {
        let scope
        let registry

        let app = _.find($scope.apps, {id: data.paragraphId})
        if (app) {
          scope = getAppScope(app)
          registry = getAppRegistry(app)
        } else {
          // no matching app in this paragraph
          return
        }

        let varName = data.name

        // clear watcher
        if (registry[varName]) {
          registry[varName].clearWatcher()
          registry[varName] = undefined
        }

        // remove scope variable
        scope[varName] = undefined

        // remove proxy for AngularFunction
        if (varName.indexOf(ANGULAR_FUNCTION_OBJECT_NAME_PREFIX) === 0) {
          let funcName = varName.substring((ANGULAR_FUNCTION_OBJECT_NAME_PREFIX).length)
          scope[funcName] = undefined
        }
      }*/

    })

    // 监听更新结果
    self.eventService.subscribeRegister(self.subscribers,'updateResult', function (newResult, newConfig, paragraphRef, index) {
      if (!(self.paragraphid === paragraphRef.id) || !(index === self.resultIndex)) {
        return
      }

      let refresh = !ObjectEqual(newConfig,self.config) ||
        !(newResult.type === self.type) ||
        !(newResult.data === self.data)

      self.updateData(newResult, newConfig, self.paragraph, self.resultIndex)
      self.renderResult(self.type, refresh)
    })

    // 监听片段更改结果
    self.eventService.subscribeRegister(self.subscribers,'paragraphResized', function (paragraphId) {
      // paragraph col width changed
      if (paragraphId === self.paragraph.id) {
        let builtInViz = self.builtInVisualizations[self.graphMode]
        if (builtInViz && builtInViz.instance) {
          builtInViz.instance.resize()
        }
      }
    })

    self.eventService.subscribeRegister(self.subscribers,'appendParagraphOutput', function (data) {
      /* It has been observed that append events
       * can be errorneously called even if paragraph
       * execution has ended, and in that case, no append
       * should be made. Also, it was observed that between PENDING
       * and RUNNING states, append-events can be called and we can't
       * miss those, else during the length of paragraph run, few
       * initial output line/s will be missing.
       */
      if (self.paragraph.id === data.paragraphId &&
        self.resultIndex === data.index &&
        (self.paragraph.status === ParagraphStatus.PENDING || paragraph.status === ParagraphStatus.RUNNING)) {
        if (DefaultDisplayType.TEXT !== self.type) {
          self.type = DefaultDisplayType.TEXT
        }
        self.appendTextOutput(data.data)
      }
    })

  }

  ngOnDestroy(): void {
    this.eventService.unsubscribeSubscriptions(this.subscribers)
  }

  //***************** Utils ******************//

  //当DOM准备好的时候调用方法
  retryUntilElemIsLoaded (targetElemId, callback) {
    let self = this;
    function retry () {
      if (!self.isDOMLoaded(targetElemId)) {
        setTimeout(retry, 10)
        return
      }
      callback(targetElemId)
    }
    setTimeout(retry,10)
  }

  //检测DOM是否已经加载
  isDOMLoaded(targetElemId) {
    return this.commonService._jQuery(`#${targetElemId}`).length > 0
  }

  //获取展示结果ID
  createDisplayDOMId(baseDOMId, type) {
    if (type === DefaultDisplayType.TABLE || type === DefaultDisplayType.NETWORK) {
      return `${baseDOMId}_graph`
    } else if (type === DefaultDisplayType.HTML) {
      return `${baseDOMId}_html`
    } else if (type === DefaultDisplayType.ANGULAR) {
      return `${baseDOMId}_angular`
    } else if (type === DefaultDisplayType.TEXT) {
      return `${baseDOMId}_text`
    } else if (type === DefaultDisplayType.ELEMENT) {
      return `${baseDOMId}_elem`
    } else {
      console.error(`Cannot create display DOM Id due to unknown display type: ${type}`)
    }
  }

  //获取展示数据转换设置的Elem
  getTrSettingElem(scopeId, graphMode) {
    return this.getDomById('#trsetting' + scopeId + '_' + graphMode)
  }

  //获取展示数据可视化设置的Elem
  getVizSettingElem(scopeId, graphMode) {
    return this.getDomById('#vizsetting' + scopeId + '_' + graphMode)
  }

  getDomById(targetElemId){
    return this.elementRef.nativeElement.querySelector(`${targetElemId}`)
  }

  //获取图片Base64地址
  getBase64ImageSrc(base64Data) {
    return 'data:image/png;base64,' + base64Data
  }

}
