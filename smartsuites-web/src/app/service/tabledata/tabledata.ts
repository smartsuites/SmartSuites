/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

import {Dataset, DatasetType} from './dataset'

/**
 * Create table data object from paragraph table type result
 */
export default class TableData extends Dataset {

  columns
  rows
  comment

  constructor (columns, rows, comment) {
    super()
    this.columns = columns || []
    this.rows = rows || []
    this.comment = comment || ''
  }

  loadParagraphResult (paragraphResult) {
    if (!paragraphResult || paragraphResult.type !== DatasetType.TABLE) {
      console.log('Can not load paragraph result')
      return
    }

    let columnNames = []
    let rows = []
    let array = []
    let textRows = paragraphResult.msg.split('\n')
    let comment = ''
    let commentRow = false

    for (let i = 0; i < textRows.length; i++) {
      let textRow = textRows[i]

      if (commentRow) {
        comment += textRow
        continue
      }

      if (textRow === '' || textRow === '<!--TABLE_COMMENT-->') {
        if (rows.length > 0) {
          commentRow = true
        }
        continue
      }
      let textCols = textRow.split('\t')
      let cols = []
      let cols2 = []
      for (let j = 0; j < textCols.length; j++) {
        let col = textCols[j]
        if (i === 0) {
          columnNames.push({name: col, index: j, aggr: 'sum'})
        } else {
          cols.push(col)
          cols2.push({key: (columnNames[i]) ? columnNames[i].name : undefined, value: col})
        }
      }
      if (i !== 0) {
        rows.push(cols)
        array.push(cols2)
      }
    }
    this.comment = comment
    this.columns = columnNames
    this.rows = rows
  }
}
