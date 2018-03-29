/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

/**
 * 可视化基类
 */
export default class Visualization {

  //目标Element
  targetElId

  //整体配置
  config

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

  // 初始化方法
  constructor (targetElId, config, emitter, jitCompiler, commonService) {
    this.targetElId = targetElId
    this.config = config
    this._emitter = emitter
    this._jitCompiler = jitCompiler
    this._commonService = commonService
    this._dirty = false
    this._active = false
    this.d3 = commonService._d3
    this.nv = commonService._nv
    this.jQuery = commonService._jQuery
    this.echarts = commonService._echarts
  }

  // 获取对应的数据转换器
  getTransformation () {
    // override this
    throw new TypeError('Visualization.getTransformation() should be overrided')
  }

  // 渲染数据
  render (tableData) {
    // override this
    throw new TypeError('Visualization.render() should be overrided')
  }

  // 刷新可视化
  refresh () {
    // override this
  }

  // 移除可视化，Don't need to destroy this.targetEl.
  destroy () {
    // override this
  }

  /**
   * 返回配置片段信息
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

  // 当图表被选择的时候会调用
  activate () {
    if (!this._active || this._dirty) {
      this.refresh()
      this._dirty = false
    }
    this._active = true
  }

  // 钝化图表
  deactivate () {
    this._active = false
  }

  // 当前可视化是否激活
  isActive () {
    return this._active
  }

  // 当窗口或者片段被重新缩放时调用
  resize () {
    if (this.isActive()) {
      this.refresh()
    } else {
      this._dirty = true
    }
  }

  // 设置图表配置
  setConfig (config) {
    this.config = config
    if (this.isActive()) {
      this.refresh()
    } else {
      this._dirty = true
    }
  }

  // 提交图表配置保存
  emitConfig (config) {
    //this._emitter(config)
  }

  // 渲染图表配置界面
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
