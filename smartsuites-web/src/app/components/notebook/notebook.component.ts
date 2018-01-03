import { Component, OnInit } from '@angular/core';
import {EventService1} from "../../service/event/event.service";
import {WebsocketMessageService} from "../../service/websocket/websocket-message.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NoteVarShareService} from "../../service/note-var-share/note-var-share.service";
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";
import {GlobalService} from "../../service/global/global.service";
import {Location} from "@angular/common";
import {NoteActionService} from "../../service/note-action/note-action.service";
import {SaveAsService} from "../../service/save-as/save-as.service";
import {isParagraphRunning} from "./paragraph/paragraph.status";
import {ArrayOrderingService} from "../../service/array-ordering/array-ordering.service";
import {Car} from "../../demo/domain/car";
import {isUndefined} from "util";

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.css']
})
export class NotebookComponent implements OnInit {

  /**************** 更新Note名称 START ***************/
  titleEditor = false

  noteName

  editNoteTitle() {
    this.titleEditor = true
  }

  showNoteTitle() {
    this.titleEditor = false
  }

  /** Update the note name */
  updateNoteName(newName) {
    const trimmedNewName = newName.trim()
    if (trimmedNewName.length > 0 && this.note.name !== trimmedNewName) {
      this.note.name = trimmedNewName
      this.websocketMsgSrv.renameNote(this.note.id, this.note.name)
    }
  }

  /**************** 更新Note名称 END ***************/

  //TODO
  TRASH_FOLDER_ID

  //当前Note的ID
  noteId

  //当前的Note实例
  note

  //是否切换编辑状态
  editorToggled = false

  //TODO ?
  tableToggled = false

  //是否只读
  viewOnly = false

  //是否显示配置
  showSetting = false

  //当前Note三种模式
  looknfeelOption = ['default', 'simple', 'report']

  //Cron的表达式
  cronOption = [
    {name: 'None', value: undefined},
    {name: '1m', value: '0 0/1 * * * ?'},
    {name: '5m', value: '0 0/5 * * * ?'},
    {name: '1h', value: '0 0 0/1 * * ?'},
    {name: '3h', value: '0 0 0/3 * * ?'},
    {name: '6h', value: '0 0 0/6 * * ?'},
    {name: '12h', value: '0 0 0/12 * * ?'},
    {name: '1d', value: '0 0 0 * * ?'}
  ]

  formatRevisionDate(date) {
    //return moment.unix(date).format('MMMM Do YYYY, h:mm a')
  }

  paragraphUrl

  asIframe

  interpreterSettings = []
  interpreterBindings = []
  interpreterBindingsOrig = []

  isNoteDirty = null
  saveTimer = null
  paragraphWarningDialog = {}

  permissions
  isOwner

  allowLeave

  connectedOnce = false
  isRevisionPath(path) {
    let pattern = new RegExp('^.*\/notebook\/[a-zA-Z0-9_]*\/revision\/[a-zA-Z0-9_]*')
    return pattern.test(path)
  }

  noteRevisions = []
  currentRevision = 'Head'
  revisionView = this.isRevisionPath(this.location.path())

  showPermissions

  search = {
    searchText: '',
    occurrencesExists: false,
    needHighlightFirst: false,
    occurrencesHidden: false,
    replaceText: '',
    needToSendNextOccurrenceAfterReplace: false,
    occurrencesCount: 0,
    currentOccurrence: 0,
    searchBoxOpened: false,
    searchBoxWidth: 350,
    left: '0px'
  }
  currentSearchParagraph = 0

  isAnonymous

  /*$scope.$watch('note', function (value) {
    $rootScope.pageTitle = value ? value.name : 'Zeppelin'
  }, true)*/

  getCronOptionNameFromValue(value) {
    if (!value) {
      return ''
    }

    for (let o in this.cronOption) {
      if (this.cronOption[o].value === value) {
        return this.cronOption[o].name
      }
    }
    return value
  }

  blockAnonUsers() {
    let zeppelinVersion = this.globalService.dataSmartVersion
    let url = 'https://zeppelin.apache.org/docs/' + zeppelinVersion + '/security/notebook_authorization.html'
    let content = 'Only authenticated user can set the permission.' +
      '<a data-toggle="tooltip" data-placement="top" title="Learn more" target="_blank" href=' + url + '>' +
      '<i class="icon-question" />' +
      '</a>'
    /*BootstrapDialog.show({
      closable: false,
      closeByBackdrop: false,
      closeByKeyboard: false,
      title: 'No permission',
      message: content,
      buttons: [{
        label: 'Close',
        action: function (dialog) {
          dialog.close()
        }
      }]
    })*/
  }


  focusParagraphOnClick(clickEvent) {
    if (!this.note) {
      return
    }
    /*for (let i = 0; i < this.note.paragraphs.length; i++) {
      let paragraphId = this.note.paragraphs[i].id
      if (jQuery.contains(angular.element('#' + paragraphId + '_container')[0], clickEvent.target)) {

        // 发送片段聚焦事件，
        $scope.$broadcast('focusParagraph', paragraphId, 0, true)
        break
      }
    }*/
  }

  // register mouseevent handler for focus paragraph
  //document.addEventListener('click', $scope.focusParagraphOnClick)

  keyboardShortcut(keyEvent) {
    // handle keyevent
    if (!this.viewOnly && !this.revisionView) {
      this.eventService.broadcast('keyEvent', keyEvent)
    }
  }

  // register mouseevent handler for focus paragraph
  //document.addEventListener('keydown', this.keyboardShortcut)

  //片段双击事件
  paragraphOnDoubleClick(paragraphId) {
    this.eventService.broadcast('doubleClickParagraph', paragraphId)
  }

  // Move the note to trash and go back to the main page
  moveNoteToTrash(noteId) {
    this.noteActionService.moveNoteToTrash(noteId, true)
  }

  // Remove the note permanently if it's in the trash
  removeNote(noteId) {
    this.noteActionService.removeNote(noteId, true)
  }

  isTrash(note) {
    return note ? note.name.split('/')[0] === this.TRASH_FOLDER_ID : false
  }

  // Export notebook
  exportNote() {
    let jsonContent = JSON.stringify(this.note)
    this.saveAsService.saveAs(jsonContent, this.note.name, 'json')
  }

  // Clone note
  cloneNote(noteId) {
    let self = this;
    /*BootstrapDialog.confirm({
      closable: true,
      title: '',
      message: 'Do you want to clone this note?',
      callback: function (result) {
        if (result) {
          self.websocketMsgSrv.cloneNote(noteId)
          $location.path('/')
        }
      }
    })*/
  }

  // checkpoint/commit notebook
  checkpointNote(commitMessage) {
    let self = this;
    /*BootstrapDialog.confirm({
      closable: true,
      title: '',
      message: 'Commit note to current repository?',
      callback: function (result) {
        if (result) {
          self.websocketMsgSrv.checkpointNote($routeParams.noteId, commitMessage)
        }
      }
    })
    document.getElementById('note.checkpoint.message').value = ''*/
  }

  // set notebook head to given revision
  setNoteRevision() {
    let self = this;
    /*BootstrapDialog.confirm({
      closable: true,
      title: '',
      message: 'Set notebook head to current revision?',
      callback: function (result) {
        if (result) {
          websocketMsgSrv.setNoteRevision($routeParams.noteId, $routeParams.revisionId)
        }
      }
    })*/
  }

  visitRevision(revision) {
    if (revision.id) {
      if (revision.id === 'Head') {
        this.location.go('/notebook/' + this.noteId)
      } else {
        this.location.go('/notebook/' + this.noteId + '/revision/' + revision.id)
      }
    } else {
      /*ngToast.danger({content: 'There is a problem with this Revision',
        verticalPosition: 'top',
        dismissOnTimeout: false
      })*/
    }
  }

  runAllParagraphs(noteId) {
    /*BootstrapDialog.confirm({
      closable: true,
      title: '',
      message: 'Run all paragraphs?',
      callback: function (result) {
        if (result) {
          const paragraphs = $scope.note.paragraphs.map(p => {
            return {
              id: p.id,
              title: p.title,
              paragraph: p.text,
              config: p.config,
              params: p.settings.params
            }
          })
          websocketMsgSrv.runAllParagraphs(noteId, paragraphs)
        }
      }
    })*/
  }

  saveNote() {
    /*if (this.note && this.note.paragraphs) {
      _.forEach(this.note.paragraphs, function (par) {
        angular
          .element('#' + par.id + '_paragraphColumn_main')
          .scope()
          .saveParagraph(par)
      })
      this.isNoteDirty = null
    }*/
  }

  clearAllParagraphOutput(noteId) {
    this.noteActionService.clearAllParagraphOutput(noteId)
  }

  toggleAllEditor() {
    if (this.editorToggled) {
      this.eventService.broadcast('openEditor')
    } else {
      this.eventService.broadcast('closeEditor')
    }
    this.editorToggled = !this.editorToggled
  }

  showAllEditor() {
    this.eventService.broadcast('openEditor')
  }

  hideAllEditor() {
    this.eventService.broadcast('closeEditor')
  }

  toggleAllTable() {
    if (this.tableToggled) {
      this.eventService.broadcast('openTable')
    } else {
      this.eventService.broadcast('closeTable')
    }
    this.tableToggled = !this.tableToggled
  }

  showAllTable() {
    this.eventService.broadcast('openTable')
  }

  hideAllTable() {
    this.eventService.broadcast('closeTable')
  }

  /**
   * @returns {boolean} true if one more paragraphs are running. otherwise return false.
   */
  isNoteRunning() {
    if (!this.note) { return false }

    for (let i = 0; i < this.note.paragraphs.length; i++) {
      if (isParagraphRunning(this.note.paragraphs[i])) {
        return true
      }
    }

    return false
  }

  killSaveTimer() {
    if (this.saveTimer) {
      //$timeout.cancel(this.saveTimer)
      this.saveTimer = null
    }
  }

  startSaveTimer() {
    this.killSaveTimer()
    this.isNoteDirty = true
    // console.log('startSaveTimer called ' + $scope.note.id);
    /*this.saveTimer = $timeout(function () {
      this.saveNote()
    }, 10000)*/
  }

  setLookAndFeel(looknfeel) {
    this.note.config.looknfeel = looknfeel
    if (this.revisionView === true) {
      this.eventService.broadcast('setLookAndFeel', this.note.config.looknfeel)
    } else {
      //this.setConfig()
    }
  }

  /** Set cron expression for this note **/
  setCronScheduler(cronExpr) {
    if (cronExpr) {
      if (!this.note.config.cronExecutingUser) {
        this.note.config.cronExecutingUser = this.globalService.ticket.principal
      }
    } else {
      this.note.config.cronExecutingUser = ''
    }
    this.note.config.cron = cronExpr
    //this.setConfig()
  }

  /** Set the username of the user to be used to execute all notes in notebook **/
  setCronExecutingUser(cronExecutingUser) {
    this.note.config.cronExecutingUser = cronExecutingUser
    //this.setConfig()
  }

  /** Set release resource for this note **/
  setReleaseResource(value) {
    this.note.config.releaseresource = value
    //this.setConfig()
  }

  /** Update note config **/
  setConfig(config) {
    if (config) {
      this.note.config = config
    }
    this.websocketMsgSrv.updateNote(this.note.id, this.note.name, this.note.config)
  }



  cleanParagraphExcept(paragraphId, note) {
    /*let noteCopy = {}
    noteCopy.id = note.id
    noteCopy.name = note.name
    noteCopy.config = note.config
    noteCopy.info = note.info
    noteCopy.paragraphs = []
    for (let i = 0; i < note.paragraphs.length; i++) {
      if (note.paragraphs[i].id === paragraphId) {
        noteCopy.paragraphs[0] = note.paragraphs[i]
        if (!noteCopy.paragraphs[0].config) {
          noteCopy.paragraphs[0].config = {}
        }
        noteCopy.paragraphs[0].config.editorHide = true
        noteCopy.paragraphs[0].config.tableHide = false
        break
      }
    }
    return noteCopy*/
  }

  addPara(paragraph, index) {
    this.note.paragraphs.splice(index, 0, paragraph)
    this.note.paragraphs.map(para => {
      if (para.id === paragraph.id) {
        para.focus = true

        // we need `$timeout` since angular DOM might not be initialized
        //$timeout(() => { this.eventService.broadcast('focusParagraph', para.id, 0, false) })
      }
    })
  }

  removePara(paragraphId) {
    let removeIdx
    /*_.each(this.note.paragraphs, function (para, idx) {
      if (para.id === paragraphId) {
        removeIdx = idx
      }
    })*/
    return this.note.paragraphs.splice(removeIdx, 1)
  }

  interpreterSelectionListeners = {
    accept: function (sourceItemHandleScope, destSortableScope) { return true },
    itemMoved: function (event) {},
    orderChanged: function (event) {}
  }

  openSetting() {
    this.showSetting = true
    this.getInterpreterBindings()
  }

  closeSetting() {
    if (this.isSettingDirty()) {
      /*BootstrapDialog.confirm({
        closable: true,
        title: '',
        message: 'Interpreter setting changes will be discarded.',
        callback: function (result) {
          if (result) {
            $scope.$apply(function () {
              $scope.showSetting = false
            })
          }
        }
      })*/
    } else {
      this.showSetting = false
    }
  }

  saveSetting() {
    let self = this;
    let selectedSettingIds = []
    for (let no in this.interpreterBindings) {
      let setting = this.interpreterBindings[no]
      if (setting.selected) {
        selectedSettingIds.push(setting.id)
      }
    }
    this.websocketMsgSrv.saveInterpreterBindings(this.note.id, selectedSettingIds)
    console.log('Interpreter bindings %o saved', selectedSettingIds)

    /*_.forEach(this.note.paragraphs, function (n, key) {
      let regExp = /^\s*%/g
      if (n.text && !regExp.exec(n.text)) {
        self.eventService.broadcast('saveInterpreterBindings', n.id)
      }
    })*/

    this.showSetting = false
  }

  toggleSetting = function () {
    if (this.showSetting) {
      this.closeSetting()
    } else {
      this.openSetting()
      this.closePermissions()
      //angular.element('html, body').animate({ scrollTop: 0 }, 'slow')
    }
  }

  openPermissions() {
    this.showPermissions = true
    this.getPermissions(console.log())
  }

  closePermissions() {
    if (this.isPermissionsDirty()) {
      /*BootstrapDialog.confirm({
        closable: true,
        title: '',
        message: 'Changes will be discarded.',
        callback: function (result) {
          if (result) {
            $scope.$apply(function () {
              $scope.showPermissions = false
            })
          }
        }
      })*/
    } else {
      this.showPermissions = false
    }
  }

  convertPermissionsToArray () {
    /*$scope.permissions.owners = angular.element('#selectOwners').val()
    $scope.permissions.readers = angular.element('#selectReaders').val()
    $scope.permissions.runners = angular.element('#selectRunners').val()
    $scope.permissions.writers = angular.element('#selectWriters').val()
    angular.element('.permissionsForm select').find('option:not([is-select2="false"])').remove()*/
  }

  hasMatches = function() {
    return this.search.occurrencesCount > 0
  }

  markAllOccurrences() {
    this.search.occurrencesCount = 0
    this.search.occurrencesHidden = false
    this.currentSearchParagraph = 0
    this.eventService.broadcast('markAllOccurrences', this.search.searchText)
    this.search.currentOccurrence = this.search.occurrencesCount > 0 ? 1 : 0
  }

  markAllOccurrencesAndHighlightFirst() {
    this.search.needHighlightFirst = true
    this.markAllOccurrences()
  }

  increaseCurrentOccurence() {
    ++this.search.currentOccurrence
    if (this.search.currentOccurrence > this.search.occurrencesCount) {
      this.search.currentOccurrence = 1
    }
  }

  decreaseCurrentOccurence() {
    --this.search.currentOccurrence
    if (this.search.currentOccurrence === 0) {
      this.search.currentOccurrence = this.search.occurrencesCount
    }
  }

  sendNextOccurrenceMessage() {
    if (this.search.occurrencesCount === 0) {
      this.markAllOccurrences()
      if (this.search.occurrencesCount === 0) {
        return
      }
    }
    if (this.search.occurrencesHidden) {
      this.markAllOccurrences()
    }
    this.eventService.broadcast('nextOccurrence', this.note.paragraphs[this.currentSearchParagraph].id)
  }

  sendPrevOccurrenceMessage() {
    if (this.search.occurrencesCount === 0) {
      this.markAllOccurrences()
      if (this.search.occurrencesCount === 0) {
        return
      }
    }
    if (this.search.occurrencesHidden) {
      this.markAllOccurrences()
      this.currentSearchParagraph = this.note.paragraphs.length - 1
    }
    this.eventService.broadcast('prevOccurrence', this.note.paragraphs[this.currentSearchParagraph].id)
  }

  increaseCurrentSearchParagraph() {
    ++this.currentSearchParagraph
    if (this.currentSearchParagraph >= this.note.paragraphs.length) {
      this.currentSearchParagraph = 0
    }
  }

  decreaseCurrentSearchParagraph() {
    --this.currentSearchParagraph
    if (this.currentSearchParagraph === -1) {
      this.currentSearchParagraph = this.note.paragraphs.length - 1
    }
  }

  nextOccurrence() {
    this.sendNextOccurrenceMessage()
    this.increaseCurrentOccurence()
  }

  prevOccurrence() {
    this.sendPrevOccurrenceMessage()
    this.decreaseCurrentOccurence()
  }

  replace() {
    if (this.search.occurrencesCount === 0) {
      this.markAllOccurrencesAndHighlightFirst()
      if (this.search.occurrencesCount === 0) {
        return
      }
    }
    if (this.search.occurrencesHidden) {
      this.markAllOccurrencesAndHighlightFirst()
      return
    }
    this.eventService.broadcast('replaceCurrent', this.search.searchText, this.search.replaceText)
    if (this.search.needToSendNextOccurrenceAfterReplace) {
      this.sendNextOccurrenceMessage()
      this.search.needToSendNextOccurrenceAfterReplace = false
    }
  }

  replaceAll() {
    if (this.search.occurrencesCount === 0) {
      return
    }
    if (this.search.occurrencesHidden) {
      this.markAllOccurrencesAndHighlightFirst()
    }
    this.eventService.broadcast('replaceAll', this.search.searchText, this.search.replaceText)
    this.markAllOccurrencesAndHighlightFirst()
  }

  onPressOnFindInput(event) {
    if (event.keyCode === 13) {
      this.nextOccurrence()
    }
  }

  makeSearchBoxVisible() {
    if (this.search.searchBoxOpened) {
      this.search.searchBoxOpened = false
      console.log('make 0')
      this.search.left = '0px'
    } else {
      this.search.searchBoxOpened = true
      //let searchGroupRect = angular.element('#searchGroup')[0].getBoundingClientRect()
      console.log('make visible')
      //let dropdownRight = searchGroupRect.left + this.search.searchBoxWidth
      /*console.log(dropdownRight + ' ' + window.innerWidth)
      if (dropdownRight + 5 > window.innerWidth) {
        this.search.left = window.innerWidth - dropdownRight - 15 + 'px'
      }*/
    }
  }

  searchClicked() {
    this.makeSearchBoxVisible()
  }

  restartInterpreter(interpreter) {
    /*const thisConfirm = BootstrapDialog.confirm({
      closable: false,
      closeByBackdrop: false,
      closeByKeyboard: false,
      title: '',
      message: 'Do you want to restart ' + interpreter.name + ' interpreter?',
      callback: function(result) {
        if (result) {
          let payload = {
            'noteId': $scope.note.id
          }

          thisConfirm.$modalFooter.find('button').addClass('disabled')
          thisConfirm.$modalFooter.find('button:contains("OK")')
            .html('<i class="fa fa-circle-o-notch fa-spin"></i> Saving Setting')

          $http.put(baseUrlSrv.getRestApiBase() + '/interpreter/setting/restart/' + interpreter.id, payload)
            .success(function(data, status, headers, config) {
              let index = _.findIndex($scope.interpreterSettings, {'id': interpreter.id})
              $scope.interpreterSettings[index] = data.body
              thisConfirm.close()
            }).error(function (data, status, headers, config) {
            thisConfirm.close()
            console.log('Error %o %o', status, data.message)
            BootstrapDialog.show({
              title: 'Error restart interpreter.',
              message: data.message
            })
          })
          return false
        }
      }
    })*/
  }

  savePermissions() {
    if (this.isAnonymous || this.globalService.ticket.principal.trim().length === 0) {
      this.blockAnonUsers()
    }
    this.convertPermissionsToArray()
    if (this.isOwnerEmpty()) {
      /*BootstrapDialog.show({
        closable: false,
        title: 'Setting Owners Permissions',
        message: 'Please fill the [Owners] field. If not, it will set as current user.\n\n' +
        'Current user : [ ' + $rootScope.ticket.principal + ']',
        buttons: [
          {
            label: 'Set',
            action: function(dialog) {
              dialog.close()
              $scope.permissions.owners = [$rootScope.ticket.principal]
              $scope.setPermissions()
            }
          },
          {
            label: 'Cancel',
            action: function(dialog) {
              dialog.close()
              $scope.openPermissions()
            }
          }
        ]
      })*/
    } else {
      this.setPermissions()
    }
  }

  setPermissions() {
    /*$http.put(this.baseUrlSrv.getRestApiBase() + '/notebook/' + this..note.id + '/permissions',
      $scope.permissions, {withCredentials: true})
      .success(function (data, status, headers, config) {
        getPermissions(function () {
          console.log('Note permissions %o saved', $scope.permissions)
          BootstrapDialog.alert({
            closable: true,
            title: 'Permissions Saved Successfully',
            message: 'Owners : ' + $scope.permissions.owners + '\n\n' + 'Readers : ' +
            $scope.permissions.readers + '\n\n' + 'Runners : ' + $scope.permissions.runners +
            '\n\n' + 'Writers  : ' + $scope.permissions.writers
          })
          $scope.showPermissions = false
        })
      })
      .error(function (data, status, headers, config) {
        console.log('Error %o %o', status, data.message)
        BootstrapDialog.show({
          closable: false,
          closeByBackdrop: false,
          closeByKeyboard: false,
          title: 'Insufficient privileges',
          message: data.message,
          buttons: [
            {
              label: 'Login',
              action: function (dialog) {
                dialog.close()
                angular.element('#loginModal').modal({
                  show: 'true'
                })
              }
            },
            {
              label: 'Cancel',
              action: function (dialog) {
                dialog.close()
                $location.path('/')
              }
            }
          ]
        })
      })*/
  }

  togglePermissions() {
    let principal = this.globalService.ticket.principal
    this.isAnonymous = principal === 'anonymous' ? true : false
    if (!!principal && this.isAnonymous) {
      this.blockAnonUsers()
    } else {
      if (this.showPermissions) {
        this.closePermissions()
        /*angular.element('#selectOwners').select2({})
        angular.element('#selectReaders').select2({})
        angular.element('#selectRunners').select2({})
        angular.element('#selectWriters').select2({})*/
      } else {
        this.openPermissions()
        this.closeSetting()
      }
    }
  }

  toggleNotePersonalizedMode() {
    let personalizedMode = this.note.config.personalizedMode
    if (this.isOwner) {
      /*BootstrapDialog.confirm({
        closable: true,
        title: 'Setting the result display',
        message: function (dialog) {
          let modeText = $scope.note.config.personalizedMode === 'true' ? 'collaborate' : 'personalize'
          return 'Do you want to <span class="text-info">' + modeText + '</span> your analysis?'
        },
        callback: function (result) {
          if (result) {
            if ($scope.note.config.personalizedMode === undefined) {
              $scope.note.config.personalizedMode = 'false'
            }
            $scope.note.config.personalizedMode = personalizedMode === 'true' ? 'false' : 'true'
            websocketMsgSrv.updatePersonalizedMode($scope.note.id, $scope.note.config.personalizedMode)
          }
        }
      })*/
    }
  }

  isSettingDirty() {
    /*if (angular.equals($scope.interpreterBindings, $scope.interpreterBindingsOrig)) {
      return false
    } else {
      return true
    }*/
  }

  isPermissionsDirty() {
    /*if (angular.equals($scope.permissions, $scope.permissionsOrig)) {
      return false
    } else {
      return true
    }*/
  }

  /*angular.element(document).click(function () {
    angular.element('.ace_autocomplete').hide()
  })*/

  isOwnerEmpty() {
    if (this.permissions.owners.length > 0) {
      for (let i = 0; i < this.permissions.owners.length; i++) {
        if (this.permissions.owners[i].trim().length > 0) {
          return false
        } else if (i === this.permissions.owners.length - 1) {
          return true
        }
      }
    } else {
      return true
    }
  }

  showParagraphWarning(next) {
    /*if (this.paragraphWarningDialog.opened !== true) {
      this.paragraphWarningDialog = BootstrapDialog.show({
        closable: false,
        closeByBackdrop: false,
        closeByKeyboard: false,
        title: 'Do you want to leave this site?',
        message: 'Changes that you have made will not be saved.',
        buttons: [{
          label: 'Stay',
          action: function (dialog) {
            dialog.close()
          }
        }, {
          label: 'Leave',
          action: function (dialog) {
            dialog.close()
            let locationToRedirect = next['$$route']['originalPath']
            Object.keys(next.pathParams).map(key => {
              locationToRedirect = locationToRedirect.replace(':' + key,
                next.pathParams[key])
            })
            $scope.allowLeave = true
            $location.path(locationToRedirect)
          }
        }]
      })
    }*/
  }

  /*angular.element(window).bind('resize', function () {
    const actionbarHeight = document.getElementById('actionbar').lastElementChild.clientHeight
    angular.element(document.getElementById('content')).css('padding-top', actionbarHeight - 20)
  })*/

  constructor(private eventService:EventService1,
              private websocketMsgSrv:WebsocketMessageService,
              private route:ActivatedRoute,
              private noteVarShareService:NoteVarShareService,
              private router:Router,
              private httpClient:HttpClient,
              private baseUrlSrv:BaseUrlService,
              private globalService:GlobalService,
              private location:Location,
              private noteActionService:NoteActionService,
              private saveAsService:SaveAsService,
              private arrayOrderingSrv:ArrayOrderingService) {

    this.note = {}
  }

  orderListCars: Car[];

  getNoteName(note) {
    if (note) {
      return this.arrayOrderingSrv.getNoteName(note)
    }
  }

  ngOnInit(): void {

    this.orderListCars = [
      {vin: 'r3278r2', year: 2010, brand: 'Audi', color: 'Black'},
      {vin: 'jhto2g2', year: 2015, brand: 'BMW', color: 'White'},
      {vin: 'h453w54', year: 2012, brand: 'Honda', color: 'Blue'},
      {vin: 'g43gwwg', year: 1998, brand: 'Renault', color: 'White'},
      {vin: 'gf45wg5', year: 2011, brand: 'VW', color: 'Red'},
      {vin: 'bhv5y5w', year: 2015, brand: 'Jaguar', color: 'Blue'},
      {vin: 'ybw5fsd', year: 2012, brand: 'Ford', color: 'Yellow'},
      {vin: '45665e5', year: 2011, brand: 'Mercedes', color: 'Brown'},
      {vin: 'he6sb5v', year: 2015, brand: 'Ford', color: 'Black'}
    ];

    let self = this;
    this.route.params.subscribe((params: Params) => {
      this.noteId = params['noteId']

      //设置Note内容获取到的回调
      this.eventService.subscribe('setNoteContent', function (note) {
        self.initNoteContent(note)
      })

      //设置Bingding信息获取到的回调
      this.eventService.subscribe('interpreterBindings', function (data) {
        self.callbackInterpreterBindings(data)
      })

      // 监听Websocket的连接状态
      this.eventService.subscribe('setConnectedStatus', function (msg) {
        if (self.connectedOnce && msg) {
          self.initNotebook()
        }
        self.connectedOnce = true
      })

      this.eventService.subscribe('listRevisionHistory', function (data) {
        console.debug('received list of revisions %o', data)
        /*this.noteRevisions = data.revisionList
        this.noteRevisions.splice(0, 0, {
          id: 'Head',
          message: 'Head'
        })
        if ($routeParams.revisionId) {
          let index = _.findIndex(this.noteRevisions, {'id': $routeParams.revisionId})
          if (index > -1) {
            this.currentRevision = this.noteRevisions[index].message
          }
        }*/
      })

      this.eventService.subscribe('noteRevision', function (data) {
        console.log('received note revision %o', data)
        if (data.note) {
          this.note = data.note
          this.initializeLookAndFeel()
        } else {
          self.location.go('/')
        }
      })

      this.eventService.subscribe('setNoteRevisionResult', function (data) {
        console.log('received set note revision result %o', data)
        if (data.status) {
          self.location.go('/notebook/' + self.noteId)
        }
      })

      this.eventService.subscribe('addParagraph', function (event, paragraph, index) {
        if (self.paragraphUrl || self.revisionView === true) {
          return
        }
        self.addPara(paragraph, index)
      })

      this.eventService.subscribe('removeParagraph', function (event, paragraphId) {
        if (self.paragraphUrl || self.revisionView === true) {
          return
        }
        self.removePara(paragraphId)
      })

      this.eventService.subscribe('moveParagraph', function (event, paragraphId, newIdx) {
        if (self.revisionView === true) {
          return
        }
        let removedPara = self.removePara(paragraphId)
        if (removedPara && removedPara.length === 1) {
          self.addPara(removedPara[0], newIdx)
        }
      })

      this.eventService.subscribe('updateNote', function (event, name, config, info) {
        /** update Note name */
        if (name !== self.note.name) {
          console.log('change note name to : %o', self.note.name)
          self.note.name = name
        }
        self.note.config = config
        self.note.info = info
        self.initializeLookAndFeel()
      })

      this.eventService.subscribe('occurrencesExists', function(event, count) {
        self.search.occurrencesCount += count
        if (self.search.needHighlightFirst) {
          self.sendNextOccurrenceMessage()
          self.search.needHighlightFirst = false
        }
      })

      this.eventService.subscribe('noNextOccurrence', function(event) {
        this.increaseCurrentSearchParagraph()
        this.sendNextOccurrenceMessage()
      })

      this.eventService.subscribe('noPrevOccurrence', function(event) {
        self.decreaseCurrentSearchParagraph()
        self.sendPrevOccurrenceMessage()
      })

      this.eventService.subscribe('editorClicked', function() {
        self.search.occurrencesHidden = true
        self.eventService.broadcast('unmarkAll')
      })

      this.eventService.subscribe('occurrencesCountChanged', function(event, cnt) {
        self.search.occurrencesCount += cnt
        if (self.search.occurrencesCount === 0) {
          self.search.currentOccurrence = 0
        } else {
          self.search.currentOccurrence += cnt + 1
          if (self.search.currentOccurrence > self.search.occurrencesCount) {
            self.search.currentOccurrence = 1
          }
        }
      })

      this.eventService.subscribe('noNextOccurrenceAfterReplace', function() {
        self.search.occurrencesCount = 0
        self.search.needHighlightFirst = false
        self.search.needToSendNextOccurrenceAfterReplace = false
        self.eventService.broadcast('checkOccurrences')
        self.increaseCurrentSearchParagraph()
        if (self.search.occurrencesCount > 0) {
          self.search.needToSendNextOccurrenceAfterReplace = true
        }
      })

      this.eventService.subscribe('toggleSearchBox', function() {
        /*let elem = angular.element('#searchGroup')
        if (self.search.searchBoxOpened) {
          elem.removeClass('open')
        } else {
          elem.addClass('open')
        }
        $timeout(self.makeSearchBoxVisible())*/
      })

      this.eventService.subscribe('moveParagraphUp', function (paragraph) {
        let newIndex = -1
        for (let i = 0; i < self.note.paragraphs.length; i++) {
          if (self.note.paragraphs[i].id === paragraph.id) {
            newIndex = i - 1
            break
          }
        }
        if (newIndex < 0 || newIndex >= self.note.paragraphs.length) {
          return
        }
        // save dirtyText of moving paragraphs.
        let prevParagraph = self.note.paragraphs[newIndex]
        /*angular
          .element('#' + paragraph.id + '_paragraphColumn_main')
          .scope()
          .saveParagraph(paragraph)
        angular
          .element('#' + prevParagraph.id + '_paragraphColumn_main')
          .scope()
          .saveParagraph(prevParagraph)*/
        self.websocketMsgSrv.moveParagraph(paragraph.id, newIndex)
      })

      this.eventService.subscribe('moveParagraphDown', function (event, paragraph) {
        let newIndex = -1
        for (let i = 0; i < self.note.paragraphs.length; i++) {
          if (self.note.paragraphs[i].id === paragraph.id) {
            newIndex = i + 1
            break
          }
        }

        if (newIndex < 0 || newIndex >= self.note.paragraphs.length) {
          return
        }
        // save dirtyText of moving paragraphs.
        let nextParagraph = self.note.paragraphs[newIndex]
        /*angular
          .element('#' + paragraph.id + '_paragraphColumn_main')
          .scope()
          .saveParagraph(paragraph)
        angular
          .element('#' + nextParagraph.id + '_paragraphColumn_main')
          .scope()
          .saveParagraph(nextParagraph)*/
        self.websocketMsgSrv.moveParagraph(paragraph.id, newIndex)
      })

      this.eventService.subscribe('moveFocusToPreviousParagraph', function (event, currentParagraphId) {
        let focus = false
        for (let i = self.note.paragraphs.length - 1; i >= 0; i--) {
          if (focus === false) {
            if (self.note.paragraphs[i].id === currentParagraphId) {
              focus = true
              continue
            }
          } else {
            self.eventService.broadcast('focusParagraph', self.note.paragraphs[i].id, -1)
            break
          }
        }
      })

      this.eventService.subscribe('moveFocusToNextParagraph', function (event, currentParagraphId) {
        let focus = false
        for (let i = 0; i < self.note.paragraphs.length; i++) {
          if (focus === false) {
            if (self.note.paragraphs[i].id === currentParagraphId) {
              focus = true
              continue
            }
          } else {
            self.eventService.broadcast('focusParagraph', self.note.paragraphs[i].id, 0)
            break
          }
        }
      })

      this.eventService.subscribe('insertParagraph', function (event, paragraphId, position) {
        if (self.revisionView === true) {
          return
        }
        let newIndex = -1
        for (let i = 0; i < self.note.paragraphs.length; i++) {
          if (self.note.paragraphs[i].id === paragraphId) {
            // determine position of where to add new paragraph; default is below
            if (position === 'above') {
              newIndex = i
            } else {
              newIndex = i + 1
            }
            break
          }
        }

        if (newIndex < 0 || newIndex > self.note.paragraphs.length) {
          return
        }
        self.websocketMsgSrv.insertParagraph(newIndex)
      })

      this.eventService.subscribe('$routeChangeStart', function (event, next, current) {
        if (!self.note || !self.note.paragraphs) {
          return
        }
        if (self.note && self.note.paragraphs) {
          self.note.paragraphs.map(par => {
            if (self.allowLeave === true) {
              return
            }
            /*let thisScope = angular.element(
              '#' + par.id + '_paragraphColumn_main').scope()

            if (thisScope.dirtyText === undefined ||
              thisScope.originalText === undefined ||
              thisScope.dirtyText === thisScope.originalText) {
              return true
            } else {
              event.preventDefault()
              self.showParagraphWarning(next)
            }*/
          })
        }
      })

      this.eventService.subscribe('$destroy', function () {
        //angular.element(window).off('beforeunload')
        self.killSaveTimer()
        self.saveNote()

        document.removeEventListener('click', self.focusParagraphOnClick)
        document.removeEventListener('keydown', self.keyboardShortcut)
      })

      this.eventService.subscribe('$unBindKeyEvent', function () {
        document.removeEventListener('click', self.focusParagraphOnClick)
        document.removeEventListener('keydown', self.keyboardShortcut)
      })

      this.initNotebook()
    })
  }

  /** 初始化笔记 */
  initNotebook():void {
    this.noteVarShareService.clear()
    /*if ($routeParams.revisionId) {
      websocketMsgSrv.getNoteByRevision($routeParams.noteId, $routeParams.revisionId)
    } else {
      websocketMsgSrv.getNote($routeParams.noteId)
    }*/
    this.websocketMsgSrv.getNote(this.noteId)

    /*this.websocketMsgSrv.listRevisionHistory($routeParams.noteId)
    let currentRoute = $route.current
    if (currentRoute) {
      setTimeout(
        function () {
          let routeParams = currentRoute.params
          let $id = angular.element('#' + routeParams.paragraph + '_container')

          if ($id.length > 0) {
            // adjust for navbar
            let top = $id.offset().top - 103
            angular.element('html, body').scrollTo({top: top, left: 0})
          }
        },
        1000
      )
    }*/
  }

  /** 初始化Note */
  initNoteContent(note):void {
    if (note === undefined) {
      this.router.navigate(['/login']);
    }

    this.note = note[0]
    this.noteName = this.getNoteName(this.note)
    /*$scope.paragraphUrl = $routeParams.paragraphId
    $scope.asIframe = $routeParams.asIframe*/

    if (this.paragraphUrl) {
      /*$scope.note = cleanParagraphExcept($scope.paragraphUrl, $scope.note)
      $scope.$broadcast('$unBindKeyEvent', $scope.$unBindKeyEvent)
      $rootScope.$broadcast('setIframe', $scope.asIframe)
      initializeLookAndFeel()*/
      return
    }

    this.initializeLookAndFeel()

    // open interpreter binding setting when there're none selected
    this.getInterpreterBindings()
    this.getPermissions(console.log())
    let isPersonalized = this.note.config.personalizedMode
    isPersonalized = isPersonalized === undefined ? 'false' : isPersonalized
    this.note.config.personalizedMode = isPersonalized
  }

  //初始化外观
  initializeLookAndFeel():void {
    if (!this.note.config.looknfeel) {
      this.note.config.looknfeel = 'default'
    } else {
      this.viewOnly = this.note.config.looknfeel === 'report' ? true : false
    }

    if (this.note.paragraphs && this.note.paragraphs[0]) {
      this.note.paragraphs[0].focus = true
    }
    this.eventService.broadcast('setLookAndFeel', this.note.config.looknfeel)
  }

  //获取binding信息
  getInterpreterBindings():void {
    this.websocketMsgSrv.getInterpreterBindings(this.note.id)
  }

  //监听Bing信息的回调
  callbackInterpreterBindings(data):void {
    this.interpreterBindings = data[0].interpreterBindings
    //this.interpreterBindingsOrig = angular.copy(this.interpreterBindings) // to check dirty

    let selected = false
    let key
    let setting

    for (key in this.interpreterBindings) {
      setting = this.interpreterBindings[key]
      if (setting.selected) {
        selected = true
        break
      }
    }

    if (!selected) {
      // make default selection
      let selectedIntp = {}
      for (key in this.interpreterBindings) {
        setting = this.interpreterBindings[key]
        if (!selectedIntp[setting.name]) {
          setting.selected = true
          selectedIntp[setting.name] = true
        }
      }
      this.showSetting = true
    }

  }

  // 获取Note的权限
  getPermissions(callback):void {
    let self = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/notebook/'+ this.note.id + '/permissions')
      .subscribe(
        response => {
          self.permissions = response['body']
          //self.permissionsOrig = angular.copy(self.permissions) // to check dirty

          let selectJson = {
            tokenSeparators: [',', ' '],
            ajax: {
              url: function (params) {
                if (!params.term) {
                  return false
                }
                return self.baseUrlSrv.getRestApiBase() + '/security/userlist/' + params.term
              },
              delay: 250,
              processResults: function (data, params) {
                let results = []

                if (data.body.users.length !== 0) {
                  let users = []
                  for (let len = 0; len < data.body.users.length; len++) {
                    users.push({
                      'id': data.body.users[len],
                      'text': data.body.users[len]
                    })
                  }
                  results.push({
                    'text': 'Users :',
                    'children': users
                  })
                }
                if (data.body.roles.length !== 0) {
                  let roles = []
                  for (let len = 0; len < data.body.roles.length; len++) {
                    roles.push({
                      'id': data.body.roles[len],
                      'text': data.body.roles[len]
                    })
                  }
                  results.push({
                    'text': 'Roles :',
                    'children': roles
                  })
                }
                return {
                  results: results,
                  pagination: {
                    more: false
                  }
                }
              },
              cache: false
            },
            width: ' ',
            tags: true,
            minimumInputLength: 3
          }

          self.setIamOwner()
          /*angular.element('#selectOwners').select2(selectJson)
          angular.element('#selectReaders').select2(selectJson)
          angular.element('#selectRunners').select2(selectJson)
          angular.element('#selectWriters').select2(selectJson)*/
          if (callback) {
            callback()
          }
        },
        errorResponse => {
          let redirect = errorResponse.headers('Location')
          if (errorResponse.status === 401 && redirect !== undefined) {
            // Handle page redirect
            window.location.href = redirect
          }
        }
      );
  }

  setIamOwner():boolean {
    /*if (this.permissions.owners.length > 0 && _.indexOf(this.permissions.owners, this.globalService.ticket.principal) < 0) {
      this.isOwner = false
      return false
    }*/
    this.isOwner = true
    return true
  }

  columnWidthClass(n) {
    if (this.asIframe || n == undefined) {
      return 'ui-g-12'
    } else {
      return 'paragraph-col ui-g-' + n
    }
  }

  /**
   * 从note中根据id获取相应的片段
   * @param {string} id
   */
  getParagraphById(id:string){

    for (let paragraph of this.note.paragraphs) {
      if(paragraph.id == id){
        return paragraph
      }
    }

    return null
  }

}
