import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {WebsocketMessageService} from "../../../service/websocket/websocket-message.service";
import {NoteVarShareService} from "../../../service/note-var-share/note-var-share.service";
import {EventService1} from "../../../service/event/event.service";
import {isParagraphRunning, ParagraphStatus} from "./paragraph.status";
import {NotebookComponent} from "../notebook.component";
import {MenuItem} from "primeng/primeng";
import * as moment from "moment";
import {GlobalService} from "../../../service/global/global.service";

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
export class ParagraphComponent implements OnInit {

  //当前的片段ID
  paragraphid
  //当前的片段
  paragraph
  //片段所属的Note
  parentNote

  /**************** 更新Note名称 START ***************/
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

  /**************** 更新Note名称 END ***************/

  //初始的文本
  chart
  baseMapOption
  colWidthOption
  fontSizeOption


  //片段配置的List
  items: MenuItem[];


  //是否全屏显示
  display = false;


  /**************  editor ********/
  @ViewChild('editor') editor;
  dirtyText
  originalText

  editorSetting = {}
  // flag that is used to set editor setting on paste percent sign
  pastePercentSign = false
  // flag that is used to set editor setting on save interpreter bindings
  setInterpreterBindings = false

  paragraphFocused



  text:string = "";
  options:any = {maxLines: 1000, printMargin: false};

  onChange(code) {
    console.log("new code", code);
  }




  constructor(public notebook:NotebookComponent,
              private websocketMsgSrv:WebsocketMessageService,
              private noteVarShareService:NoteVarShareService,
              private eventService:EventService1,
              private globalService:GlobalService) {
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
  }

  ngOnInit() {

    let self = this;

    self.init(self.notebook.getParagraphById(self.paragraphid),self.notebook.note)

    console.log(self.paragraph)
    console.log(self.parentNote)

    /*this.eventService.subscribe('updateParagraphOutput', function (data) {
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
          this.eventService.broadcast(
            'updateResult',
            self.paragraph.results.msg[data.index],
            self.paragraph.config.results[data.index],
            self.paragraph,
            data.index)
        }
      }
    })

    this.eventService.subscribe('markAllOccurrences', function(event, text) {
      self.markAllOccurrences(text)
      if (self.searchRanges.length > 0) {
        $scope.$emit('occurrencesExists', searchRanges.length)
      }
    })

    this.eventService.subscribe('unmarkAll', function() {
      self.clearSearchSelection()
    })

    this.eventService.subscribe('nextOccurrence', function(event, paragraphId) {
      if ($scope.paragraph.id !== paragraphId) {
        return
      }
      let highlightedRangeExists = currentRange.id !== -1
      if (highlightedRangeExists) {
        $scope.editor.session.removeMarker(currentRange.markerId)
        currentRange.markerId = -1
      }
      ++currentRange.id
      if (currentRange.id >= searchRanges.length) {
        currentRange.id = -1
        $scope.$emit('noNextOccurrence')
        return
      }
      currentRange.markerId = $scope.editor.session.addMarker(
        searchRanges[currentRange.id].range, 'ace_selection', 'text')
    })

    this.eventService.subscribe('prevOccurrence', function(event, paragraphId) {
      if ($scope.paragraph.id !== paragraphId) {
        return
      }
      let highlightedRangeExists = currentRange.id !== -1
      if (highlightedRangeExists) {
        $scope.editor.session.removeMarker(currentRange.markerId)
        currentRange.markerId = -1
      }
      if (currentRange.id === -1) {
        currentRange.id = searchRanges.length
      }
      --currentRange.id
      if (currentRange.id === -1) {
        $scope.$emit('noPrevOccurrence')
        return
      }
      currentRange.markerId = $scope.editor.session.addMarker(
        searchRanges[currentRange.id].range, 'ace_selection', 'text')
    })

    this.eventService.subscribe('replaceCurrent', function(event, from, to) {
      if (currentRange.id === -1) {
        return
      }
      let indexFromEnd = searchRanges.length - currentRange.id - 1
      let prevId = currentRange.id
      $scope.editor.session.removeMarker(currentRange.markerId)
      $scope.editor.session.replace(searchRanges[currentRange.id].range, to)
      markAllOccurrences(from)
      let currentIndex = searchRanges.length - indexFromEnd
      $scope.$emit('occurrencesCountChanged', currentIndex - prevId - 1)
      currentRange.id = currentIndex
      if (currentRange.id === searchRanges.length) {
        currentRange.id = -1
        $scope.$emit('noNextOccurrenceAfterReplace')
      } else {
        currentRange.markerId = $scope.editor.session.addMarker(
          searchRanges[currentRange.id].range, 'ace_selection', 'text')
      }
    })

    this.eventService.subscribe('replaceAll', function(event, from, to) {
      clearSearchSelection()
      $scope.editor.replaceAll(to, {needle: from})
    })

    this.eventService.subscribe('checkOccurrences', function() {
      if (searchRanges.length > 0) {
        $scope.$emit('occurrencesExists', searchRanges.length)
      }
    })

    /!** $scope.$on *!/

    this.eventService.subscribe('runParagraphUsingSpell', function (event, data) {
      const oldPara = $scope.paragraph
      let newPara = data.paragraph
      const updateCallback = () => {
        $scope.runParagraph(newPara.text, true, true)
      }

      if (!isUpdateRequired(oldPara, newPara)) {
        return
      }

      $scope.updateParagraph(oldPara, newPara, updateCallback)
    })

    this.eventService.subscribe('updateParagraph', function (event, data) {
      const oldPara = $scope.paragraph
      const newPara = data.paragraph

      if (!isUpdateRequired(oldPara, newPara)) {
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
            if (!angular.equals(newResult, oldResult) ||
              !angular.equals(newConfig, oldConfig)) {
              $rootScope.$broadcast('updateResult', newResult, newConfig, newPara, parseInt(i))
            }
          }
        }
      }

      $scope.updateParagraph(oldPara, newPara, updateCallback)
    })

    this.eventService.subscribe('updateProgress', function (event, data) {
      if (data.id === $scope.paragraph.id) {
        $scope.currentProgress = data.progress
      }
    })

    this.eventService.subscribe('keyEvent', function (event, keyEvent) {
      if ($scope.paragraphFocused) {
        let paragraphId = $scope.paragraph.id
        let keyCode = keyEvent.keyCode
        let noShortcutDefined = false
        let editorHide = $scope.paragraph.config.editorHide

        if (editorHide && (keyCode === 38 || (keyCode === 80 && keyEvent.ctrlKey && !keyEvent.altKey))) { // up
          // move focus to previous paragraph
          $scope.$emit('moveFocusToPreviousParagraph', paragraphId)
        } else if (editorHide && (keyCode === 40 || (keyCode === 78 && keyEvent.ctrlKey && !keyEvent.altKey))) { // down
          // move focus to next paragraph
          // $timeout stops chaining effect of focus propogation
          $timeout(() => $scope.$emit('moveFocusToNextParagraph', paragraphId))
        } else if (keyEvent.shiftKey && keyCode === 13) { // Shift + Enter
          $scope.runParagraphFromShortcut($scope.getEditorValue())
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 67) { // Ctrl + Alt + c
          $scope.cancelParagraph($scope.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 68) { // Ctrl + Alt + d
          $scope.removeParagraph($scope.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 75) { // Ctrl + Alt + k
          $scope.moveUp($scope.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 74) { // Ctrl + Alt + j
          $scope.moveDown($scope.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 65) { // Ctrl + Alt + a
          $scope.insertNew('above')
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 66) { // Ctrl + Alt + b
          $scope.insertNew('below')
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 79) { // Ctrl + Alt + o
          $scope.toggleOutput($scope.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 82) { // Ctrl + Alt + r
          $scope.toggleEnableDisable($scope.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 69) { // Ctrl + Alt + e
          $scope.toggleEditor($scope.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 77) { // Ctrl + Alt + m
          if ($scope.paragraph.config.lineNumbers) {
            $scope.hideLineNumbers($scope.paragraph)
          } else {
            $scope.showLineNumbers($scope.paragraph)
          }
        } else if (keyEvent.ctrlKey && keyEvent.shiftKey && keyCode === 189) { // Ctrl + Shift + -
          $scope.changeColWidth($scope.paragraph, Math.max(1, $scope.paragraph.config.colWidth - 1))
        } else if (keyEvent.ctrlKey && keyEvent.shiftKey && keyCode === 187) { // Ctrl + Shift + =
          $scope.changeColWidth($scope.paragraph, Math.min(12, $scope.paragraph.config.colWidth + 1))
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 84) { // Ctrl + Alt + t
          if ($scope.paragraph.config.title) {
            $scope.hideTitle($scope.paragraph)
          } else {
            $scope.showTitle($scope.paragraph)
          }
        } else if (keyEvent.ctrlKey && keyEvent.shiftKey && keyCode === 67) { // Ctrl + Alt + c
          $scope.copyPara('below')
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 76) { // Ctrl + Alt + l
          $scope.clearParagraphOutput($scope.paragraph)
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 87) { // Ctrl + Alt + w
          $scope.goToSingleParagraph()
        } else if (keyEvent.ctrlKey && keyEvent.altKey && keyCode === 70) { // Ctrl + f
          $scope.$emit('toggleSearchBox')
        } else {
          noShortcutDefined = true
        }

        if (!noShortcutDefined) {
          keyEvent.preventDefault()
        }
      }
    })

    this.eventService.subscribe('focusParagraph', function (event, paragraphId, cursorPos, mouseEvent) {
      if ($scope.paragraph.id === paragraphId) {
        // focus editor
        if (!$scope.paragraph.config.editorHide) {
          if (!mouseEvent) {
            $scope.editor.focus()
            // move cursor to the first row (or the last row)
            let row
            if (cursorPos >= 0) {
              row = cursorPos
              $scope.editor.gotoLine(row, 0)
            } else {
              row = $scope.editor.session.getLength()
              $scope.editor.gotoLine(row, 0)
            }
            $scope.scrollToCursor($scope.paragraph.id, 0)
          }
        }
        handleFocus(true)
      } else {
        if ($scope.editor !== undefined && $scope.editor !== null) {
          $scope.editor.blur()
        }
        let isDigestPass = true
        handleFocus(false, isDigestPass)
      }
    })

    this.eventService.subscribe('saveInterpreterBindings', function (event, paragraphId) {
      if ($scope.paragraph.id === paragraphId && $scope.editor) {
        setInterpreterBindings = true
        setParagraphMode($scope.editor.getSession(), $scope.editor.getSession().getValue())
      }
    })

    this.eventService.subscribe('doubleClickParagraph', function (event, paragraphId) {
      if ($scope.paragraph.id === paragraphId && $scope.paragraph.config.editorHide &&
        $scope.paragraph.config.editorSetting.editOnDblClick && $scope.revisionView !== true) {
        let deferred = $q.defer()
        openEditorAndCloseTable($scope.paragraph)
        $timeout(
          $scope.$on('updateParagraph', function (event, data) {
              deferred.resolve(data)
            }
          ), 1000)

        deferred.promise.then(function (data) {
          if ($scope.editor) {
            $scope.editor.focus()
            $scope.goToEnd($scope.editor)
          }
        })
      }
    })

    this.eventService.subscribe('openEditor', function (event) {
      $scope.openEditor($scope.paragraph)
    })

    this.eventService.subscribe('closeEditor', function (event) {
      $scope.closeEditor($scope.paragraph)
    })

    this.eventService.subscribe('openTable', function (event) {
      $scope.openTable($scope.paragraph)
    })

    this.eventService.subscribe('closeTable', function (event) {
      $scope.closeTable($scope.paragraph)
    })

    this.eventService.subscribe('resultRendered', function (event, paragraphId) {
      if ($scope.paragraph.id !== paragraphId) {
        return
      }

      /!** increase spell result count and return if not finished *!/
      if (!$scope.increaseSpellTransactionResultCount()) {
        return
      }

      $scope.cleanupSpellTransaction()
    })

    this.eventService.subscribe('fontSizeChanged', function (event, fontSize) {
      if ($scope.editor) {
        $scope.editor.setOptions({
          fontSize: fontSize + 'pt'
        })
      }
    })*/

  }


  // Controller init
  init(newParagraph, note) {
    this.paragraph = newParagraph
    this.parentNote = note
    this.originalText = Object.assign({}, newParagraph.text)
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

    for (let idx in forms) {
      if (forms[idx]) {
        if (forms[idx].options) {
          if (config.runOnSelectionChange === undefined) {
            config.runOnSelectionChange = true
          }
        }
      }
    }

    if (!config.results) {
      config.results = {}
    }

    if (!config.editorSetting) {
      config.editorSetting = {}
    } else if (config.editorSetting.editOnDblClick) {
      //editorSetting.isOutputHidden = config.editorSetting.editOnDblClick
    }
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


  aceLoaded(_editor) {
    let self = this;

    /*let langTools = ace.require('ace/ext/language_tools')
    let Range = ace.require('ace/range').Range

    _editor.$blockScrolling = Infinity

    self.editor = _editor

    self.editor.on('input', self.aceChanged)

    if (self.editor.container.id !== self.paragraph.id+'_editor') {
      self.editor.renderer.setShowGutter(self.paragraph.config.lineNumbers)
      self.editor.setShowFoldWidgets(false)
      self.editor.setHighlightActiveLine(false)
      self.editor.getSession().setUseWrapMode(true)
      //self.editor.setTheme('ace/theme/chrome')
      self.editor.setReadOnly(self.isRunning(self.paragraph))
      self.editor.setHighlightActiveLine(self.paragraphFocused)

      if (self.paragraphFocused) {
        let prefix = '%' + self.getInterpreterName(self.paragraph.text)
        let paragraphText = self.paragraph.text ? self.paragraph.text.trim() : ''

        self.editor.focus()
        self.goToEnd(self.editor)
        if (prefix === paragraphText) {
          /!*$timeout(function () {
            self.editor.gotoLine(2, 0)
          }, 0)*!/
        }
      }

      self.autoAdjustEditorHeight(self.editor)
      /!*angular.element(window).resize(function () {
        autoAdjustEditorHeight(_editor)
      })*!/

      if (navigator.appVersion.indexOf('Mac') !== -1) {
        self.editor.setKeyboardHandler('ace/keyboard/emacs')
        self.globalService.isMac = true
      } else if (navigator.appVersion.indexOf('Win') !== -1 ||
        navigator.appVersion.indexOf('X11') !== -1 ||
        navigator.appVersion.indexOf('Linux') !== -1) {
        self.globalService.isMac = false
        // not applying emacs key binding while the binding override Ctrl-v. default behavior of paste text on windows.
      }

      let remoteCompleter = {
        getCompletions: function(editor, session, pos, prefix, callback) {
          let langTools = ace.require('ace/ext/language_tools')
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

          $scope.$on('completionList', function(event, data) {
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

      langTools.setCompleters([remoteCompleter, langTools.keyWordCompleter, langTools.snippetCompleter,
        langTools.textCompleter])

      self.editor.setOptions({
        fontSize: self.paragraph.config.fontSize + 'pt',
        enableBasicAutocompletion: true,
        enableSnippets: false,
        enableLiveAutocompletion: false
      })

      /!*self.editor.on('focus', function () {
        self.handleFocus(true)
      })

      self.editor.on('blur', function () {
        self.handleFocus(false)
        self.saveParagraph(self.paragraph)
      })*!/

      self.editor.on('paste', function (e) {
        if (e.text.indexOf('%') === 0) {
          self.pastePercentSign = true
        }
      })

      self.editor.getSession().on('change', function (e, editSession) {
        self.autoAdjustEditorHeight(self.editor)
      })

      self.setParagraphMode(self.editor.getSession(), self.editor.getSession().getValue())

      // autocomplete on '.'
      /!*
      self.editor.commands.on("afterExec", function(e, t) {
        if (e.command.name == "insertstring" && e.args == "." ) {
          var all = e.editor.completers;
          //e.editor.completers = [remoteCompleter];
          e.editor.execCommand("startAutocomplete");
          //e.editor.completers = all;
        }
      });
      *!/

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
          if (!isAllTabs && iCursor.column && isTabCompletion()) {
            self.editor.execCommand('startAutocomplete')
          } else {
            ace.config.loadModule('ace/ext/language_tools', function () {
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
          $scope.$emit('moveFocusToPreviousParagraph', $scope.paragraph.id)
        } else if (currentRow === numRows - 1 && scrollValue >= 0) {
          $scope.$emit('moveFocusToNextParagraph', $scope.paragraph.id)
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
          if (parseInt(angular.element('#' + self.paragraph.id + '_editor > textarea')
              .css('top').replace('px', '')) < 0) {
            let position = self.editor.getCursorPosition()
            let cursorPos = self.editor.renderer.$cursorLayer.getPixelPosition(position, true)
            angular.element('#' + self.paragraph.id + '_editor > textarea').css('top', cursorPos.top)
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
    }*/
  }

  aceChanged() {
    let self = this;
    let session = self.editor.getSession()
    let dirtyText = session.getValue()
    self.dirtyText = dirtyText
    if (self.dirtyText !== self.originalText) {
      //self.startSaveTimer()
    }
    //self.setParagraphMode(session, dirtyText, self.editor.getCursorPosition())
  }

  setParagraphMode(session, paragraphText, pos) {
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
        /*let magic = getInterpreterName(paragraphText)
        if (self.editorSetting.magic !== magic) {
          self.editorSetting.magic = magic
          getEditorSetting(self.paragraph, magic)
            .then(function (setting) {
              setEditorLanguage(session, setting.editor.language)
              _.merge(self.paragraph.config.editorSetting, setting.editor)
            })
        }*/
      }
    }
    self.pastePercentSign = false
    self.setInterpreterBindings = false
  }

  isRunning(paragraph) {
    return isParagraphRunning(paragraph)
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
    return ''
  }

  goToEnd(editor) {
    editor.navigateFileEnd()
  }

  autoAdjustEditorHeight(editor) {
    let height =
      editor.getSession().getScreenLength() *
      editor.renderer.lineHeight +
      editor.renderer.scrollBar.getWidth()

    //angular.element('#' + editor.container.id).height(height.toString() + 'px')
    editor.resize()
  }

  handleFocus(focused, isDigestPass) {
    let self = this;
    self.paragraphFocused = focused

    if (self.editor) { self.editor.setHighlightActiveLine(focused) }

    if (isDigestPass === false || isDigestPass === undefined) {
      // Protect against error in case digest is already running
      /*$timeout(function () {
        // Apply changes since they come from 3rd party library
        $scope.$digest()
      })*/
    }
  }

  //提交片段
  commitParagraph(paragraph) {
    const {
      id,
      title,
      text,
      config,
      settings: {params},
    } = paragraph

    return this.websocketMsgSrv.commitParagraph(id, title, text, config, params,this.notebook.noteId)
  }

  /*ANGULAR_FUNCTION_OBJECT_NAME_PREFIX = '_Z_ANGULAR_FUNC_'

  keys = Object.keys
  parentNote = null
  paragraph = {
    results:{
      msg:[]
    }
  }
  originalText = ''
  editor = null

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

  editorSetting = {}
  // flag that is used to set editor setting on paste percent sign
  pastePercentSign = false
  // flag that is used to set editor setting on save interpreter bindings
  setInterpreterBindings = false

  paragraphScope = $rootScope.$new(true, $rootScope)

  // to keep backward compatibility
  compiledScope = paragraphScope

  paragraphScope.z = {
    // z.runParagraph('20150213-231621_168813393')
    runParagraph: function (paragraphId) {
      if (paragraphId) {
        let filtered = $scope.parentNote.paragraphs.filter(function (x) {
          return x.id === paragraphId
        })
        if (filtered.length === 1) {
          let paragraph = filtered[0]
          websocketMsgSrv.runParagraph(paragraph.id, paragraph.title, paragraph.text,
            paragraph.config, paragraph.settings.params)
        } else {
          /!*ngToast.danger({
            content: 'Cannot find a paragraph with id \'' + paragraphId + '\'',
            verticalPosition: 'top',
            dismissOnTimeout: false
          })*!/
        }
      } else {
        ngToast.danger({
          content: 'Please provide a \'paragraphId\' when calling z.runParagraph(paragraphId)',
          verticalPosition: 'top',
          dismissOnTimeout: false
        })
      }
    },

    // Example: z.angularBind('my_var', 'Test Value', '20150213-231621_168813393')
    angularBind: function (varName, value, paragraphId) {
      // Only push to server if there paragraphId is defined
      if (paragraphId) {
        websocketMsgSrv.clientBindAngularObject($routeParams.noteId, varName, value, paragraphId)
      } else {
        ngToast.danger({
          content: 'Please provide a \'paragraphId\' when calling ' +
          'z.angularBind(varName, value, \'PUT_HERE_PARAGRAPH_ID\')',
          verticalPosition: 'top',
          dismissOnTimeout: false
        })
      }
    },

    // Example: z.angularUnBind('my_var', '20150213-231621_168813393')
    angularUnbind: function (varName, paragraphId) {
      // Only push to server if paragraphId is defined
      if (paragraphId) {
        websocketMsgSrv.clientUnbindAngularObject($routeParams.noteId, varName, paragraphId)
      } else {
        ngToast.danger({
          content: 'Please provide a \'paragraphId\' when calling ' +
          'z.angularUnbind(varName, \'PUT_HERE_PARAGRAPH_ID\')',
          verticalPosition: 'top',
          dismissOnTimeout: false})
      }
    }
  }

  angularObjectRegistry = {}



  isTabCompletion() {
    const completionKey = this.paragraph.config.editorSetting.completionKey
    return completionKey === 'TAB'
  }

  getIframeDimensions() {
    if (this.asIframe) {
      let paragraphid = '#' + $routeParams.paragraphId + '_container'
      let height = angular.element(paragraphid).height()
      return height
    }
    return 0
  }

  /!*$scope.$watch($scope.getIframeDimensions, function (newValue, oldValue) {
    if ($scope.asIframe && newValue) {
      let message = {}
      message.height = newValue
      message.url = $location.$$absUrl
      $window.parent.postMessage(angular.toJson(message), '*')
    }
  })*!/

  getEditor() {
    return this.editor
  }

  /!*$scope.$watch($scope.getEditor, function (newValue, oldValue) {
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
  })*!/

  isEmpty(object) {
    return !object
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

  handleSpellError(paragraphText, error,
                                      digestRequired, propagated) {
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

  /!**
   * - update spell transaction count and
   * - check transaction is finished based on the result count
   * @returns {boolean}
   *!/
  increaseSpellTransactionResultCount() {
    this.spellTransaction.renderedResultCount += 1

    const total = this.spellTransaction.totalResultCount
    const current = this.spellTransaction.renderedResultCount
    return total === current
  }

  cleanupSpellTransaction() {
    const status = ParagraphStatus.FINISHED
    this.paragraph.executor = ParagraphExecutor.NONE
    this.paragraph.status = status
    this.paragraph.results.code = status

    const propagated = this.spellTransaction.propagated
    const resultsMsg = this.spellTransaction.resultsMsg
    const paragraphText = this.spellTransaction.paragraphText

    if (!propagated) {
      this.paragraph.dateFinished = this.getFormattedParagraphTime()
    }

    if (!propagated) {
      const propagable = SpellResult.createPropagable(resultsMsg)
      this.propagateSpellResult(
        this.paragraph.id, this.paragraph.title,
        paragraphText, propagable, status, '',
        this.paragraph.config, this.paragraph.settings.params,
        this.paragraph.dateStarted, this.paragraph.dateFinished)
    }
  }

  runParagraphUsingSpell(paragraphText, magic, digestRequired, propagated) {
    this.paragraph.status = 'RUNNING'
    this.paragraph.executor = ParagraphExecutor.SPELL
    this.paragraph.results = {}
    this.paragraph.errorMessage = ''
    if (digestRequired) { this.$digest() }

    try {
      // remove magic from paragraphText
      const splited = paragraphText.split(magic)
      // remove leading spaces
      const textWithoutMagic = splited[1].replace(/^\s+/g, '')

      if (!propagated) {
        this.paragraph.dateStarted = this.getFormattedParagraphTime()
      }

      // handle actual result message in promise
      heliumService.executeSpell(magic, textWithoutMagic)
        .then(resultsMsg => {
          this.prepareSpellTransaction(resultsMsg, propagated, paragraphText)

          this.paragraph.results.msg = resultsMsg
          this.paragraph.config.tableHide = false
        })
        .catch(error => {
          this.handleSpellError(paragraphText, error,
            digestRequired, propagated)
        })
    } catch (error) {
      this.handleSpellError(paragraphText, error,
        digestRequired, propagated)
    }
  }

  runParagraphUsingBackendInterpreter(paragraphText) {
    this.websocketMsgSrv.runParagraph(this.paragraph.id, this.paragraph.title,
      paragraphText, this.paragraph.config, this.paragraph.settings.params)
  }

  bindBeforeUnload() {
    angular.element(window).off('beforeunload')

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
    angular.element(window).on('beforeunload', confirmOnPageExit)
  }

  unBindBeforeUnload() {
    angular.element(window).off('beforeunload')
  }

  saveParagraph(paragraph) {
    const dirtyText = paragraph.text
    if (dirtyText === undefined || dirtyText === this.originalText) {
      return
    }

    this.bindBeforeUnload()

    this.commitParagraph(paragraph).then(function () {
      this.originalText = dirtyText
      this.dirtyText = undefined
      this.unBindBeforeUnload()
    })
  }

  toggleEnableDisable(paragraph) {
    paragraph.config.enabled = !paragraph.config.enabled
    this.commitParagraph(paragraph)
  }

  /!**
   * @param paragraphText to be parsed
   * @param digestRequired true if calling `$digest` is required
   * @param propagated true if update request is sent from other client
   *!/
  runParagraph(paragraphText, digestRequired, propagated) {
    if (!paragraphText || this.isRunning(this.paragraph)) {
      return
    }
    const magic = SpellResult.extractMagic(paragraphText)

    if (heliumService.getSpellByMagic(magic)) {
      this.runParagraphUsingSpell(paragraphText, magic, digestRequired, propagated)
    } else {
      this.runParagraphUsingBackendInterpreter(paragraphText)
    }

    this.originalText = angular.copy(paragraphText)
    this.dirtyText = undefined

    if (this.paragraph.config.editorSetting.editOnDblClick) {
      this.closeEditorAndOpenTable(this.paragraph)
    } else if (editorSetting.isOutputHidden &&
      !this.paragraph.config.editorSetting.editOnDblClick) {
      // %md/%angular repl make output to be hidden by default after running
      // so should open output if repl changed from %md/%angular to another
      this.openEditorAndOpenTable(this.paragraph)
    }
    editorSetting.isOutputHidden = this.paragraph.config.editorSetting.editOnDblClick
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
    this.$emit('moveParagraphUp', paragraph)
  }

  moveDown(paragraph) {
    this.$emit('moveParagraphDown', paragraph)
  }

  insertNew(position) {
    this.$emit('insertParagraph', this.paragraph.id, position)
  }

  copyPara(position) {
    let editorValue = this.getEditorValue()
    if (editorValue) {
      this.copyParagraph(editorValue, position)
    }
  }

  copyParagraph(data, position) {
    let newIndex = -1
    for (let i = 0; i < this.note.paragraphs.length; i++) {
      if (this.note.paragraphs[i].id === this.paragraph.id) {
        // determine position of where to add new paragraph; default is below
        if (position === 'above') {
          newIndex = i
        } else {
          newIndex = i + 1
        }
        break
      }
    }

    if (newIndex < 0 || newIndex > this.note.paragraphs.length) {
      return
    }

    let config = angular.copy(this.paragraph.config)
    config.editorHide = false

    this.websocketMsgSrv.copyParagraph(newIndex, this.paragraph.title, data,
      config, this.paragraph.settings.params)
  }

  removeParagraph(paragraph) {
    if (this.note.paragraphs.length === 1) {
      BootstrapDialog.alert({
        closable: true,
        message: 'All the paragraphs can\'t be deleted.'
      })
    } else {
      BootstrapDialog.confirm({
        closable: true,
        title: '',
        message: 'Do you want to delete this paragraph?',
        callback: function (result) {
          if (result) {
            console.log('Remove paragraph')
            websocketMsgSrv.removeParagraph(paragraph.id)
            $scope.$emit('moveFocusToNextParagraph', $scope.paragraph.id)
          }
        }
      })
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
    angular.element('.navbar-right.open').removeClass('open')
    paragraph.config.colWidth = width
    this.commitParagraph(paragraph)
  }

  changeFontSize(paragraph, fontSize) {
    angular.element('.navbar-right.open').removeClass('open')
    if (this.editor) {
      this.editor.setOptions({
        fontSize: fontSize + 'pt'
      })
      this.autoAdjustEditorHeight(this.editor)
      paragraph.config.fontSize = fontSize
      this.commitParagraph(paragraph)
    }
  }

  toggleOutput(paragraph) {
    paragraph.config.tableHide = !paragraph.config.tableHide
    this.commitParagraph(paragraph)
  }

  loadForm(formulaire, params) {
    let value = formulaire.defaultValue
    if (params[formulaire.name]) {
      value = params[formulaire.name]
    }

    this.paragraph.settings.params[formulaire.name] = value
  }

  toggleCheckbox(formulaire, option) {
    let idx = this.paragraph.settings.params[formulaire.name].indexOf(option.value)
    if (idx > -1) {
      this.paragraph.settings.params[formulaire.name].splice(idx, 1)
    } else {
      this.paragraph.settings.params[formulaire.name].push(option.value)
    }
  }


  let getEditorSetting = function (paragraph, interpreterName) {
    let deferred = $q.defer()
    if (!$scope.revisionView) {
      websocketMsgSrv.getEditorSetting(paragraph.id, interpreterName)
      $timeout(
        $scope.$on('editorSetting', function (event, data) {
            if (paragraph.id === data.paragraphId) {
              deferred.resolve(data)
            }
          }
        ), 1000)
    }
    return deferred.promise
  }

  let setEditorLanguage = function (session, language) {
    let mode = 'ace/mode/'
    mode += language
    $scope.paragraph.config.editorMode = mode
    session.setMode(mode)
  }





  $rootScope.$on('scrollToCursor', function (event) {
    // scroll on 'scrollToCursor' event only when cursor is in the last paragraph
    let paragraphs = angular.element('div[id$="_paragraphColumn_main"]')
    if (paragraphs[paragraphs.length - 1].id.indexOf($scope.paragraph.id) === 0) {
      $scope.scrollToCursor($scope.paragraph.id, 0)
    }
  })

  /!** scrollToCursor if it is necessary
   * when cursor touches scrollTriggerEdgeMargin from the top (or bottom) of the screen, it autoscroll to place cursor around 1/3 of screen height from the top (or bottom)
   * paragraphId : paragraph that has active cursor
   * lastCursorMove : 1(down), 0, -1(up) last cursor move event
   **!/
  $scope.scrollToCursor = function (paragraphId, lastCursorMove) {
    if (!$scope.editor || !$scope.editor.isFocused()) {
      // only make sense when editor is focused
      return
    }
    let lineHeight = $scope.editor.renderer.lineHeight
    let headerHeight = 103 // menubar, notebook titlebar
    let scrollTriggerEdgeMargin = 50

    let documentHeight = angular.element(document).height()
    let windowHeight = angular.element(window).height()  // actual viewport height

    let scrollPosition = angular.element(document).scrollTop()
    let editorPosition = angular.element('#' + paragraphId + '_editor').offset()
    let position = $scope.editor.getCursorPosition()
    let lastCursorPosition = $scope.editor.renderer.$cursorLayer.getPixelPosition(position, true)

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
    let bodyEl = angular.element('body')
    bodyEl.stop()
    bodyEl.finish()

    // scroll to scrollTargetPos
    bodyEl.scrollTo(scrollTargetPos, {axis: 'y', interrupt: true, duration: 100})
  }

  $scope.getEditorValue = function () {
    return !$scope.editor ? $scope.paragraph.text : $scope.editor.getValue()
  }

  $scope.getProgress = function () {
    return $scope.currentProgress || 0
  }

  $scope.getFormattedParagraphTime = () => {
    return moment().toISOString()
  }


  $scope.parseTableCell = function (cell) {
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



  /!** Utility function *!/
  $scope.goToSingleParagraph = function () {
    let noteId = $route.current.pathParams.noteId
    let redirectToUrl = location.protocol + '//' + location.host + location.pathname + '#/notebook/' + noteId +
      '/paragraph/' + $scope.paragraph.id + '?asIframe'
    $window.open(redirectToUrl)
  }

  $scope.showScrollDownIcon = function (id) {
    let doc = angular.element('#p' + id + '_text')
    if (doc[0]) {
      return doc[0].scrollHeight > doc.innerHeight()
    }
    return false
  }

  $scope.scrollParagraphDown = function (id) {
    let doc = angular.element('#p' + id + '_text')
    doc.animate({scrollTop: doc[0].scrollHeight}, 500)
    $scope.keepScrollDown = true
  }

  $scope.showScrollUpIcon = function (id) {
    if (angular.element('#p' + id + '_text')[0]) {
      return angular.element('#p' + id + '_text')[0].scrollTop !== 0
    }
    return false
  }

  $scope.scrollParagraphUp = function (id) {
    let doc = angular.element('#p' + id + '_text')
    doc.animate({scrollTop: 0}, 500)
    $scope.keepScrollDown = false
  }

  $scope.$on('angularObjectUpdate', function (event, data) {
    let noteId = $route.current.pathParams.noteId
    if (!data.noteId || data.noteId === noteId) {
      let scope
      let registry

      if (!data.paragraphId || data.paragraphId === $scope.paragraph.id) {
        scope = paragraphScope
        registry = angularObjectRegistry
      } else {
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
    }
  })

  $scope.$on('updateParaInfos', function (event, data) {
    if (data.id === $scope.paragraph.id) {
      $scope.paragraph.runtimeInfos = data.infos
    }
  })

  $scope.$on('angularObjectRemove', function (event, data) {
    let noteId = $route.current.pathParams.noteId
    if (!data.noteId || data.noteId === noteId) {
      let scope
      let registry

      if (!data.paragraphId || data.paragraphId === $scope.paragraph.id) {
        scope = paragraphScope
        registry = angularObjectRegistry
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
      if (varName.indexOf(ANGULAR_FUNCTION_OBJECT_NAME_PREFIX) === 0) {
        let funcName = varName.substring((ANGULAR_FUNCTION_OBJECT_NAME_PREFIX).length)
        scope[funcName] = undefined
      }
    }
  })

  /!**
   * @returns {boolean} true if updated is needed
   *!/
  function isUpdateRequired (oldPara, newPara) {
    return (newPara.id === oldPara.id &&
      (newPara.dateCreated !== oldPara.dateCreated ||
        newPara.text !== oldPara.text ||
        newPara.dateFinished !== oldPara.dateFinished ||
        newPara.dateStarted !== oldPara.dateStarted ||
        newPara.dateUpdated !== oldPara.dateUpdated ||
        newPara.status !== oldPara.status ||
        newPara.jobName !== oldPara.jobName ||
        newPara.title !== oldPara.title ||
        isEmpty(newPara.results) !== isEmpty(oldPara.results) ||
        newPara.errorMessage !== oldPara.errorMessage ||
        !angular.equals(newPara.settings, oldPara.settings) ||
        !angular.equals(newPara.config, oldPara.config) ||
        !angular.equals(newPara.runtimeInfos, oldPara.runtimeInfos)))
  }

  updateAllScopeTexts(oldPara, newPara) {
    if (oldPara.text !== newPara.text) {
      if ($scope.dirtyText) {         // check if editor has local update
        if ($scope.dirtyText === newPara.text) {  // when local update is the same from remote, clear local update
          $scope.paragraph.text = newPara.text
          $scope.dirtyText = undefined
          $scope.originalText = angular.copy(newPara.text)
        } else { // if there're local update, keep it.
          $scope.paragraph.text = newPara.text
        }
      } else {
        $scope.paragraph.text = newPara.text
        $scope.originalText = angular.copy(newPara.text)
      }
    }
  }

  $scope.updateParagraphObjectWhenUpdated = function (newPara) {
    // resize col width
    if ($scope.paragraph.config.colWidth !== newPara.config.colWidth) {
      $scope.$broadcast('paragraphResized', $scope.paragraph.id)
    }

    if ($scope.paragraph.config.fontSize !== newPara.config.fontSize) {
      $rootScope.$broadcast('fontSizeChanged', newPara.config.fontSize)
    }

    /!** push the rest *!/
    $scope.paragraph.aborted = newPara.aborted
    $scope.paragraph.user = newPara.user
    $scope.paragraph.dateUpdated = newPara.dateUpdated
    $scope.paragraph.dateCreated = newPara.dateCreated
    $scope.paragraph.dateFinished = newPara.dateFinished
    $scope.paragraph.dateStarted = newPara.dateStarted
    $scope.paragraph.errorMessage = newPara.errorMessage
    $scope.paragraph.jobName = newPara.jobName
    $scope.paragraph.title = newPara.title
    $scope.paragraph.lineNumbers = newPara.lineNumbers
    $scope.paragraph.status = newPara.status
    $scope.paragraph.fontSize = newPara.fontSize
    if (newPara.status !== ParagraphStatus.RUNNING) {
      $scope.paragraph.results = newPara.results
    }
    $scope.paragraph.settings = newPara.settings
    $scope.paragraph.runtimeInfos = newPara.runtimeInfos
    if ($scope.editor) {
      $scope.editor.setReadOnly($scope.isRunning(newPara))
    }

    if (!$scope.asIframe) {
      $scope.paragraph.config = newPara.config
      initializeDefault(newPara.config)
    } else {
      newPara.config.editorHide = true
      newPara.config.tableHide = false
      $scope.paragraph.config = newPara.config
    }
  }

  $scope.updateParagraph = function (oldPara, newPara, updateCallback) {
    // 1. can't update on revision view
    if ($scope.revisionView === true) {
      return
    }

    // 2. get status, refreshed
    const statusChanged = (newPara.status !== oldPara.status)
    const resultRefreshed = (newPara.dateFinished !== oldPara.dateFinished) ||
      isEmpty(newPara.results) !== isEmpty(oldPara.results) ||
      newPara.status === ParagraphStatus.ERROR ||
      (newPara.status === ParagraphStatus.FINISHED && statusChanged)

    // 3. update texts managed by $scope
    $scope.updateAllScopeTexts(oldPara, newPara)

    // 4. execute callback to update result
    updateCallback()

    // 5. update remaining paragraph objects
    $scope.updateParagraphObjectWhenUpdated(newPara)

    // 6. handle scroll down by key properly if new paragraph is added
    if (statusChanged || resultRefreshed) {
      // when last paragraph runs, zeppelin automatically appends new paragraph.
      // this broadcast will focus to the newly inserted paragraph
      const paragraphs = angular.element('div[id$="_paragraphColumn_main"]')
      if (paragraphs.length >= 2 && paragraphs[paragraphs.length - 2].id.indexOf($scope.paragraph.id) === 0) {
        // rendering output can took some time. So delay scrolling event firing for sometime.
        setTimeout(() => { $rootScope.$broadcast('scrollToCursor') }, 500)
      }
    }
  }

  clearSearchSelection() {
    for (let i = 0; i < this.searchRanges.length; ++i) {
      this.editor.session.removeMarker(this.searchRanges[i].markerId)
    }
    searchRanges = []
    if (currentRange.id !== -1) {
      $scope.editor.session.removeMarker(currentRange.markerId)
    }
    currentRange = getCurrentRangeDefault()
  }

  onEditorClick() {
    this.$emit('editorClicked')
  }



  markAllOccurrences(text) {
    clearSearchSelection()
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
  }*/



}
