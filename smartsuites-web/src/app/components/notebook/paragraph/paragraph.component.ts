import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {WebsocketMessageService} from "../../../service/websocket/websocket-message.service";
import {NoteVarShareService} from "../../../service/note-var-share/note-var-share.service";
import {EventService1} from "../../../service/event/event.service";
import {isParagraphRunning, ParagraphStatus} from "./paragraph.status";
import {NotebookComponent} from "../notebook.component";
import {ConfirmationService, MenuItem} from "primeng/primeng";
import * as moment from "moment";
import {GlobalService} from "../../../service/global/global.service";
import {CommonService} from "../../../service/common/common.service";
import {MessageService} from "primeng/components/common/messageservice";
import {SpellResult} from "../../../service/spell";
import {HeliumService} from "../../../service/helium/helium.service";
import * as tsd from "typescript-deferred";

const ParagraphExecutor = {
  SPELL: 'SPELL',
  INTERPRETER: 'INTERPRETER',
  NONE: '', /** meaning `DONE` */
}

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  inputs: ['paragraphid'],
  styleUrls: ['./paragraph.component.css']
})
export class ParagraphComponent implements OnInit,AfterViewInit {

  ANGULAR_FUNCTION_OBJECT_NAME_PREFIX = '_Z_ANGULAR_FUNC_'

  ace
  jQuery

  //当前的片段ID
  paragraphid
  //当前的片段
  paragraph
  //片段所属的Note
  parentNote

  /**************** 更新Note名称 ***************/
  //是否显示名称编辑器
  titleEditor = false

  editParagraphTitle() {
    this.titleEditor = true
  }

  showParagraphTitle() {
    this.titleEditor = false
  }

  setTitle(paragraph) {
    this.commitParagraph(paragraph)
  }

  /**************** 片段的配置 ***************/

  //初始的文本
  chart ={}
  baseMapOption = ['Streets', 'Satellite', 'Hybrid', 'Topo', 'Gray', 'Oceans', 'Terrain']
  colWidthOption = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  fontSizeOption = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

  //片段配置的List
  items: MenuItem[];

  asIframe = false

  //是否全屏显示
  display = false;

  revisionView


  /**************  editor ********/
  //获取编辑器
  //@ViewChild('editor') editor;
  editor;

  dirtyText
  originalText

  editorSetting
  // flag that is used to set editor setting on paste percent sign
  pastePercentSign = false
  // flag that is used to set editor setting on save interpreter bindings
  setInterpreterBindings = false

  //当前片段是否聚焦
  paragraphFocused = false


  options:any = {maxLines: 1000, printMargin: false};
  onChange(code) {
    console.log("new code", code);
  }

  /*****  *****/

  // transactional info for spell execution
  spellTransaction = {
    totalResultCount: 0,
    renderedResultCount: 0,
    propagated: false,
    resultsMsg: [],
    paragraphText: '',
  }

  searchRanges = []
  getCurrentRangeDefault() {
    return {id: -1, markerId: -1}
  }

  currentRange = this.getCurrentRangeDefault()


  // z.runParagraph('20150213-231621_168813393')
  zrunParagraph(paragraphId) {
    let self = this;
    if (paragraphId) {
      let filtered = self.parentNote.paragraphs.filter(function (x) {
        return x.id === paragraphId
      })
      if (filtered.length === 1) {
        let paragraph = filtered[0]
        self.websocketMsgSrv.runParagraph(paragraph.id, paragraph.title, paragraph.text,
          paragraph.config, paragraph.settings.params)
      } else {
        self.messageService.add({severity:'error', summary:'', detail:'Cannot find a paragraph with id \'' + paragraphId + '\''});
      }
    } else {
      self.messageService.add({severity:'error', summary:'', detail:'Please provide a \'paragraphId\' when calling runParagraph(paragraphId)'});
    }
  }

  // Example: z.angularBind('my_var', 'Test Value', '20150213-231621_168813393')
  angularBind(varName, value, paragraphId) {
    // Only push to server if there paragraphId is defined
    let self = this;
    if (paragraphId) {
      self.websocketMsgSrv.clientBindAngularObject(self.parentNote.id, varName, value, paragraphId)
    } else {
      self.messageService.add({severity:'error', summary:'', detail:'Please provide a \'paragraphId\' when calling ' +
        'angularBind(varName, value, \'PUT_HERE_PARAGRAPH_ID\')'});
    }
  }

  // Example: z.angularUnBind('my_var', '20150213-231621_168813393')
  angularUnbind(varName, paragraphId) {
    // Only push to server if paragraphId is defined
    let self = this;
    if (paragraphId) {
      self.websocketMsgSrv.clientUnbindAngularObject(self.parentNote.id, varName, paragraphId)
    } else {
      self.messageService.add({severity:'error', summary:'', detail:'Please provide a \'paragraphId\' when calling ' +
        'angularUnbind(varName, \'PUT_HERE_PARAGRAPH_ID\')'});
    }
  }

  angularObjectRegistry = {}

  //初始化片段
  init(newParagraph, note) {
    this.paragraph = newParagraph
    this.parentNote = note
    //this.originalText = Object.assign('', newParagraph.text)
    this.originalText = newParagraph.text? newParagraph.text:''

    this.chart = {}
    this.baseMapOption = ['Streets', 'Satellite', 'Hybrid', 'Topo', 'Gray', 'Oceans', 'Terrain']
    this.colWidthOption = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    this.fontSizeOption = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

    this.paragraphFocused = false
    if (newParagraph.focus) {
      this.paragraphFocused = true
    }

    if (!this.paragraph.config) {
      this.paragraph.config = {}
    }

    if(!this.paragraph.results){
      this.paragraph.results = {
        msg : []
      }
    }


    //this.noteVarShareService.put(this.paragraph.id + '_paragraphScope', paragraphScope)

    this.initializeDefault(this.paragraph.config)
  }

  initializeDefault(config) {
    let forms = this.paragraph.settings.forms

    if (!config.colWidth) {
      //config.colWidth = 12
    }

    if (!config.fontSize) {
      config.fontSize = 9
    }

    if (config.enabled === undefined) {
      config.enabled = true
    }

    for (let idx of forms) {
      if (forms[idx]) {
        if (forms[idx].options) {
          if (config.runOnSelectionChange === undefined) {
            config.runOnSelectionChange = true
          }
        }
      }
    }

    if (!config.results) {
      config.results = {
        msg : []
      }
    }

    if (!config.editorSetting) {
      config.editorSetting = {}
    } else if (config.editorSetting.editOnDblClick) {
      //this.editorSetting.isOutputHidden = config.editorSetting.editOnDblClick
    }
  }

  isTabCompletion() {
    const completionKey = this.paragraph.config.editorSetting.completionKey
    return completionKey === 'TAB'
  }

  getIframeDimensions() {
    if (this.asIframe) {
      let paragraphid = '#' + this.paragraphid + '_container'
      let height = this.elementRef.nativeElement.querySelector(paragraphid).height
      return height
    }
    return 0
  }

  /*$scope.$watch($scope.getIframeDimensions, function (newValue, oldValue) {
      if ($scope.asIframe && newValue) {
      let message = {}
      message.height = newValue
      message.url = $location.$$absUrl
      $window.parent.postMessage(angular.toJson(message), '*')
    }
  })*/

  getEditor = function () {
    return this.editor
  }

  /*$scope.$watch($scope.getEditor, function (newValue, oldValue) {
    if (!$scope.editor) {
      return
    }
    if (newValue === null || newValue === undefined) {
      console.log('editor isnt loaded yet, returning')
      return
    }
    if ($scope.revisionView === true) {
      $scope.editor.setReadOnly(true)
    } else {
      $scope.editor.setReadOnly(false)
    }
  })*/

  isEmpty(object) {
    return !object
  }

  isRunning(paragraph) {
    return isParagraphRunning(paragraph)
  }

  cancelParagraph(paragraph) {
    console.log('Cancel %o', paragraph.id)
    this.websocketMsgSrv.cancelParagraphRun(paragraph.id)
  }

  propagateSpellResult(paragraphId, paragraphTitle,
                                          paragraphText, paragraphResults,
                                          paragraphStatus, paragraphErrorMessage,
                                          paragraphConfig, paragraphSettingsParam,
                                          paragraphDateStarted, paragraphDateFinished) {
    this.websocketMsgSrv.paragraphExecutedBySpell(
      paragraphId, paragraphTitle,
      paragraphText, paragraphResults,
      paragraphStatus, paragraphErrorMessage,
      paragraphConfig, paragraphSettingsParam,
      paragraphDateStarted, paragraphDateFinished
    )
  }

  handleSpellError(paragraphText, error,digestRequired, propagated) {
    const errorMessage = error.stack
    this.paragraph.status = ParagraphStatus.ERROR
    this.paragraph.errorMessage = errorMessage
    console.error('Failed to execute interpret() in spell\n', error)

    if (!propagated) {
      this.paragraph.dateFinished = this.getFormattedParagraphTime()
    }

    if (!propagated) {
      this.propagateSpellResult(
        this.paragraph.id, this.paragraph.title,
        paragraphText, [], this.paragraph.status, errorMessage,
        this.paragraph.config, this.paragraph.settings.params,
        this.paragraph.dateStarted, this.paragraph.dateFinished)
    }
  }

  prepareSpellTransaction(resultsMsg, propagated, paragraphText) {
    this.spellTransaction.totalResultCount = resultsMsg.length
    this.spellTransaction.renderedResultCount = 0
    this.spellTransaction.propagated = propagated
    this.spellTransaction.resultsMsg = resultsMsg
    this.spellTransaction.paragraphText = paragraphText
  }

  /**
   * - update spell transaction count and
   * - check transaction is finished based on the result count
   * @returns {boolean}
   */
  increaseSpellTransactionResultCount() {
    this.spellTransaction.renderedResultCount += 1

    const total = this.spellTransaction.totalResultCount
    const current = this.spellTransaction.renderedResultCount
    return total === current
  }

  cleanupSpellTransaction() {
    let self = this;
    const status = ParagraphStatus.FINISHED
    self.paragraph.executor = ParagraphExecutor.NONE
    self.paragraph.status = status
    self.paragraph.results.code = status

    const propagated = self.spellTransaction.propagated
    const resultsMsg = self.spellTransaction.resultsMsg
    const paragraphText = self.spellTransaction.paragraphText

    if (!propagated) {
      self.paragraph.dateFinished = self.getFormattedParagraphTime()
    }

    if (!propagated) {
      const propagable = SpellResult.createPropagable(resultsMsg)
      self.propagateSpellResult(
        self.paragraph.id, self.paragraph.title,
        paragraphText, propagable, status, '',
        self.paragraph.config, self.paragraph.settings.params,
        self.paragraph.dateStarted, self.paragraph.dateFinished)
    }
  }

  runParagraphUsingSpell(paragraphText,magic, digestRequired, propagated) {
    let self = this;
    this.paragraph.status = 'RUNNING'
    this.paragraph.executor = ParagraphExecutor.SPELL
    this.paragraph.results = {}
    this.paragraph.errorMessage = ''
    /*if (digestRequired) {
      $scope.$digest()
    }*/

    try {
      // remove magic from paragraphText
      const splited = paragraphText.split(magic)
      // remove leading spaces
      const textWithoutMagic = splited[1].replace(/^\s+/g, '')

      if (!propagated) {
        this.paragraph.dateStarted = this.getFormattedParagraphTime()
      }

      // handle actual result message in promise
      /*this.heliumService.executeSpell(magic, textWithoutMagic)
        .then(resultsMsg => {
          self.prepareSpellTransaction(resultsMsg, propagated, paragraphText)

          self.paragraph.results.msg = resultsMsg
          self.paragraph.config.tableHide = false
        })
        .catch(error => {
          self.handleSpellError(paragraphText, error,
            digestRequired, propagated)
        })*/
    } catch (error) {
      self.handleSpellError(paragraphText, error,
        digestRequired, propagated)
    }
  }

  runParagraphUsingBackendInterpreter(paragraphText) {
    this.websocketMsgSrv.runParagraph(this.paragraph.id, this.paragraph.title,
      paragraphText, this.paragraph.config, this.paragraph.settings.params)
  }

  bindBeforeUnload() {
    this.commonService._jQuery(window).off('beforeunload')
    //angular.element(window).off('beforeunload')

    let confirmOnPageExit = function (e) {
      // If we haven't been passed the event get the window.event
      e = e || window.event
      let message = 'Do you want to reload this site?'

      // For IE6-8 and Firefox prior to version 4
      if (e) {
        e.returnValue = message
      }
      // For Chrome, Safari, IE8+ and Opera 12+
      return message
    }
    //angular.element(window).on('beforeunload', confirmOnPageExit)
    this.commonService._jQuery(window).on('beforeunload', confirmOnPageExit)
  }

  unBindBeforeUnload = function () {
    this.commonService._jQuery(window).off('beforeunload')
  }

  saveParagraph = function (paragraph) {
    let self = this;
    const dirtyText = paragraph.text
    if (dirtyText === undefined || dirtyText === this.originalText) {
      return
    }

    self.bindBeforeUnload()

    self.commitParagraph(paragraph).then(function () {
      self.originalText = dirtyText
      self.dirtyText = undefined
      self.unBindBeforeUnload()
    })
  }

  toggleEnableDisable(paragraph) {
    paragraph.config.enabled = !paragraph.config.enabled
    this.commitParagraph(paragraph)
  }

  /**
   * @param paragraphText to be parsed
   * @param digestRequired true if calling `$digest` is required
   * @param propagated true if update request is sent from other client
   */
  runParagraph(paragraphText, digestRequired, propagated) {
    let self = this;
    if (!paragraphText || self.isRunning(self.paragraph)) {
      return
    }
    const magic = SpellResult.extractMagic(paragraphText)

    /*if (self.heliumService.getSpellByMagic(magic)) {
      self.runParagraphUsingSpell(paragraphText, magic, digestRequired, propagated)
    } else {
      self.runParagraphUsingBackendInterpreter(paragraphText)
    }*/

    self.runParagraphUsingBackendInterpreter(paragraphText)

    self.originalText = Object.assign("",paragraphText)
    self.dirtyText = undefined

    if (self.paragraph.config.editorSetting.editOnDblClick) {
      self.closeEditorAndOpenTable(self.paragraph)
    } else if (self.editorSetting.isOutputHidden &&
      !self.paragraph.config.editorSetting.editOnDblClick) {
      // %md/%angular repl make output to be hidden by default after running
      // so should open output if repl changed from %md/%angular to another
      self.openEditorAndOpenTable(self.paragraph)
    }
    self.editorSetting.isOutputHidden = self.paragraph.config.editorSetting.editOnDblClick
  }

  runParagraphFromShortcut(paragraphText) {
    // passing `digestRequired` as true to update view immediately
    // without this, results cannot be rendered in view more than once
    this.runParagraph(paragraphText, true, false)
  }

  runParagraphFromButton(paragraphText) {
    // we come here from the view, so we don't need to call `$digest()`
    this.runParagraph(paragraphText, false, false)
  }

  turnOnAutoRun(paragraph) {
    paragraph.config.runOnSelectionChange = !paragraph.config.runOnSelectionChange
    this.commitParagraph(paragraph)
  }

  moveUp(paragraph) {
    //$scope.$emit('moveParagraphUp', paragraph)
    this.eventService.broadcast('moveParagraphUp', paragraph)
  }

  moveDown(paragraph) {
    this.eventService.broadcast('moveParagraphDown', paragraph)
  }

  insertNew (position) {
    //$scope.$emit('insertParagraph', $scope.paragraph.id, position)
    this.eventService.broadcast('insertParagraph', this.paragraph.id, position)
  }

  copyPara(position) {
    let editorValue = this.getEditorValue()
    if (editorValue) {
      this.copyParagraph(editorValue, position)
    }
  }

  copyParagraph(data, position) {
    let self = this;
    let newIndex = -1
    for (let i = 0; i < self.parentNote.paragraphs.length; i++) {
      if (self.parentNote.paragraphs[i].id === self.paragraph.id) {
        // determine position of where to add new paragraph; default is below
        if (position === 'above') {
          newIndex = i
        } else {
          newIndex = i + 1
        }
        break
      }
    }

    if (newIndex < 0 || newIndex > self.parentNote.paragraphs.length) {
      return
    }

    let config = Object.assign({},self.paragraph.config)
    //config.editorHide = false

    self.websocketMsgSrv.copyParagraph(newIndex, self.paragraph.title, data,
      config, self.paragraph.settings.params)
  }

  removeParagraph(paragraph) {
    let self = this;
    if (self.parentNote.paragraphs.length === 1) {
      self.messageService.add({severity:'warn', summary:'Success', detail:'All the paragraphs can\'t be deleted.'});
    } else {

      this.confirmationService.confirm({
        message: 'Do you want to delete this paragraph?',
        header: 'Confirmation',
        icon: 'fa fa-question-circle',
        accept: () => {
          console.log('Remove paragraph')
          self.websocketMsgSrv.removeParagraph(paragraph.id)
          //$scope.$emit('moveFocusToNextParagraph', $scope.paragraph.id)
          self.eventService.broadcast('moveFocusToNextParagraph', self.paragraph.id)
        },
        reject: () => {}
      });
    }
  }

  clearParagraphOutput(paragraph) {
    this.websocketMsgSrv.clearParagraphOutput(paragraph.id)
  }

  toggleEditor(paragraph) {
    if (paragraph.config.editorHide) {
      this.openEditor(paragraph)
    } else {
      this.closeEditor(paragraph)
    }
  }

  closeEditor(paragraph) {
    console.log('close the note')
    paragraph.config.editorHide = true
    this.commitParagraph(paragraph)
  }

  openEditor(paragraph) {
    console.log('open the note')
    paragraph.config.editorHide = false
    this.commitParagraph(paragraph)
  }

  closeTable(paragraph) {
    console.log('close the output')
    paragraph.config.tableHide = true
    this.commitParagraph(paragraph)
  }

  openTable(paragraph) {
    console.log('open the output')
    paragraph.config.tableHide = false
    this.commitParagraph(paragraph)
  }

  openEditorAndCloseTable(paragraph) {
    this.manageEditorAndTableState(paragraph, false, true)
  }

  closeEditorAndOpenTable(paragraph) {
    this.manageEditorAndTableState(paragraph, true, false)
  }

  openEditorAndOpenTable(paragraph) {
    this.manageEditorAndTableState(paragraph, false, false)
  }

  manageEditorAndTableState(paragraph, hideEditor, hideTable) {
    paragraph.config.editorHide = hideEditor
    paragraph.config.tableHide = hideTable
    this.commitParagraph(paragraph)
  }

  showTitle(paragraph) {
    paragraph.config.title = true
    this.commitParagraph(paragraph)
  }

  hideTitle(paragraph) {
    paragraph.config.title = false
    this.commitParagraph(paragraph)
  }

  showLineNumbers(paragraph) {
    if (this.editor) {
      paragraph.config.lineNumbers = true
      this.editor.renderer.setShowGutter(true)
      this.commitParagraph(paragraph)
    }
  }

  hideLineNumbers(paragraph) {
    if (this.editor) {
      paragraph.config.lineNumbers = false
      this.editor.renderer.setShowGutter(false)
      this.commitParagraph(paragraph)
    }
  }

  columnWidthClass(n) {
    if (this.asIframe) {
      return 'col-md-12'
    } else {
      return 'paragraph-col col-md-' + n
    }
  }

  changeColWidth(paragraph, width) {
    this.commonService._jQuery('.navbar-right.open').removeClass('open')
    paragraph.config.colWidth = width
    this.commitParagraph(paragraph)
  }

  changeFontSize = function (paragraph, fontSize) {
    this.commonService._jQuery('.navbar-right.open').removeClass('open')
    if (this.editor) {
      this.editor.setOptions({
        fontSize: fontSize + 'pt'
      })
      this.autoAdjustEditorHeight(this.editor)
      paragraph.config.fontSize = fontSize
      this.commitParagraph(paragraph)
    }
  }

  toggleOutput = function (paragraph) {
    paragraph.config.tableHide = !paragraph.config.tableHide
    this.commitParagraph(paragraph)
  }

  loadForm = function (formulaire, params) {
    let value = formulaire.defaultValue
    if (params[formulaire.name]) {
      value = params[formulaire.name]
    }

    this.paragraph.settings.params[formulaire.name] = value
  }

  toggleCheckbox = function (formulaire, option) {
    let idx = this.paragraph.settings.params[formulaire.name].indexOf(option.value)
    if (idx > -1) {
      this.paragraph.settings.params[formulaire.name].splice(idx, 1)
    } else {
      this.paragraph.settings.params[formulaire.name].push(option.value)
    }
  }








  /*$rootScope.$on('scrollToCursor', function (event) {
    // scroll on 'scrollToCursor' event only when cursor is in the last paragraph
    let self = this;
    let paragraphs = self.jQuery('div[id$="_paragraphColumn_main"]')
    if (paragraphs[paragraphs.length - 1].id.indexOf(self.paragraph.id) === 0) {
      self.scrollToCursor(self.paragraph.id, 0)
    }
  })*/

  /** scrollToCursor if it is necessary
   * when cursor touches scrollTriggerEdgeMargin from the top (or bottom) of the screen, it autoscroll to place cursor around 1/3 of screen height from the top (or bottom)
   * paragraphId : paragraph that has active cursor
   * lastCursorMove : 1(down), 0, -1(up) last cursor move event
   **/
  scrollToCursor(paragraphId, lastCursorMove) {
    let self = this;
    if (!self.editor || !self.editor.isFocused()) {
      // only make sense when editor is focused
      return
    }
    let lineHeight = self.editor.renderer.lineHeight
    let headerHeight = 103 // menubar, notebook titlebar
    let scrollTriggerEdgeMargin = 50

    let documentHeight = self.jQuery(document).height()
    let windowHeight = self.jQuery(window).height()  // actual viewport height

    let scrollPosition = self.jQuery(document).scrollTop()
    let editorPosition = self.jQuery('#' + paragraphId + '_editor').offset()
    let position = self.editor.getCursorPosition()
    let lastCursorPosition = self.editor.renderer.$cursorLayer.getPixelPosition(position, true)

    let calculatedCursorPosition = editorPosition.top + lastCursorPosition.top + lineHeight * lastCursorMove

    let scrollTargetPos
    if (calculatedCursorPosition < scrollPosition + headerHeight + scrollTriggerEdgeMargin) {
      scrollTargetPos = calculatedCursorPosition - headerHeight - ((windowHeight - headerHeight) / 3)
      if (scrollTargetPos < 0) {
        scrollTargetPos = 0
      }
    } else if (calculatedCursorPosition > scrollPosition + scrollTriggerEdgeMargin + windowHeight - headerHeight) {
      scrollTargetPos = calculatedCursorPosition - headerHeight - ((windowHeight - headerHeight) * 2 / 3)

      if (scrollTargetPos > documentHeight) {
        scrollTargetPos = documentHeight
      }
    }

    // cancel previous scroll animation
    let bodyEl = self.jQuery('body')
    bodyEl.stop()
    bodyEl.finish()

    // scroll to scrollTargetPos
    bodyEl.scrollTo(scrollTargetPos, {axis: 'y', interrupt: true, duration: 100})
  }

  getEditorValue() {
    return !this.editor ? this.paragraph.text : this.editor.getValue()
  }

  getProgress = function () {
    return this.currentProgress || 0
  }

  getFormattedParagraphTime = () => {
    return moment().toISOString()
  }

  getExecutionTime(pdata) {
    const end = pdata.dateFinished
    const start = pdata.dateStarted
    let timeMs = Date.parse(end) - Date.parse(start)
    if (isNaN(timeMs) || timeMs < 0) {
      if (this.isResultOutdated(pdata)) {
        return 'outdated'
      }
      return ''
    }

    //const durationFormat = moment.utc(timeMs / 1000).duration((timeMs / 1000), 'seconds').format('h [hrs] m [min] s [sec]')
    const durationFormat = moment.utc(timeMs).format('HH:mm:ss')
    const endFormat = moment(pdata.dateFinished).format('MMMM DD YYYY, h:mm:ss A')

    let user = (pdata.user === undefined || pdata.user === null) ? 'anonymous' : pdata.user
    let desc = `Took ${durationFormat}. Last updated by ${user} at ${endFormat}.`

    if (this.isResultOutdated(pdata)) { desc += ' (outdated)' }

    return desc
  }

  getElapsedTime(paragraph) {
    return 'Started ' + moment(paragraph.dateStarted).fromNow() + '.'
  }

  isResultOutdated(pdata) {
    if (pdata.dateUpdated !== undefined && Date.parse(pdata.dateUpdated) > Date.parse(pdata.dateStarted)) {
      return true
    }
    return false
  }



  parseTableCell(cell) {
    if (!isNaN(cell)) {
      if (cell.length === 0 || Number(cell) > Number.MAX_SAFE_INTEGER || Number(cell) < Number.MIN_SAFE_INTEGER) {
        return cell
      } else {
        return Number(cell)
      }
    }
    let d = moment(cell)
    if (d.isValid()) {
      return d
    }
    return cell
  }

  commitParagraph(paragraph) {
    const {
      id,
      title,
      text,
      config,
      settings: {params},
    } = paragraph

    return this.websocketMsgSrv.commitParagraph(id, title, text, config, params,
      this.parentNote.id)
  }

  /** Utility function */
  goToSingleParagraph = function () {
    let noteId = this.parentNote.id
    let redirectToUrl = location.protocol + '//' + location.host + location.pathname + '#/notebook/' + noteId +
      '/paragraph/' + this.paragraph.id + '?asIframe'
    //$window.open(redirectToUrl)
  }

  showScrollDownIcon(id) {
    let doc = this.jQuery('#p' + id + '_text')
    if (doc[0]) {
      return doc[0].scrollHeight > doc.innerHeight()
    }
    return false
  }

  scrollParagraphDown(id) {
    let doc = this.jQuery('#p' + id + '_text')
    doc.animate({scrollTop: doc[0].scrollHeight}, 500)
    //this.keepScrollDown = true
  }

  showScrollUpIcon(id) {
    if (this.jQuery('#p' + id + '_text')[0]) {
      return this.jQuery('#p' + id + '_text')[0].scrollTop !== 0
    }
    return false
  }

  scrollParagraphUp(id) {
    let doc = this.jQuery('#p' + id + '_text')
    doc.animate({scrollTop: 0}, 500)
    //this.keepScrollDown = false
  }

  /**
   * @returns {boolean} true if updated is needed
   */
  isUpdateRequired(oldPara, newPara) {
    /*return (newPara.id === oldPara.id &&
      (newPara.dateCreated !== oldPara.dateCreated ||
        newPara.text !== oldPara.text ||
        newPara.dateFinished !== oldPara.dateFinished ||
        newPara.dateStarted !== oldPara.dateStarted ||
        newPara.dateUpdated !== oldPara.dateUpdated ||
        newPara.status !== oldPara.status ||
        newPara.jobName !== oldPara.jobName ||
        newPara.title !== oldPara.title ||
        this.isEmpty(newPara.results) !== this.isEmpty(oldPara.results) ||
        newPara.errorMessage !== oldPara.errorMessage ||
        !angular.equals(newPara.settings, oldPara.settings) ||
        !angular.equals(newPara.config, oldPara.config) ||
        !angular.equals(newPara.runtimeInfos, oldPara.runtimeInfos)))*/
    return false
  }

  updateAllScopeTexts(oldPara, newPara) {
    let self = this;
    if (oldPara.text !== newPara.text) {
      if (self.dirtyText) {         // check if editor has local update
        if (self.dirtyText === newPara.text) {  // when local update is the same from remote, clear local update
          self.paragraph.text = newPara.text
          self.dirtyText = undefined
          self.originalText = Object.assign("",newPara.text)
        } else { // if there're local update, keep it.
          self.paragraph.text = newPara.text
        }
      } else {
        self.paragraph.text = newPara.text
        self.originalText =  Object.assign("",newPara.text)
      }
    }
  }

  updateParagraphObjectWhenUpdated(newPara) {
    // resize col width
    let self = this;
    if (self.paragraph.config.colWidth !== newPara.config.colWidth) {
      //$scope.$broadcast('paragraphResized', $scope.paragraph.id)
      self.eventService.broadcast('paragraphResized', self.paragraph.id)
    }

    if (self.paragraph.config.fontSize !== newPara.config.fontSize) {
      //$rootScope.$broadcast('fontSizeChanged', newPara.config.fontSize)
      self.eventService.broadcast('fontSizeChanged', newPara.config.fontSize)
    }

    /** push the rest */
    self.paragraph.aborted = newPara.aborted
    self.paragraph.user = newPara.user
    self.paragraph.dateUpdated = newPara.dateUpdated
    self.paragraph.dateCreated = newPara.dateCreated
    self.paragraph.dateFinished = newPara.dateFinished
    self.paragraph.dateStarted = newPara.dateStarted
    self.paragraph.errorMessage = newPara.errorMessage
    self.paragraph.jobName = newPara.jobName
    self.paragraph.title = newPara.title
    self.paragraph.lineNumbers = newPara.lineNumbers
    self.paragraph.status = newPara.status
    self.paragraph.fontSize = newPara.fontSize
    if (newPara.status !== ParagraphStatus.RUNNING) {
      self.paragraph.results = newPara.results
    }
    self.paragraph.settings = newPara.settings
    self.paragraph.runtimeInfos = newPara.runtimeInfos
    if (self.editor) {
      self.editor.setReadOnly(self.isRunning(newPara))
    }

    if (!self.asIframe) {
      self.paragraph.config = newPara.config
      self.initializeDefault(newPara.config)
    } else {
      newPara.config.editorHide = true
      newPara.config.tableHide = false
      self.paragraph.config = newPara.config
    }
  }

  updateParagraph(oldPara, newPara, updateCallback) {
    let self = this;
    // 1. can't update on revision view
    /*if (self.revisionView === true) {
      return
    }*/

    // 2. get status, refreshed
    const statusChanged = (newPara.status !== oldPara.status)
    const resultRefreshed = (newPara.dateFinished !== oldPara.dateFinished) ||
      self.isEmpty(newPara.results) !== self.isEmpty(oldPara.results) ||
      newPara.status === ParagraphStatus.ERROR ||
      (newPara.status === ParagraphStatus.FINISHED && statusChanged)

    // 3. update texts managed by $scope
    self.updateAllScopeTexts(oldPara, newPara)

    // 4. execute callback to update result
    updateCallback()

    // 5. update remaining paragraph objects
    self.updateParagraphObjectWhenUpdated(newPara)

    // 6. handle scroll down by key properly if new paragraph is added
    if (statusChanged || resultRefreshed) {
      // when last paragraph runs, zeppelin automatically appends new paragraph.
      // this broadcast will focus to the newly inserted paragraph

      /*const paragraphs = angular.element('div[id$="_paragraphColumn_main"]')
      if (paragraphs.length >= 2 && paragraphs[paragraphs.length - 2].id.indexOf($scope.paragraph.id) === 0) {
        // rendering output can took some time. So delay scrolling event firing for sometime.
        setTimeout(() => { $rootScope.$broadcast('scrollToCursor') }, 500)
      }*/
    }
  }

  clearSearchSelection() {
    let self = this;
    for (let i = 0; i < self.searchRanges.length; ++i) {
      self.editor.session.removeMarker(self.searchRanges[i].markerId)
    }
    self.searchRanges = []
    if (self.currentRange.id !== -1) {
      self.editor.session.removeMarker(self.currentRange.markerId)
    }
    self.currentRange = self.getCurrentRangeDefault()
  }

  onEditorClick() {
    //$scope.$emit('editorClicked')
    this.eventService.broadcast('editorClicked')
  }

  markAllOccurrences(text) {
    this.clearSearchSelection()
    if (text === '') {
      return
    }
    if (this.editor.findAll(text) === 0) {
      return
    }
    let ranges = this.editor.selection.getAllRanges()
    this.editor.selection.toSingleRange()
    this.editor.selection.clearSelection()
    for (let i = 0; i < ranges.length; ++i) {
      let id = this.editor.session.addMarker(ranges[i], 'ace_selected-word', 'text')
      this.searchRanges.push({markerId: id, range: ranges[i]})
    }
  }

  constructor(public notebook:NotebookComponent,
              private websocketMsgSrv:WebsocketMessageService,
              private noteVarShareService:NoteVarShareService,
              private eventService:EventService1,
              private globalService:GlobalService,
              private commonService:CommonService,
              private messageService:MessageService,
              private elementRef:ElementRef,
              private heliumService:HeliumService,
              private confirmationService:ConfirmationService) {
    this.items = [
      {label: '上移片段', icon: 'fa-arrow-circle-o-up', command: () => {
        //this.update();
      }},
      {label: '下移片段', icon: 'fa-arrow-circle-o-down', command: () => {
        //this.delete();
      }},
      {label: '创建新片段', icon: 'fa-plus-circle', command: () => {
        //this.delete();
      }},
      {label: '克隆片段', icon: 'fa-copy', command: () => {
        //this.delete();
      }},
      {label: '隐藏标题', icon: 'fa-close', command: () => {
        //this.delete();
      }},
      {label: '显示行号', icon: 'fa-list', command: () => {
        //this.delete();
      }},
      {label: '停止运行', icon: 'fa-remove', command: () => {
        //this.delete();
      }},
      {label: '发布链接', icon: 'fa-share-square-o', command: () => {
        //this.delete();
      }},
      {label: '清除输出', icon: 'fa-eraser', command: () => {
        //this.delete();
      }},
      {label: '删除片段', icon: 'fa-recycle', command: () => {
        //this.delete();
      }}
    ];
    this.ace = this.commonService._ace
    this.jQuery = this.commonService._jQuery
    this.editorSetting = {}
  }

  ngOnInit() {

    let self = this;

    //初始化片段
    self.init(self.notebook.getParagraphById(self.paragraphid),self.notebook.note)

    console.log(self.paragraph)

    this.eventService.subscribe('updateParagraphOutput', function (data) {
      if (self.paragraph.id === data.paragraphId) {
        if (!self.paragraph.results) {
          self.paragraph.results = {}
        }
        if (!self.paragraph.results.msg) {
          self.paragraph.results.msg = []
        }

        let update = (self.paragraph.results.msg[data.index]) ? true : false

        self.paragraph.results.msg[data.index] = {
          data: data.data,
          type: data.type
        }

        if (update) {

          let result = {
            index:data.index,
            paragraph:self.paragraph,
            result:self.paragraph.config.results[data.index],
            msg:self.paragraph.results.msg[data.index]
          }

          this.eventService.broadcast('updateResult',result)
        }
      }
    })


    this.eventService.subscribe('angularObjectUpdate', function (event, data) {
      let noteId = self.parentNote.id
      /*if (!data.noteId || data.noteId === noteId) {
        let scope
        let registry

        if (!data.paragraphId || data.paragraphId === self.paragraph.id) {
          scope = self.paragraphScope
          registry = self.angularObjectRegistry
        } else {
          return
        }
        let varName = data.angularObject.name

        /!*if (angular.equals(data.angularObject.object, scope[varName])) {
          // return when update has no change
          return
        }*!/

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
            self.websocketMsgSrv.updateAngularObject(
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
        if (varName.indexOf(self.ANGULAR_FUNCTION_OBJECT_NAME_PREFIX) === 0) {
          let funcName = varName.substring((self.ANGULAR_FUNCTION_OBJECT_NAME_PREFIX).length)
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

    this.eventService.subscribe('updateParaInfos', function (event, data) {
      if (data.id === self.paragraph.id) {
        self.paragraph.runtimeInfos = data.infos
      }
    })

    this.eventService.subscribe('angularObjectRemove', function (event, data) {
      let noteId = self.parentNote.id
      /*if (!data.noteId || data.noteId === noteId) {
        let scope
        let registry

        if (!data.paragraphId || data.paragraphId === self.paragraph.id) {
          scope = self.paragraphScope
          registry = self.angularObjectRegistry
        } else {
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
        if (varName.indexOf(self.ANGULAR_FUNCTION_OBJECT_NAME_PREFIX) === 0) {
          let funcName = varName.substring((self.ANGULAR_FUNCTION_OBJECT_NAME_PREFIX).length)
          scope[funcName] = undefined
        }
      }*/
    })


    /** $scope.$on */

    this.eventService.subscribe('runParagraphUsingSpell', function (data) {
      const oldPara = self.paragraph
      let newPara = data.paragraph
      const updateCallback = () => {
        self.runParagraph(newPara.text, true, true)
      }

      if (!self.isUpdateRequired(oldPara, newPara)) {
        return
      }

      self.updateParagraph(oldPara, newPara, updateCallback)
    })

    this.eventService.subscribe('updateParagraph', function (data) {
      const oldPara = self.paragraph
      const newPara = data.paragraph

      if (!self.isUpdateRequired(oldPara, newPara)) {
        return
      }

      const updateCallback = () => {
        // broadcast `updateResult` message to trigger result update
        if (newPara.results && newPara.results.msg) {
          for (let i in newPara.results.msg) {
            const newResult = newPara.results.msg ? newPara.results.msg[i] : {}
            const oldResult = (oldPara.results && oldPara.results.msg)
              ? oldPara.results.msg[i] : {}
            const newConfig = newPara.config.results ? newPara.config.results[i] : {}
            const oldConfig = oldPara.config.results ? oldPara.config.results[i] : {}
            /*if (!angular.equals(newResult, oldResult) ||
              !angular.equals(newConfig, oldConfig)) {
              //$rootScope.$broadcast('updateResult', newResult, newConfig, newPara, parseInt(i))
              self.eventService.broadcast('updateResult', newResult, newConfig, newPara, parseInt(i))
            }*/
          }
        }
      }

      self.updateParagraph(oldPara, newPara, updateCallback)
    })

    this.eventService.subscribe('updateProgress', function (event, data) {
      if (data.id === this.paragraph.id) {
        this.currentProgress = data.progress
      }
    })

    this.eventService.subscribe('keyEvent', function (keyEvent) {
      if (self.paragraphFocused) {
        let paragraphId = self.paragraph.id
        let keyCode = keyEvent.keyCode
        let noShortcutDefined = false
        let editorHide = self.paragraph.config.editorHide

        if (editorHide && (keyCode === 38 || (keyCode === 80 && keyEvent.ctrlKey && !keyEvent.altKey))) { // up
          // move focus to previous paragraph
          //$scope.$emit('moveFocusToPreviousParagraph', paragraphId)
        } else if (editorHide && (keyCode === 40 || (keyCode === 78 && keyEvent.ctrlKey && !keyEvent.altKey))) { // down
          // move focus to next paragraph
          // $timeout stops chaining effect of focus propogation
          //$timeout(() => $scope.$emit('moveFocusToNextParagraph', paragraphId))
        } else if (keyEvent.shiftKey && keyCode === 13) { // Shift + Enter
          self.runParagraphFromShortcut(self.getEditorValue())
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 67) { // Ctrl + Alt + c
          self.cancelParagraph(self.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 68) { // Ctrl + Alt + d
          self.removeParagraph(self.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 75) { // Ctrl + Alt + k
          self.moveUp(self.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 74) { // Ctrl + Alt + j
          self.moveDown(self.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 65) { // Ctrl + Alt + a
          self.insertNew('above')
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 66) { // Ctrl + Alt + b
          self.insertNew('below')
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 79) { // Ctrl + Alt + o
          self.toggleOutput(self.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 82) { // Ctrl + Alt + r
          self.toggleEnableDisable(self.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 69) { // Ctrl + Alt + e
          self.toggleEditor(self.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 77) { // Ctrl + Alt + m
          if (self.paragraph.config.lineNumbers) {
            self.hideLineNumbers(self.paragraph)
          } else {
            self.showLineNumbers(self.paragraph)
          }
        } else if (keyEvent.ctrlKey && keyEvent.shiftKey && keyCode === 189) { // Ctrl + Shift + -
          self.changeColWidth(self.paragraph, Math.max(1, self.paragraph.config.colWidth - 1))
        } else if (keyEvent.ctrlKey && keyEvent.shiftKey && keyCode === 187) { // Ctrl + Shift + =
          self.changeColWidth(self.paragraph, Math.min(12, self.paragraph.config.colWidth + 1))
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 84) { // Ctrl + Alt + t
          if (self.paragraph.config.title) {
            self.hideTitle(self.paragraph)
          } else {
            self.showTitle(self.paragraph)
          }
        } else if (keyEvent.ctrlKey && keyEvent.shiftKey && keyCode === 67) { // Ctrl + Alt + c
          self.copyPara('below')
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 76) { // Ctrl + Alt + l
          self.clearParagraphOutput(self.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 87) { // Ctrl + Alt + w
          self.goToSingleParagraph()
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 70) { // Ctrl + f
          //self.$emit('toggleSearchBox')
          self.eventService.broadcast('toggleSearchBox')
        } else {
          noShortcutDefined = true
        }

        if (!noShortcutDefined) {
          keyEvent.preventDefault()
        }
      }
    })

    this.eventService.subscribe('focusParagraph', function (event, paragraphId, cursorPos, mouseEvent) {
      if (self.paragraph.id === paragraphId) {
        // focus editor
        if (!self.paragraph.config.editorHide) {
          if (!mouseEvent) {
            self.editor.focus()
            // move cursor to the first row (or the last row)
            let row
            if (cursorPos >= 0) {
              row = cursorPos
              self.editor.gotoLine(row, 0)
            } else {
              row = self.editor.session.getLength()
              self.editor.gotoLine(row, 0)
            }
            self.scrollToCursor(self.paragraph.id, 0)
          }
        }
        self.handleFocus(true)
      } else {
        if (self.editor !== undefined && self.editor !== null) {
          self.editor.blur()
        }
        let isDigestPass = true
        self.handleFocus(false, isDigestPass)
      }
    })

    this.eventService.subscribe('saveInterpreterBindings', function (event, paragraphId) {
      if (self.paragraph.id === paragraphId && self.editor) {
        self.setInterpreterBindings = true
        self.setParagraphMode(self.editor.getSession(), self.editor.getSession().getValue())
      }
    })

    this.eventService.subscribe('doubleClickParagraph', function (event, paragraphId) {
      if (self.paragraph.id === paragraphId && self.paragraph.config.editorHide &&
        self.paragraph.config.editorSetting.editOnDblClick && self.revisionView !== true) {
        /*let deferred = $q.defer()
        self.openEditorAndCloseTable(self.paragraph)
        $timeout(
          $scope.$on('updateParagraph', function (event, data) {
              deferred.resolve(data)
            }
          ), 1000)

        deferred.promise.then(function (data) {
          if (self.editor) {
            self.editor.focus()
            self.goToEnd(self.editor)
          }
        })*/
      }
    })

    this.eventService.subscribe('openEditor', function (event) {
      self.openEditor(self.paragraph)
    })

    this.eventService.subscribe('closeEditor', function (event) {
      self.closeEditor(self.paragraph)
    })

    this.eventService.subscribe('openTable', function (event) {
      self.openTable(self.paragraph)
    })

    this.eventService.subscribe('closeTable', function (event) {
      self.closeTable(self.paragraph)
    })

    this.eventService.subscribe('resultRendered', function (paragraphId) {
      if (self.paragraph.id !== paragraphId) {
        return
      }

      /** increase spell result count and return if not finished */
      if (!self.increaseSpellTransactionResultCount()) {
        return
      }

      self.cleanupSpellTransaction()
    })

    this.eventService.subscribe('fontSizeChanged', function (fontSize) {
      if (self.editor) {
        self.editor.setOptions({
          fontSize: fontSize + 'pt'
        })
      }
    })

    this.eventService.subscribe('unmarkAll', function() {
      self.clearSearchSelection()
    })

    this.eventService.subscribe('markAllOccurrences', function(text) {
      self.markAllOccurrences(text)
      if (this.searchRanges.length > 0) {
        self.eventService.broadcast('occurrencesExists', this.searchRanges.length)
      }
    })

    this.eventService.subscribe('nextOccurrence', function(paragraphId) {
      if (self.paragraph.id !== paragraphId) {
        return
      }
      let highlightedRangeExists = self.currentRange.id !== -1
      if (highlightedRangeExists) {
        self.editor.session.removeMarker(self.currentRange.markerId)
        self.currentRange.markerId = -1
      }
      ++self.currentRange.id
      if (self.currentRange.id >= self.searchRanges.length) {
        self.currentRange.id = -1
        //$scope.$emit('noNextOccurrence')
        return
      }
      self.currentRange.markerId = self.editor.session.addMarker(
        self.searchRanges[self.currentRange.id].range, 'ace_selection', 'text')
    })

    this.eventService.subscribe('prevOccurrence', function(paragraphId) {
      if (this.paragraph.id !== paragraphId) {
        return
      }
      let highlightedRangeExists = this.currentRange.id !== -1
      if (highlightedRangeExists) {
        this.editor.session.removeMarker(this.currentRange.markerId)
        this.currentRange.markerId = -1
      }
      if (this.currentRange.id === -1) {
        this.currentRange.id = this.searchRanges.length
      }
      --this.currentRange.id
      if (this.currentRange.id === -1) {
        //$scope.$emit('noPrevOccurrence')
        return
      }
      this.currentRange.markerId = this.editor.session.addMarker(
        this.searchRanges[this.currentRange.id].range, 'ace_selection', 'text')
    })

    this.eventService.subscribe('replaceCurrent', function(event, from, to) {
      if (this.currentRange.id === -1) {
        return
      }
      let indexFromEnd = this.searchRanges.length - this.currentRange.id - 1
      let prevId = this.currentRange.id
      this.editor.session.removeMarker(this.currentRange.markerId)
      this.editor.session.replace(this.searchRanges[this.currentRange.id].range, to)
      this.markAllOccurrences(from)
      let currentIndex = this.searchRanges.length - indexFromEnd
      //$scope.$emit('occurrencesCountChanged', currentIndex - prevId - 1)
      this.currentRange.id = currentIndex
      if (this.currentRange.id === this.searchRanges.length) {
        this.currentRange.id = -1
        //$scope.$emit('noNextOccurrenceAfterReplace')
      } else {
        this.currentRange.markerId = this.editor.session.addMarker(
          this.searchRanges[this.currentRange.id].range, 'ace_selection', 'text')
      }
    })

    this.eventService.subscribe('replaceAll', function(event, from, to) {
      this.clearSearchSelection()
      this.editor.replaceAll(to, {needle: from})
    })

    this.eventService.subscribe('checkOccurrences', function() {
      if (this.searchRanges.length > 0) {
        //$scope.$emit('occurrencesExists', this.searchRanges.length)
      }
    })

  }

  /**
   * 当View初始化完成之后
   */
  ngAfterViewInit(): void {

    //获取Editor
    var editor = this.ace.edit(this.paragraph.id+'_editor')

    //设置展示模式
    //editor.setTheme("ace/theme/eclipse");
    //editor.session.setMode("ace/mode/javascript");

    //配置Editor
    this.aceLoaded(editor)

    //设置当前Editor的数据
    editor.setValue(this.originalText)
  }

  //当编辑了Editor内容后触发 [没有]
  aceChanged() {
    let self = this;
    let session = self.editor.getSession()
    let dirtyText = session.getValue()
    self.dirtyText = dirtyText
    //如果和原来的数据不一样就保存
    if (self.dirtyText !== self.originalText) {
      //this.startSaveTimer()
    }
    console.log(self)
    self.setParagraphMode(session, dirtyText, self.editor.getCursorPosition())
  }

  goToEnd(editor) {
    editor.navigateFileEnd()
  }

  autoAdjustEditorHeight(editor) {
    let height =
      editor.getSession().getScreenLength() *
      editor.renderer.lineHeight +
      editor.renderer.scrollBar.getWidth()

    this.jQuery('#' + editor.container.id).height(height.toString() + 'px')
    editor.resize()
  }

  //加载并配置Editor
  aceLoaded(_editor) {
    let self = this;
    let langTools = self.ace.acequire('ace/ext/language_tools')
    let Range = self.ace.acequire('ace/range').Range

    _editor.$blockScrolling = Infinity
    self.editor = _editor
    //self.editor.on('input', self.aceChanged)
    //当编辑了Editor内容后触发
    self.editor.on('input', function(){
      let session = self.editor.getSession()
      let dirtyText = session.getValue()
      self.dirtyText = dirtyText
      //如果和原来的数据不一样就保存
      if (self.dirtyText !== self.originalText) {
        //this.startSaveTimer()
      }
      self.setParagraphMode(session, dirtyText, self.editor.getCursorPosition())
    })
    if (_editor.container.id == self.paragraphid+'_editor') {
      self.editor.renderer.setShowGutter(self.paragraph.config.lineNumbers)
      self.editor.setShowFoldWidgets(false)
      self.editor.setHighlightActiveLine(false)
      self.editor.getSession().setUseWrapMode(true)
      self.editor.setTheme('ace/theme/chrome')
      self.editor.setReadOnly(self.isRunning(self.paragraph))
      self.editor.setHighlightActiveLine(self.paragraphFocused)

      if (self.paragraphFocused) {
        let prefix = '%' + self.getInterpreterName(self.paragraph.text)
        let paragraphText = self.paragraph.text ? self.paragraph.text.trim() : ''

        self.editor.focus()
        self.goToEnd(self.editor)
        if (prefix === paragraphText) {
          setTimeout(function () {
            self.editor.gotoLine(2, 0)
          }, 0)
        }
      }

      self.autoAdjustEditorHeight(_editor)
      self.jQuery(window).resize(function () {
        self.autoAdjustEditorHeight(_editor)
      })

      if (navigator.appVersion.indexOf('Mac') !== -1) {
        self.editor.setKeyboardHandler('ace/keyboard/emacs')
        self.globalService.isMac = true
      } else if (navigator.appVersion.indexOf('Win') !== -1 ||
        navigator.appVersion.indexOf('X11') !== -1 ||
        navigator.appVersion.indexOf('Linux') !== -1) {
        self.globalService.isMac = false
        // not applying emacs key binding while the binding override Ctrl-v. default behavior of paste text on windows.
      }

      //远程代码补全
      let remoteCompleter = {
        getCompletions: function(editor, session, pos, prefix, callback) {
          let langTools = self.ace.acequire('ace/ext/language_tools')
          let defaultKeywords = new Set()

          // eslint-disable-next-line handle-callback-err
          let getDefaultKeywords = function(err, completions) {
            if (completions !== undefined) {
              completions.forEach(function(c) {
                defaultKeywords.add(c.value)
              })
            }
          }
          if (langTools.keyWordCompleter !== undefined) {
            langTools.keyWordCompleter.getCompletions(editor, session, pos, prefix, getDefaultKeywords)
          }

          if (!editor.isFocused()) {
            return
          }

          pos = session.getTextRange(new Range(0, 0, pos.row, pos.column)).length
          let buf = session.getValue()

          self.websocketMsgSrv.completion(self.paragraph.id, buf, pos)

          self.eventService.subscribe('completionList', function(data) {
            let computeCaption = function(value, meta) {
              let metaLength = meta !== undefined ? meta.length : 0
              let length = 42
              let whitespaceLength = 3
              let ellipses = '...'
              let maxLengthCaption = length - metaLength - whitespaceLength - ellipses.length
              if (value !== undefined && value.length > maxLengthCaption) {
                return value.substr(0, maxLengthCaption) + ellipses
              }
              return value
            }
            if (data.completions) {
              let completions = []
              for (let c in data.completions) {
                let v = data.completions[c]
                if (v.meta !== undefined && v.meta === 'keyword' && defaultKeywords.has(v.value.trim())) {
                  continue
                }
                completions.push({
                  name: v.name,
                  value: v.value,
                  meta: v.meta,
                  caption: computeCaption(v.value, v.meta),
                  score: 300
                })
              }
              callback(null, completions)
            }
          })
        }
      }

      // 设置代码补全
      langTools.setCompleters([remoteCompleter, langTools.keyWordCompleter, langTools.snippetCompleter, langTools.textCompleter])

      self.editor.setOptions({
        fontSize: self.paragraph.config.fontSize + 'pt',
        enableBasicAutocompletion: true,
        enableSnippets: false,
        enableLiveAutocompletion: false
      })

      self.editor.on('focus', function () {
        self.handleFocus(true)
      })

      self.editor.on('blur', function () {
        self.handleFocus(false)
        self.saveParagraph(self.paragraph)
      })

      self.editor.on('paste', function (e) {
        if (e.text.indexOf('%') === 0) {
          self.pastePercentSign = true
        }
      })

      self.editor.getSession().on('change', function (e, editSession) {
        self.autoAdjustEditorHeight(_editor)
      })

      self.setParagraphMode(self.editor.getSession(), self.editor.getSession().getValue())

      // autocomplete on '.'
      /*
       $scope.editor.commands.on("afterExec", function(e, t) {
       if (e.command.name == "insertstring" && e.args == "." ) {
       var all = e.editor.completers;
       //e.editor.completers = [remoteCompleter];
       e.editor.execCommand("startAutocomplete");
       //e.editor.completers = all;
       }
       });
       */

      // remove binding
      self.editor.commands.removeCommand('showSettingsMenu')
      self.editor.commands.removeCommand('find')
      self.editor.commands.removeCommand('replace')

      let isOption = self.globalService.isMac ? 'option' : 'alt'

      self.editor.commands.bindKey('ctrl-' + isOption + '-n.', null)
      self.editor.commands.bindKey('ctrl-' + isOption + '-l', null)
      self.editor.commands.bindKey('ctrl-' + isOption + '-w', null)
      self.editor.commands.bindKey('ctrl-' + isOption + '-a', null)
      self.editor.commands.bindKey('ctrl-' + isOption + '-k', null)
      self.editor.commands.bindKey('ctrl-' + isOption + '-e', null)
      self.editor.commands.bindKey('ctrl-' + isOption + '-t', null)
      self.editor.commands.bindKey('ctrl-space', null)

      if (self.globalService.isMac) {
        self.editor.commands.bindKey('command-l', null)
      } else {
        self.editor.commands.bindKey('ctrl-l', null)
      }

      // autocomplete on 'ctrl+.'
      self.editor.commands.bindKey('ctrl-.', 'startAutocomplete')

      // Show autocomplete on tab
      self.editor.commands.addCommand({
        name: 'tabAutocomplete',
        bindKey: {
          win: 'tab',
          mac: 'tab',
          sender: 'editor|cli'
        },
        exec: function(env, args, request) {
          let iCursor = self.editor.getCursorPosition()
          let currentLine = self.editor.session.getLine(iCursor.row)
          let isAllTabs = currentLine.substring(0, iCursor.column - 1).split('').every(function(char) {
            return (char === '\t' || char === ' ')
          })

          // If user has pressed tab on first line char or if isTabCompletion() is false, keep existing behavior
          // If user has pressed tab anywhere in between and editor mode is not %md, show autocomplete
          if (!isAllTabs && iCursor.column && self.isTabCompletion()) {
            self.editor.execCommand('startAutocomplete')
          } else {
            self.ace.config.loadModule('ace/ext/language_tools', function () {
              self.editor.insertSnippet('\t')
            })
          }
        }
      })

      let keyBindingEditorFocusAction = function (scrollValue) {
        let numRows = self.editor.getSession().getLength()
        let currentRow = self.editor.getCursorPosition().row
        if (currentRow === 0 && scrollValue <= 0) {
          // move focus to previous paragraph
          self.eventService.broadcast('moveFocusToPreviousParagraph', self.paragraph.id)
          //$scope.$emit('moveFocusToPreviousParagraph', self.paragraph.id)
        } else if (currentRow === numRows - 1 && scrollValue >= 0) {
          self.eventService.broadcast('moveFocusToNextParagraph', self.paragraph.id)
          //$scope.$emit('moveFocusToNextParagraph', self.paragraph.id)
        } else {
          self.scrollToCursor(self.paragraph.id, scrollValue)
        }
      }

      // handle cursor moves
      self.editor.keyBinding.origOnCommandKey = self.editor.keyBinding.onCommandKey
      self.editor.keyBinding.onCommandKey = function (e, hashId, keyCode) {
        if (self.editor.completer && self.editor.completer.activated) { // if autocompleter is active
        } else {
          // fix ace editor focus issue in chrome (textarea element goes to top: -1000px after focused by cursor move)
          if (parseInt(self.jQuery('#' + self.paragraph.id + '_editor > textarea')
              .css('top').replace('px', '')) < 0) {
            let position = self.editor.getCursorPosition()
            let cursorPos = self.editor.renderer.$cursorLayer.getPixelPosition(position, true)
            self.jQuery('#' + self.paragraph.id + '_editor > textarea').css('top', cursorPos.top)
          }

          let ROW_UP = -1
          let ROW_DOWN = 1

          switch (keyCode) {
            case 38:
              if (!e.shiftKey) { keyBindingEditorFocusAction(ROW_UP) }
              break
            case 80:
              if (e.ctrlKey && !e.altKey) { keyBindingEditorFocusAction(ROW_UP) }
              break
            case 40:
              if (!e.shiftKey) { keyBindingEditorFocusAction(ROW_DOWN) }
              break
            case 78:
              if (e.ctrlKey && !e.altKey) { keyBindingEditorFocusAction(ROW_DOWN) }
              break
          }
        }
        this.origOnCommandKey(e, hashId, keyCode)
      }
    }
  }

  handleFocus(focused, isDigestPass?) {
    let self = this;
    self.paragraphFocused = focused

    if (self.editor) { self.editor.setHighlightActiveLine(focused) }

    if (isDigestPass === false || isDigestPass === undefined) {
      // Protect against error in case digest is already running
      setTimeout(function () {
        // Apply changes since they come from 3rd party library
        //$scope.$digest()
      })
    }
  }

  getInterpreterName(paragraphText) {
    let self = this;
    let intpNameRegexp = /^\s*%(.+?)(\s|\()/g
    let match = intpNameRegexp.exec(paragraphText)
    if (match) {
      return match[1].trim()
      // get default interpreter name if paragraph text doesn't start with '%'
      // TODO(mina): dig into the cause what makes interpreterBindings to have no element
    } else if (self.notebook.interpreterBindings && self.notebook.interpreterBindings.length !== 0) {
      return self.notebook.interpreterBindings[0].name
    }
  }

  setEditorLanguage(session, language) {
    let mode = 'ace/mode/'
    mode += language
    this.paragraph.config.editorMode = mode
    session.setMode(mode)
  }

  setParagraphMode(session, paragraphText, pos?) {
    // Evaluate the mode only if the the position is undefined
    // or the first 30 characters of the paragraph have been modified
    // or cursor position is at beginning of second line.(in case user hit enter after typing %magic)
    let self = this;
    if ((typeof pos === 'undefined') || (pos.row === 0 && pos.column < 30) ||
      (pos.row === 1 && pos.column === 0) || self.pastePercentSign) {
      // If paragraph loading, use config value if exists
      if ((typeof pos === 'undefined') && self.paragraph.config.editorMode &&
        !self.setInterpreterBindings) {
        session.setMode(self.paragraph.config.editorMode)
      } else {
        let magic = self.getInterpreterName(paragraphText)
        if (self.editorSetting.magic !== magic) {
          self.editorSetting.magic = magic
          self.getEditorSetting(self.paragraph, magic)
            .then(function (setting) {
              self.setEditorLanguage(session, setting.editor.language)
              self.paragraph.config.editorSetting.merge( setting.editor)
            })
        }
      }
    }
    self.pastePercentSign = false
    self.setInterpreterBindings = false
  }

  getEditorSetting(paragraph, interpreterName) {
    let self = this;
    let deferred = tsd.create()
    if (!self.revisionView) {
      self.websocketMsgSrv.getEditorSetting(paragraph.id, interpreterName)
      setTimeout(
        self.eventService.subscribe('editorSetting', function (data) {
            if (paragraph.id === data.paragraphId) {
              deferred.resolve(data)
            }
          }
        ), 1000)
    }
    return deferred.promise
  }

}
