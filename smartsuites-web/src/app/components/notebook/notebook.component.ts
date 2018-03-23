import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {EventService} from "../../service/event/event.service";
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
import * as moment from "moment";
import {Constants} from "../../model/Constants";
import {MessageService} from "primeng/components/common/messageservice";
import {CommonService} from "../../service/common/common.service";
import {ConfirmationService, MenuItem} from "primeng/primeng";
import {NoteCreateComponent} from "../note-create/note-create.component";

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.css']
})
export class NotebookComponent implements OnInit,OnDestroy{


  /**************** 更新Note名称 ***************/
  titleEditor = false

  noteName

  editNoteTitle() {
    this.titleEditor = true
  }

  showNoteTitle() {
    this.titleEditor = false
  }

  /** 跟新Notebook名称 */
  updateNoteName(newName) {
    const trimmedNewName = newName.trim()
    if (trimmedNewName.length > 0 && this.note.name !== trimmedNewName) {
      this.note.name = trimmedNewName
      this.websocketMsgSrv.renameNote(this.note.id, this.note.name)
    }
  }

  /**************** 复制笔记本 **************/
  @ViewChild("noteCopy")
  noteCreateComponent:NoteCreateComponent

  showCreateNoteDialog() {
    this.noteCreateComponent.getInterpreterSettings()
    this.noteCreateComponent.openCloneNoteDialog(this.note.name)
  }

  /**************** 切换代码和输出显示状态 **************/

  //是否切换代码显示
  editorToggled = false

  //是否显示输出显示
  tableToggled = false

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

  /**************** 显示快捷方式的Model **************/
  // 快捷方式显示
  shortcutsDialog = false

  /**************** NoteBook的三种显示方式 **************/

  //当前Note三种显示模式
  looknfeelOption = ['default', 'simple', 'report']

  looknfeelOptionItems = [
    {label: 'default', icon: 'fa-bullseye', command: () => {
        this.setLookAndFeel('default');
      }},
    {label: 'simple', icon: 'fa-bullseye', command: () => {
        this.setLookAndFeel('simple');
      }},
    {label: 'report', icon: 'fa-bullseye', command: () => {
        this.setLookAndFeel('report');
      }
    }
  ];

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

  setLookAndFeel(looknfeel) {
    this.note.config.looknfeel = looknfeel
    if (this.revisionView === true) {
      this.eventService.broadcast('setLookAndFeel', this.note.config.looknfeel)
    } else {
      this.setConfig()
    }
  }

  /**************** NoteBook的调度方式 **************/

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

  getCronOptionNameFromValue(value) {
    if (!value || value == undefined || value == "") {
      return "None"
    }

    for (let o in this.cronOption) {
      if (this.cronOption[o].value === value) {
        return this.cronOption[o].name
      }
    }
    return value
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
    this.setConfig()
  }

  /** Set the username of the user to be used to execute all notes in notebook **/
  setCronExecutingUser(cronExecutingUser) {
    this.note.config.cronExecutingUser = cronExecutingUser
    this.setConfig()
  }

  /**************** NoteBook的版本管理 **************/

  formatRevisionDate(date) {
    return moment.unix(date).format('MMMM Do YYYY, h:mm a')
  }

  // 检测Path是否为修订版本
  isRevisionPath(path) {
    let pattern = new RegExp('^.*\/notebook\/[a-zA-Z0-9_]*\/revision\/[a-zA-Z0-9_]*')
    return pattern.test(path)
  }

  // 当前Note的所有版本
  noteRevisions = []

  // 当前的版本
  currentRevision = 'Head'

  noteRev: MenuItem[] = [];

  // 是否为修订版本视图
  revisionView = this.isRevisionPath(this.location.path())

  // 当前修订版本号
  revisionId

  // 获取Note版本列表
  getNoteRevisions(){
    let self = this;
    for(let rev of this.noteRevisions){
      self.noteRev.push({
        label: rev.message+"["+self.formatRevisionDate(rev.time)+"]",
        icon: 'fa-clock-o',
        style:'font-size:10px',
        command: () => {
          self.visitRevision(rev);
        }
      })
    }
  }

  // checkpoint/commit notebook
  checkpointNote(commitMessage) {
    let self = this;

    this.confirmationService.confirm({
      message: 'Commit note to current repository?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        self.websocketMsgSrv.checkpointNote(self.noteId, commitMessage)
      },
      reject: () => {}
    });
    //document.getElementById('note.checkpoint.message').value = ''
  }

  // set notebook head to given revision
  setNoteRevision() {
    let self = this;

    this.confirmationService.confirm({
      message: 'Set notebook head to current revision?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        self.websocketMsgSrv.setNoteRevision(self.noteId, self.revisionId)
      },
      reject: () => {}
    });
  }

  visitRevision(revision) {
    if (revision.id) {
      if (revision.id === 'Head') {
        this.location.go('/notebook/' + this.noteId)
      } else {
        this.location.go('/notebook/' + this.noteId + '/revision/' + revision.id)
      }
    } else {
      this.messageService.add({severity:'error', summary:'Success', detail:'There is a problem with this Revision!'});
    }
  }

  /** Set release resource for this note **/
  setReleaseResource(value) {
    this.note.config.releaseresource = value
    this.setConfig()
  }

  /**************** NoteBook的解析器配置 **************/

  //是否显示解析器配置
  showSetting = false

  // 当前Note的解析器绑定
  interpreterSettings = []
  interpreterBindings = []

  interpreterBindingsOrig = []

  openSetting() {
    this.showSetting = true
    this.getInterpreterBindings()
  }

  closeSetting() {
    let self = this;
    if (this.isSettingDirty()) {
      this.confirmationService.confirm({
        message: 'Interpreter setting changes will be discarded.',
        header: 'Confirmation',
        icon: 'fa fa-question-circle',
        accept: () => {
          self.showSetting = false
        },
        reject: () => {}
      });
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

    this.note.paragraphs.forEach((val, idx, array) => {
      // val: 当前值
      // idx：当前index
      // array: Array
      let regExp = /^\s*%/g
      if (val.text && !regExp.exec(val.text)) {
        self.eventService.broadcast('saveInterpreterBindings', val.id)
      }
    });

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

  //获取binding信息
  getInterpreterBindings():void {
    this.websocketMsgSrv.getInterpreterBindings(this.note.id)
  }

  interpreterSelectionListeners = {
    accept: function (sourceItemHandleScope, destSortableScope) { return true },
    itemMoved: function (event) {},
    orderChanged: function (event) {}
  }

  isSettingDirty() {
    if (this.interpreterBindings == this.interpreterBindingsOrig) {
      return false
    } else {
      return true
    }
  }

  /**************** NoteBook的权限配置 **************/

  permissionsOrig

  permissions

  isOwner

  showPermissions

  isAnonymous

  // 显示非权限用户
  blockAnonUsers() {
    let zeppelinVersion = this.globalService.dataSmartVersion
    let url = 'https://zeppelin.apache.org/docs/' + zeppelinVersion + '/security/notebook_authorization.html'
    let content = 'Only authenticated user can set the permission.' +
      '<a data-toggle="tooltip" data-placement="top" title="Learn more" target="_blank" href=' + url + '>' +
      '<i class="icon-question" />' +
      '</a>'
    this.messageService.add({severity:'warn', summary:'权限拒绝', detail:content});
  }

  openPermissions() {
    this.showPermissions = true
    this.getPermissions(console.log())
  }

  // 获取Note的权限
  getPermissions(callback):void {
    let self = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/notebook/'+ this.note.id + '/permissions')
      .subscribe(
        response => {

          self.permissions = response['body']
          self.permissionsOrig = Object.assign({},self.permissions) // to check dirty

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

  isPermissionsDirty() {
    if (this.permissions == this.permissionsOrig) {
      return false
    } else {
      return true
    }
  }

  closePermissions() {
    let self = this;
    if (this.isPermissionsDirty()) {
      this.confirmationService.confirm({
        message: 'Changes will be discarded.',
        header: 'Confirmation',
        icon: 'fa fa-question-circle',
        accept: () => {
          self.showPermissions = false
        },
        reject: () => {}
      });
    } else {
      this.showPermissions = false
    }
  }

  convertPermissionsToArray () {
    /*this.permissions.owners = angular.element('#selectOwners').val()
    this.permissions.readers = angular.element('#selectReaders').val()
    this.permissions.runners = angular.element('#selectRunners').val()
    this.permissions.writers = angular.element('#selectWriters').val()
    angular.element('.permissionsForm select').find('option:not([is-select2="false"])').remove()*/
  }

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

  savePermissions() {
    let self = this;
    if (this.isAnonymous || this.globalService.ticket.principal.trim().length === 0) {
      this.blockAnonUsers()
    }
    this.convertPermissionsToArray()
    if (this.isOwnerEmpty()) {

      this.confirmationService.confirm({
        message: 'Please fill the [Owners] field. If not, it will set as current user.\n\n' +
        'Current user : [ ' + self.globalService.ticket.principal + ']',
        header: 'Setting Owners Permissions',
        icon: 'fa fa-question-circle',
        accept: () => {
          self.permissions.owners = [self.globalService.ticket.principal]
          self.setPermissions()
        },
        reject: () => {
          self.openPermissions()
        }
      });

    } else {
      this.setPermissions()
    }
  }

  setPermissions() {
    let self = this;
    self.httpClient.put(this.baseUrlSrv.getRestApiBase() + '/notebook/' + self.note.id + '/permissions', self.permissions)
      .subscribe(
        response => {
          self.getPermissions(function () {
            console.log('Note permissions %o saved', self.permissions)

            this.confirmationService.confirm({
              message: 'Owners : ' + self.permissions.owners + '\n\n' + 'Readers : ' +
              self.permissions.readers + '\n\n' + 'Runners : ' + self.permissions.runners +
              '\n\n' + 'Writers  : ' + self.permissions.writers,
              header: 'Permissions Saved Successfully',
              icon: 'fa fa-question-circle',
              accept: () => {
              },
              reject: () => {
              }
            });
            self.showPermissions = false
          })
        },
        errorResponse => {
          console.log('Error %o %o', status, errorResponse)
          this.confirmationService.confirm({
            message: errorResponse,
            header: 'Permissions Saved Successfully',
            icon: 'fa fa-question-circle',
            accept: () => {
            },
            reject: () => {
            }
          });


          this.messageService.add({severity:'error', summary:'Error restart interpreter.', detail:errorResponse['message']});
        }
      );
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

  setIamOwner():boolean {
    if (this.permissions.owners.length > 0 && this.permissions.owners.indexOf(this.globalService.ticket.principal) < 0) {
      this.isOwner = false
      return false
    }
    this.isOwner = true
    return true
  }

  /**************** NoteBook的查询 **************/

  // 查询对象
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

  // 当前查询的片段索引
  currentSearchParagraph = 0

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
    let search = {
      searchText: this.search.searchText,
      replaceText: this.search.replaceText
    }
    this.eventService.broadcast('replaceCurrent', search)
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
    let search = {
      searchText: this.search.searchText,
      replaceText: this.search.replaceText
    }
    this.eventService.broadcast('replaceAll', search)
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


  /**************** 删除Notebook **************/

  // Move the note to trash and go back to the main page
  moveNoteToTrash(noteId) {
    this.noteActionService.moveNoteToTrash(noteId, true)
  }

  // Remove the note permanently if it's in the trash
  removeNote(noteId) {
    this.noteActionService.removeNote(noteId, true)
  }
  i= 0
  isTrash(note) {
    console.log(this.i++)
    return note ? note.name.split('/')[0] === Constants.TRASH_FOLDER_ID : false
  }

  /**************** 导出Notebook **************/

  // Export notebook
  exportNote() {
    let jsonContent = JSON.stringify(this.note)
    this.saveAsService.saveAs(jsonContent, this.note.name, 'json')
  }

  /**************** 克隆Notebook **************/

  // Clone note
  cloneNote(noteId) {
    let self = this;

    this.confirmationService.confirm({
      message: 'Do you want to clone this note?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        self.websocketMsgSrv.cloneNote(noteId,'cloned-'+self.noteName)
        this.messageService.add({severity:'info', summary:'Success', detail:'Cloned SuccessFully!'});
      },
      reject: () => {}
    });
  }

  /**************** 运行整个Notebook **************/

  runAllParagraphs(noteId) {
    let self = this;
    this.confirmationService.confirm({
      message: 'Run all paragraphs?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        const paragraphs = self.note.paragraphs.map(p => {
          return {
            id: p.id,
            title: p.title,
            paragraph: p.text,
            config: p.config,
            params: p.settings.params
          }
        })
        self.websocketMsgSrv.runAllParagraphs(noteId, paragraphs)
      },
      reject: () => {}
    });
  }

  /**************** 保存整个Notebook **************/

  // 自动保存
  saveTimer = null

  // Note是否更新
  isNoteDirty = null

  saveNote() {
    let self = this;
    if (this.note && this.note.paragraphs) {
      self.eventService.broadcast("saveParagraph")
      /*for(let par of this.note.paragraphs){

        /!*this.elementRef.nativeElement
          .querySelector('#' + par.id + '_paragraphColumn_main')
          .scope()
          .saveParagraph(par)*!/
      }*/
      this.isNoteDirty = null
    }
  }

  killSaveTimer() {
    let self = this;
    if (self.saveTimer) {
      // TODO 停止Timer
      //$timeout.cancel(this.saveTimer)
      clearTimeout(self.saveTimer)
      self.saveTimer = null
    }
  }

  // 启动保存
  startSaveTimer() {
    let self = this;
    self.killSaveTimer()
    self.isNoteDirty = true
    console.log('startSaveTimer called ' + this.note.id);
    self.saveTimer = setTimeout(function () {
      self.saveNote()
    }, 10000)
  }

  /**************** 添加Notebook中的片段 **************/

  addPara(paragraph, index) {
    this.note.paragraphs.splice(index, 0, paragraph)
    this.note.paragraphs.map(para => {
      if (para.id === paragraph.id) {
        para.focus = true

        let paraInfo = {
          paragraphId:para.id,
          cursorPos:0,
          mouseEvent:false
        }
        this.eventService.broadcast('focusParagraph', paraInfo)
        // we need `$timeout` since angular DOM might not be initialized
        //$timeout(() => { this.eventService.broadcast('focusParagraph', para.id, 0, false) })
      }
    })
  }

  insertNew(paragraphId,position) {
    let para ={
      paragraphId:paragraphId,
      position:position
    }
    this.eventService.broadcast('insertParagraph', para)
  }

  /**************** 删除Notebook中的片段 **************/

  removePara(paragraphId) {
    let removeIdx
    this.note.paragraphs.forEach(function (para, idx) {
      if (para.id === paragraphId) {
        removeIdx = idx
      }
    })
    return this.note.paragraphs.splice(removeIdx, 1)
  }

  /**************** 清除Notebook中的片段输出 **************/

  clearAllParagraphOutput(noteId) {
    this.noteActionService.clearAllParagraphOutput(noteId)
  }

  /**************** 重启解析器 **************/

  restartInterpreter(interpreter) {
    let self = this;
    const thisConfirm = this.confirmationService.confirm({
      message: 'Do you want to restart ' + interpreter.name + ' interpreter?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        let payload = {
          'noteId': self.note.id
        }

        /*thisConfirm.$modalFooter.find('button').addClass('disabled')
        thisConfirm.$modalFooter.find('button:contains("OK")')
          .html('<i class="fa fa-circle-o-notch fa-spin"></i> Saving Setting')*/


        self.httpClient.put(this.baseUrlSrv.getRestApiBase() + '/interpreter/setting/restart/' + interpreter.id, payload)
          .subscribe(
            response => {
              //let index = self.interpreterSettings.findIndex({'id': interpreter.id})
              //self.interpreterSettings[index] = response['body']
              //thisConfirm.close()
            },
            errorResponse => {

              //thisConfirm.close()
              console.log('Error %o %o', status, errorResponse)
              this.messageService.add({severity:'error', summary:'Error restart interpreter.', detail:errorResponse['message']});
            }
          );
        return false
      },
      reject: () => {}
    });

  }

  /**************** 切换个人模式和协作模式 **************/

  toggleNotePersonalizedMode() {
    let self = this;
    let personalizedMode = this.note.config.personalizedMode
    if (this.isOwner) {

      let modeText = self.note.config.personalizedMode === 'true' ? 'collaborate' : 'personalize'

      self.confirmationService.confirm({
        message: 'Do you want to <span class="text-info">' + modeText + '</span> your analysis?',
        header: 'Setting the result display',
        icon: 'fa fa-question-circle',
        accept: () => {
          if (self.note.config.personalizedMode === undefined) {
            self.note.config.personalizedMode = 'false'
          }
          self.note.config.personalizedMode = personalizedMode === 'true' ? 'false' : 'true'
          self.websocketMsgSrv.updatePersonalizedMode(self.note.id, self.note.config.personalizedMode)
        },
        reject: () => {
        }
      });
    }
  }

  /**************** 页面事件和布局 **************/

  focusParagraphOnClick(clickEvent) {
    if (!this.note) {
      return
    }
    for (let i = 0; i < this.note.paragraphs.length; i++) {
      let paragraphId = this.note.paragraphs[i].id
      if (this.commonService._jQuery.contains(this.elementRef.nativeElement.querySelector('#' + paragraphId + '_container'), clickEvent.target)) {

        // 发送片段聚焦事件，
        let paraInfo = {
          paragraphId:paragraphId,
          cursorPos:0,
          mouseEvent:true
        }
        this.eventService.broadcast('focusParagraph', paraInfo)
        break
      }
    }
  }

  // 单击片段聚焦
  paragraphOnClick(paragraphId){
    // ui-shadow-2 = selected  ui-shadow-1 = unselected
    if(this.commonService._jQuery('#'+paragraphId+"_paragraphColumn").hasClass("ui-shadow-2")){
      return
    }
    // Update CSS Class
    this.commonService._jQuery(".notebook .paragraphColumn").removeClass("ui-shadow-1 ui-shadow-2")
    this.commonService._jQuery(".notebook .paragraphColumn").addClass("ui-shadow-1")
    this.commonService._jQuery('#'+paragraphId+"_paragraphColumn").removeClass("ui-shadow-1")
    this.commonService._jQuery('#'+paragraphId+"_paragraphColumn").addClass("ui-shadow-2")
    let paraInfo = {
      paragraphId:paragraphId,
      cursorPos:0,
      mouseEvent:true
    }
    this.eventService.broadcast('focusParagraph', paraInfo)
  }

  keyboardShortcut(keyEvent) {
    // handle keyevent
    if (!this.viewOnly && !this.revisionView) {
      this.eventService.broadcast('keyEvent', keyEvent)
    }
  }

  //片段双击事件
  paragraphOnDoubleClick(paragraphId) {
    this.eventService.broadcast('doubleClickParagraph', paragraphId)
  }

  columnWidthClass(n) {
    if (this.asIframe || n == undefined) {
      return 'ui-g-12'
    } else {
      return 'paragraph-col ui-g-' + n
    }
  }

  /**************** 共享变量 **************/

  //当前Note的ID
  noteId

  //当前的Note实例
  note:any

  //是否只读
  viewOnly = false

  // 是否连接到后台
  connectedOnce = false

  paragraphUrl

  asIframe


  // 初始化笔记
  initNotebook():void {
    this.noteVarShareService.clear()
    if (this.revisionId) {
      this.websocketMsgSrv.getNoteByRevision(this.noteId, this.revisionId)
    } else {
      this.websocketMsgSrv.getNote(this.noteId)
    }

    this.websocketMsgSrv.listRevisionHistory(this.noteId)

    // TODO 滑动到具体的地方
    /*let currentRoute = $route.current
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

  // 检测Note是否在运行
  isNoteRunning() {
    if (!this.note) { return false }

    for (let i = 0; i < this.note.paragraphs.length; i++) {
      if (isParagraphRunning(this.note.paragraphs[i])) {
        return true
      }
    }

    return false
  }

  cleanParagraphExcept(paragraphId, note) {
    let noteCopy = {
      id: note.id,
      name:note.name,
      config:note.config,
      info:note.info,
      paragraphs: []
    }
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
    return noteCopy
  }

  // 更新Note的配置
  setConfig(config?) {
    if (config) {
      this.note.config = config
    }
    this.websocketMsgSrv.updateNote(this.note.id, this.note.name, this.note.config)
  }

  // 获取Note的名称
  getNoteName(note) {
    if (note) {
      return this.arrayOrderingSrv.getNoteName(note)
    }
  }

  // 从note中根据id获取相应的片段
  getParagraphById(id:string){
    for (let paragraph of this.note.paragraphs) {
      if(paragraph.id == id){
        return paragraph
      }
    }
    return null
  }




  // TODO
  paragraphWarningDialog = {}

  showParagraphWarning(next) {
    let self = this;
    /*if (this.paragraphWarningDialog.opened !== true) {

      this.paragraphWarningDialog = self.confirmationService.confirm({
        message: 'Changes that you have made will not be saved.',
        header: 'Do you want to leave this site?',
        icon: 'fa fa-question-circle',
        accept: () => {
          /!*let locationToRedirect = next['$$route']['originalPath']
          Object.keys(next.pathParams).map(key => {
            locationToRedirect = locationToRedirect.replace(':' + key,
              next.pathParams[key])
          })
          $scope.allowLeave = true
          $location.path(locationToRedirect)*!/
        },
        reject: () => {
        }
      });
    }*/

  }

  allowLeave

  // 名称
  /*$scope.$watch('note', function (value) {
    $rootScope.pageTitle = value ? value.name : 'Zeppelin'
  }, true)*/

  /*angular.element(document).click(function () {
    angular.element('.ace_autocomplete').hide()
  })*/

  /*angular.element(window).bind('resize', function () {
    const actionbarHeight = document.getElementById('actionbar').lastElementChild.clientHeight
    angular.element(document.getElementById('content')).css('padding-top', actionbarHeight - 20)
  })*/

  // 构造函数
  constructor(private eventService:EventService,
              private websocketMsgSrv:WebsocketMessageService,
              private route:ActivatedRoute,
              private noteVarShareService:NoteVarShareService,
              private router:Router,
              private httpClient:HttpClient,
              private baseUrlSrv:BaseUrlService,
              public globalService:GlobalService,
              private location:Location,
              private noteActionService:NoteActionService,
              private saveAsService:SaveAsService,
              private arrayOrderingSrv:ArrayOrderingService,
              private messageService:MessageService,
              private commonService:CommonService,
              private elementRef:ElementRef,
              private renderer:Renderer2,
              private confirmationService: ConfirmationService) {

    this.note = {
      name:'',
      paragraphs:[],
      config:{
        cron:''
      },
      info:{}
    }
  }

  subscribers = []

  ngOnInit(): void {

    let self = this;

    // 获取URL参数
    this.route.params.subscribe((params: Params) => {

      // 获取URL中的NoteId
      self.noteId = params['noteId']

      // 获取URL中的revisionId
      self.revisionId = params['revisionId']

      self.paragraphUrl = params.paragraphId
      self.asIframe = params.asIframe

      this.initNotebook()
    })

    // register mouseevent handler for focus paragraph
    document.addEventListener('click', self.focusParagraphOnClick)

    // register mouseevent handler for focus paragraph
    //document.addEventListener('keydown', self.keyboardShortcut)
    document.addEventListener('keydown', function(keyEvent){
      if (!self.viewOnly && !self.revisionView) {
        self.eventService.broadcast('keyEvent', keyEvent)
      }
    })

    // Windows Resize的回调
    window.addEventListener('resize', function () {
      const actionbarHeight = document.getElementById('actionbar').lastElementChild.clientHeight
      /*angular.element(document.getElementById('content')).css('padding-top', actionbarHeight - 20)*/
    })

    // 监听Websocket的连接状态
    self.eventService.subscribeRegister(self.subscribers,'setConnectedStatus', function (data) {
      if (self.connectedOnce && data) {
        // 初始化NoteBook
        self.initNotebook()
      }
      self.connectedOnce = true
    })

    // 监听列出版本历史
    self.eventService.subscribeRegister(self.subscribers,'listRevisionHistory', function (data) {
      console.debug('received list of revisions %o', data)
      self.noteRevisions = data.revisionList
      self.noteRevisions.splice(0, 0, {
        id: 'Head',
        message: 'Head'
      })
      if (self.revisionId) {
        /*let index = self.noteRevisions.findIndex( {'id': self.revisionId})
        if (index > -1) {
          this.currentRevision = self.noteRevisions[index].message
        }*/
      }
      // 更新NoteList集合
      self.getNoteRevisions()
    })

    // 监听设置Note版本事件
    self.eventService.subscribeRegister(self.subscribers,'noteRevision', function (data) {
      console.log('received note revision %o', data)
      if (data.note) {
        self.note = data.note
        self.initializeLookAndFeel()
      } else {
        self.location.go('/')
      }
    })

    // 监听设置Note版本事件
    self.eventService.subscribeRegister(self.subscribers,'setNoteRevisionResult', function (data) {
      console.log('received set note revision result %o', data)
      if (data.status) {
        self.location.go('/notebook/' + self.noteId)
      }
    })

    // 监听添加片段事件
    self.eventService.subscribeRegister(self.subscribers,'addParagraph', function (paragraph,index) {
      if (self.paragraphUrl || self.revisionView === true) {
        return
      }
      self.addPara(paragraph, index)
    })

    // 监听删除片段事件
    self.eventService.subscribeRegister(self.subscribers,'removeParagraph', function (id) {
      if (self.paragraphUrl || self.revisionView === true) {
        return
      }
      //self.removePara(data.paragraphId)
      self.removePara(id)
    })

    // 监听向上移动片段事件
    self.eventService.subscribeRegister(self.subscribers,'moveParagraph', function (id,index) {
      if (self.revisionView === true) {
        return
      }
      let removedPara = self.removePara(id)
      if (removedPara && removedPara.length === 1) {
        self.addPara(removedPara[0], index)
      }
    })

    // 监听更新笔记事件
    self.eventService.subscribeRegister(self.subscribers,'updateNote', function (name,config,info) {
      /** update Note name */
      if (name !== self.note.name) {
        console.log('change note name to : %o', self.note.name)
        self.note.name = name
      }
      self.note.config = config
      self.note.info = info
      self.initializeLookAndFeel()
    })

    // 设置Bingding信息获取到的回调
    self.eventService.subscribeRegister(self.subscribers,'interpreterBindings', function (data) {
      self.interpreterBindings = data.interpreterBindings
      Object.assign(self.interpreterBindingsOrig,self.interpreterBindings) // to check dirty

      let selected = false
      let key
      let setting

      for (key in self.interpreterBindings) {
        setting = self.interpreterBindings[key]
        if (setting.selected) {
          selected = true
          break
        }
      }

      if (!selected) {
        // make default selection
        let selectedIntp = {}
        for (key in self.interpreterBindings) {
          setting = self.interpreterBindings[key]
          if (!selectedIntp[setting.name]) {
            setting.selected = true
            selectedIntp[setting.name] = true
          }
        }
        self.showSetting = true
      }
    })

    // 监听查询是否存在事件【搜索】
    self.eventService.subscribeRegister(self.subscribers,'occurrencesExists', function(data) {
      self.search.occurrencesCount += data.count
      if (self.search.needHighlightFirst) {
        self.sendNextOccurrenceMessage()
        self.search.needHighlightFirst = false
      }
    })

    // 监听下一个显示事件【搜索】
    self.eventService.subscribeRegister(self.subscribers,'noNextOccurrence', function(event) {
      self.increaseCurrentSearchParagraph()
      self.sendNextOccurrenceMessage()
    })

    // 监听上一个显示事件【搜索】
    self.eventService.subscribeRegister(self.subscribers,'noPrevOccurrence', function(event) {
      self.decreaseCurrentSearchParagraph()
      self.sendPrevOccurrenceMessage()
    })

    // 监听编辑器点击事件
    self.eventService.subscribeRegister(self.subscribers,'editorClicked', function() {
      self.search.occurrencesHidden = true
      self.eventService.broadcast('unmarkAll')
    })

    // 监听显示数量变更事件
    self.eventService.subscribeRegister(self.subscribers,'occurrencesCountChanged', function(data) {
      self.search.occurrencesCount += data.cnt
      if (self.search.occurrencesCount === 0) {
        self.search.currentOccurrence = 0
      } else {
        self.search.currentOccurrence += data.cnt + 1
        if (self.search.currentOccurrence > self.search.occurrencesCount) {
          self.search.currentOccurrence = 1
        }
      }
    })

    // 监听替换后事件
    self.eventService.subscribeRegister(self.subscribers,'noNextOccurrenceAfterReplace', function() {
      self.search.occurrencesCount = 0
      self.search.needHighlightFirst = false
      self.search.needToSendNextOccurrenceAfterReplace = false
      self.eventService.broadcast('checkOccurrences')
      self.increaseCurrentSearchParagraph()
      if (self.search.occurrencesCount > 0) {
        self.search.needToSendNextOccurrenceAfterReplace = true
      }
    })

    // 监听显示、隐藏搜索窗口
    self.eventService.subscribeRegister(self.subscribers,'toggleSearchBox', function() {
      /*let elem = angular.element('#searchGroup')
      if (self.search.searchBoxOpened) {
        elem.removeClass('open')
      } else {
        elem.addClass('open')
      }
      $timeout(self.makeSearchBoxVisible())*/
    })

    // 监听片段向上移动事件
    self.eventService.subscribeRegister(self.subscribers,'moveParagraphUp', function (paragraph) {
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

    // 监听片段向下移动事件
    self.eventService.subscribeRegister(self.subscribers,'moveParagraphDown', function (data) {
      let newIndex = -1
      for (let i = 0; i < self.note.paragraphs.length; i++) {
        if (self.note.paragraphs[i].id === data.paragraph.id) {
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
      self.websocketMsgSrv.moveParagraph(data.paragraph.id, newIndex)
    })

    // 监听聚焦到上一个片段事件
    self.eventService.subscribeRegister(self.subscribers,'moveFocusToPreviousParagraph', function (data) {
      let focus = false
      for (let i = self.note.paragraphs.length - 1; i >= 0; i--) {
        if (focus === false) {
          if (self.note.paragraphs[i].id === data.currentParagraphId) {
            focus = true
            continue
          }
        } else {
          self.eventService.broadcast('focusParagraph', self.note.paragraphs[i].id, -1)
          break
        }
      }
    })

    // 监听聚焦到下一个片段事件
    self.eventService.subscribeRegister(self.subscribers,'moveFocusToNextParagraph', function (data) {
      let focus = false
      for (let i = 0; i < self.note.paragraphs.length; i++) {
        if (focus === false) {
          if (self.note.paragraphs[i].id === data.currentParagraphId) {
            focus = true
            continue
          }
        } else {
          self.eventService.broadcast('focusParagraph', self.note.paragraphs[i].id, 0)
          break
        }
      }
    })

    // 监听插入片段事件
    self.eventService.subscribeRegister(self.subscribers,'insertParagraph', function (data) {
      if (self.revisionView === true) {
        return
      }
      let newIndex = -1
      for (let i = 0; i < self.note.paragraphs.length; i++) {
        if (self.note.paragraphs[i].id === data.paragraphId) {
          // determine position of where to add new paragraph; default is below
          if (data.position === 'above') {
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

    // 监听设置Note内容获取到的回调
    self.eventService.subscribeRegister(self.subscribers,'setNoteContent', function (note) {
      if (note === undefined) {
        //this.router.navigate(['/login']);
        return
      }
      self.note = note
      self.noteName = self.getNoteName(self.note)

      if (self.paragraphUrl) {
        self.note = self.cleanParagraphExcept(self.paragraphUrl, self.note)

        //$scope.$broadcast('$unBindKeyEvent', $scope.$unBindKeyEvent)

        self.eventService.broadcast('setIframe', self.asIframe)

        self.initializeLookAndFeel()
        return
      }

      self.initializeLookAndFeel()

      // open interpreter binding setting when there're none selected
      self.getInterpreterBindings()
      self.getPermissions(console.log())
      let isPersonalized = self.note.config.personalizedMode
      isPersonalized = isPersonalized === undefined ? 'false' : isPersonalized
      self.note.config.personalizedMode = isPersonalized
    })

    // TODO 监听路由更改事件
    self.eventService.subscribeRegister(self.subscribers,'$routeChangeStart', function (data) {
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

    // TODO 监听笔记销毁事件
    self.eventService.subscribeRegister(self.subscribers,'$destroy', function () {
      //angular.element(window).off('beforeunload')
      self.killSaveTimer()
      self.saveNote()

      document.removeEventListener('click', self.focusParagraphOnClick)
      //document.removeEventListener('keydown', self.keyboardShortcut)
      document.removeEventListener('keydown', function(keyEvent){
        if (!self.viewOnly && !self.revisionView) {
          self.eventService.broadcast('keyEvent', keyEvent)
        }
      })
    })

    // TODO 监听解绑键盘事件
    self.eventService.subscribeRegister(self.subscribers,'$unBindKeyEvent', function () {
      document.removeEventListener('click', self.focusParagraphOnClick)
      //document.removeEventListener('keydown', self.keyboardShortcut)
      document.removeEventListener('keydown', function(keyEvent){
        if (!self.viewOnly && !self.revisionView) {
          self.eventService.broadcast('keyEvent', keyEvent)
        }
      })
    })

  }

  ngOnDestroy(): void {
    this.eventService.unsubscribeSubscriptions(this.subscribers)
  }


}
