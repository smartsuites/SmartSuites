/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

import Transformation from './transformation'
import {ObjectEqual} from "../../utils/Utils";

/**
 * trasformation settings for network visualization
 */
export default class NetworkTransformation extends Transformation {

  constructor (config, emitter, jitCompiler) {
    super(config, emitter, jitCompiler)
  }

  getSetting() {
    let self = this
    let configObj = self.config
    return {
      template: 'app/tabledata/network_settings.html',
      scope: {
        config: configObj,
        isEmptyObject: function(obj) {
          obj = obj || {}
          return ObjectEqual(obj, {})
        },
        setNetworkLabel: function(label, value) {
          configObj.properties[label].selected = value
        },
        saveConfig: function() {
          self.emitConfig(configObj)
        }
      }
    }
  }

  setConfig(config) {
  }

  transform(networkData) {
    return networkData
  }
}
