/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

/**
 * Base class for visualization.
 */
export default class Visualization {

  //目标Element
  targetElId

  //整体配置
  config

  //Angularjs5 渲染引擎
  _renderer

  //提交变更方法
  _emitter

  //动态网页编译服务
  _jitCompiler

  //通用服务【JQuery、Echarts、D3、NVD3】
  _commonService

  d3
  nv
  jQuery
  echarts


  _dirty
  _active

  //保存的配置
  _scope
  _prevSettingScope

  _createNewScope
  _templateRequest

  constructor (targetElId, config, renderer, emitter, jitCompiler, commonService) {
    this.targetElId = targetElId
    this.config = config
    this._emitter = emitter
    this._renderer = renderer
    this._jitCompiler = jitCompiler
    this._commonService = commonService
    this._dirty = false
    this._active = false
    this.d3 = commonService._d3
    this.nv = commonService._nv
    this.jQuery = commonService._jQuery
    this.echarts = commonService._echarts
  }

  /**
   * Get transformation.
   * @abstract
   * @return {Transformation}
   */
  getTransformation () {
    // override this
    throw new TypeError('Visualization.getTransformation() should be overrided')
  }

  /**
   * Method will be invoked when data or configuration changed.
   * @abstract
   */
  render (tableData) {
    // override this
    throw new TypeError('Visualization.render() should be overrided')
  }

  /**
   * Refresh visualization.
   */
  refresh () {
    // override this
  }

  /**
   * Method will be invoked when visualization need to be destroyed.
   * Don't need to destroy this.targetEl.
   */
  destroy () {
    // override this
  }

  /**
   * return {
   *   template : angular template string or url (url should end with .html),
   *   scope : an object to bind to template scope
   * }
   */
  getSetting ():any {
    // override this
    return {
        template : '',
        scope : {
          config: {}
        }
    }
  }

  /**
   * Activate. Invoked when visualization is selected.
   */
  activate () {
    if (!this._active || this._dirty) {
      this.refresh()
      this._dirty = false
    }
    this._active = true
  }

  /**
   * Deactivate. Invoked when visualization is de selected.
   */
  deactivate () {
    this._active = false
  }

  /**
   * Is active.
   */
  isActive () {
    return this._active
  }

  /**
   * When window or paragraph is resized.
   */
  resize () {
    if (this.isActive()) {
      this.refresh()
    } else {
      this._dirty = true
    }
  }

  /**
   * Set new config.
   */
  setConfig (config) {
    this.config = config
    if (this.isActive()) {
      this.refresh()
    } else {
      this._dirty = true
    }
  }

  /**
   * Emit config. config will sent to server and saved.
   */
  emitConfig (config) {
    //this._emitter(config)
  }

  /**
   * Render setting.
   */
  renderSetting (targetEl) {
    let self = this
    let setting = this.getSetting()
    if (!setting) {
      return
    }

    // already readered
    if (this._scope) {
      let self = this

      for (let k in setting.scope) {
        self._scope[k] = setting.scope[k]
      }

      for (let k in self._prevSettingScope) {
        if (!setting.scope[k]) {
          self._scope[k] = setting.scope[k]
        }
      }
      return
    } else {
      this._prevSettingScope = setting.scope
    }

    self._jitCompiler.renderFromTemplate(setting.template,targetEl,setting.scope)

    /*let scope = this._createNewScope()
    for (let k in setting.scope) {
      scope[k] = setting.scope[k]
    }
    let template = setting.template

    if (template.split('\n').length === 1 &&
        template.endsWith('.html')) { // template is url
      this._templateRequest(template).then(t =>
      _renderSetting(this, targetEl, t, scope)
      )
    } else {
      _renderSetting(this, targetEl, template, scope)
    }*/
  }
}

/*function _renderSetting (instance, targetEl, template, scope) {
  instance._targetEl = targetEl
  targetEl.html(template)
  instance._compile(targetEl.contents())(scope)
  instance._scope = scope
}*/
