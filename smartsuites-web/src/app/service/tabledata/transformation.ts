/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

import {ViewContainerRef} from "@angular/core";

/**
 * Base class for visualization
 */
export default class Transformation {

  config
  _emitter
  _jitCompiler


  _scope
  _targetEl

  _compile
  _prevSettingScope


  _httpClient

  constructor (config, emitter, jitCompiler) {
    this.config = config
    this._emitter = emitter
    this._jitCompiler = jitCompiler
  }

  /**
   * return {
   *   template : angular template string or url (url should end with .html),
   *   scope : an object to bind to template scope
   * }
   */
  getSetting () {
    // override this
    return {
      template:'',
      scope:{}
    }
  }

  /**
   * Method will be invoked when tableData or config changes
   */
  transform (tableData) {
    // override this
  }

  /**
   * render setting
   */
  renderSetting (targetEl) {
    let self = this
    let setting = this.getSetting()
    if (!setting) {
      return
    }

    // already readered
    if (this._scope) {
      /*this._scope.$apply(function () {

      })*/

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
      let self = this
      this._templateRequest(template).then(function (t) {
        self._render(targetEl, t, scope)
      })
    } else {
      this._render(targetEl, template, scope)
    }*/
  }

  /*_render (targetEl, template, scope) {
    this._targetEl = targetEl
    targetEl.html(template)
    this._compile(targetEl.contents())(scope)
    this._scope = scope
  }*/

  setConfig (config) {
    this.config = config
  }

  /**
   * Emit config. config will sent to server and saved.
   */
  emitConfig (config) {
    this._emitter(config)
  }
}
