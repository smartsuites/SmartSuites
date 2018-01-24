/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

/* eslint-disable no-unused-vars */
import {
  DefaultDisplayType,
  SpellResult,
} from './spell-result'
/* eslint-enable no-unused-vars */

export class SpellBase {

  magic

  constructor (magic) {
    this.magic = magic
  }

  /**
   * Consumes text and return `SpellResult`.
   *
   * @param paragraphText {string} which doesn't include magic
   * @param config {Object}
   * @return {SpellResult}
   */
  interpret (paragraphText, config) {
    throw new Error('SpellBase.interpret() should be overrided')
  }

  /**
   * return magic for this spell.
   * (e.g `%flowchart`)
   * @return {string}
   */
  getMagic () {
    return this.magic
  }
}
