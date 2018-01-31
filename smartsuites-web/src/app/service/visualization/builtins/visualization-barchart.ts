/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Nvd3ChartVisualization from './visualization-nvd3chart'
import PivotTransformation from '../../tabledata/pivot'

/**
 * Visualize data in bar char
 */
export default class BarchartVisualization extends Nvd3ChartVisualization {

  pivot

  constructor (targetEl, config, renderer, emitter, jitCompiler, commonService) {
    super(targetEl, config, renderer, emitter, jitCompiler, commonService)

    this.pivot = new PivotTransformation(config,emitter, jitCompiler)

    try {
      this.config.rotate = {degree: config.rotate.degree}
    } catch (e) {
      this.config.rotate = {degree: '-45'}
    }
  }

  type () {
    return 'multiBarChart'
  }

  getTransformation () {
    return this.pivot
  }

  render (pivot) {

    let d3Data = this.d3DataFromPivot(
      pivot.schema,
      pivot.rows,
      pivot.keys,
      pivot.groups,
      pivot.values,
      true,
      true,
      true)

    super.render(d3Data)
    this.config.changeXLabel(this.config.xLabelStatus)
  }

  /**
   * Set new config
   */
  setConfig (config) {
    super.setConfig(config)
    this.pivot.setConfig(config)
  }

  configureChart (chart) {
    let self = this
    let configObj = self.config

    chart.yAxis.axisLabelDistance(50)
    chart.yAxis.tickFormat(function (d) { return self.yAxisTickFormat(d) })

    self.chart.stacked(this.config.stacked)

    self.config.changeXLabel = function(type) {
      switch (type) {
        case 'default':
          self.chart._options['showXAxis'] = true
          self.chart._options['margin'] = {bottom: 50}
          self.chart.xAxis.rotateLabels(0)
          configObj.xLabelStatus = 'default'
          break
        case 'rotate':
          self.chart._options['showXAxis'] = true
          self.chart._options['margin'] = {bottom: 140}
          self.chart.xAxis.rotateLabels(configObj.rotate.degree)
          configObj.xLabelStatus = 'rotate'
          break
        case 'hide':
          self.chart._options['showXAxis'] = false
          self.chart._options['margin'] = {bottom: 50}
          self.d3.select('#' + self.targetElId + '> svg').select('g.nv-axis.nv-x').selectAll('*').remove()
          configObj.xLabelStatus = 'hide'
          break
      }
      //self.emitConfig(configObj)
    }

    self.config.isXLabelStatus = function(type) {
      if (configObj.xLabelStatus === type) {
        return true
      } else {
        return false
      }
    }

    self.config.setDegree = function(type) {
      configObj.rotate.degree = type
      self.chart.xAxis.rotateLabels(type)
      //self.emitConfig(configObj)
    }

    this.chart.dispatch.on('stateChange', function(s) {
      configObj.stacked = s.stacked

      // give some time to animation finish
      setTimeout(function() {
        //self.emitConfig(configObj)
      }, 500)
    })
  }

  getSetting():any {
    let self = this
    let configObj = self.config

    // default to visualize xLabel
    if (typeof (configObj.xLabelStatus) === 'undefined') {
      configObj.changeXLabel('default')
    }

    if (typeof (configObj.rotate.degree) === 'undefined' || configObj.rotate.degree === '') {
      configObj.rotate.degree = '-45'
      self.emitConfig(configObj)
    }

    return {
      template: 'app/service/visualization/builtins/visualization-displayXAxis.html',
      scope: {
        config: configObj
      }
    }
  }
}