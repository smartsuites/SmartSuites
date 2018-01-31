import { Injectable } from '@angular/core';
import {CommonService} from "../common/common.service";

@Injectable()
export class SaveAsService {

  constructor(private commonService:CommonService) { }

  detectIE() {
    let ua = window.navigator.userAgent
    let msie = ua.indexOf('MSIE ')
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
    }
    let trident = ua.indexOf('Trident/')
    if (trident > 0) {
      // IE 11 => return version number
      let rv = ua.indexOf('rv:')
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
    }
    let edge = ua.indexOf('Edge/')
    if (edge > 0) {
      // IE 12 (aka Edge) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
    }
    // other browser
    return false
  }

  saveAs(content, filename, extension) {
    let BOM = '\uFEFF'
    if (this.detectIE()) {
      this.commonService._jQuery('body').append('<iframe id="SaveAsId" style="display: none"></iframe>')
      let frameSaveAs = this.commonService._jQuery('body > iframe#SaveAsId')[0].contentWindow
      content = BOM + content
      frameSaveAs.document.open('text/json', 'replace')
      frameSaveAs.document.write(content)
      frameSaveAs.document.close()
      frameSaveAs.focus()
      let t1 = Date.now()
      frameSaveAs.document.execCommand('SaveAs', false, filename + '.' + extension)
      let t2 = Date.now()

      // This means, this version of IE dosen't support auto download of a file with extension provided in param
      // falling back to ".txt"
      if (t1 === t2) {
        frameSaveAs.document.execCommand('SaveAs', true, filename + '.txt')
      }
      this.commonService._jQuery('body > iframe#SaveAsId').remove()
    } else {
      let binaryData = []
      binaryData.push(BOM)
      binaryData.push(content)
      content = window.URL.createObjectURL(new Blob(binaryData))

      this.commonService._jQuery('body').append('<a id="SaveAsId"></a>')
      let saveAsElement = this.commonService._jQuery('body > a#SaveAsId')
      saveAsElement.attr('href', content)
      saveAsElement.attr('download', filename + '.' + extension)
      saveAsElement.attr('target', '_blank')
      saveAsElement[0].click()
      saveAsElement.remove()
      window.URL.revokeObjectURL(content)
    }
  }

}
