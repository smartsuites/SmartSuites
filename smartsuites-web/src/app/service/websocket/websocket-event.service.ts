import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {BaseUrlService} from "../base-url/base-url.service";
import {Router} from "@angular/router";
import {EventService} from "../event/event.service";
import {GlobalService} from "../global/global.service";
import {$WebSocket, WebSocketSendMode} from "angular2-websocket/angular2-websocket";

@Injectable()
export class WebsocketEventService {

  // WebSocket HB间隔
  private pingIntervalId: number

  // WebSocket客户端
  private websocket: any

  // 平台初始启动
  platformFirstLoad = true;

  constructor(public baseUrlSrv: BaseUrlService, public router: Router, public eventService: EventService, public globalService: GlobalService) {
    let vm = this;
    this.websocket = new $WebSocket(this.baseUrlSrv.getWebsocketUrl())

    this.websocket.onOpen(function () {
      console.log('Websocket created')
      // 广播事件
      vm.eventService.broadcast('setConnectedStatus', true)

      // 广播平台初始启动事件
      if (vm.platformFirstLoad) {
        vm.platformFirstLoad = false
        vm.eventService.broadcast('platformStartup')
      }

      // 发送心跳
      this.pingIntervalId = setInterval(function () {
        vm.sendNewEvent({op: 'PING'})
      }, 10000)
    })

    this.websocket.onMessage(
      (event: MessageEvent) => {

        let payload
        if (event.data) {
          payload = JSON.parse(event.data)
        }

        console.log('Receive << %o, %o', payload.op, payload)

        let op = payload.op
        let data = payload.data
        if (op === 'NOTE') {
          // 加载具体的Note信息
          vm.eventService.broadcast('setNoteContent', data.note)
        } else if (op === 'NEW_NOTE') {
          vm.router.navigate(['/notebook/' + data.note.id])
        } else if (op === 'NOTES_INFO') {
          // 启动加载Notes
          vm.eventService.broadcast('setNoteMenu', data.notes)
        } else if (op === 'LIST_NOTE_JOBS') {
          vm.eventService.broadcast('jobmanager:set-jobs', data.noteJobs)
        } else if (op === 'LIST_UPDATE_NOTE_JOBS') {
          // TODO $rootScope.$emit('jobmanager:update-jobs', data.noteRunningJobs)
          vm.eventService.broadcast('jobmanager:update-jobs', data.noteRunningJobs)
        } else if (op === 'AUTH_INFO') {
          let btn = []
          if (vm.globalService.ticket.roles === '[]') {
            btn = [{
              label: 'Close',
              action: function (dialog) {
                dialog.close()
              }
            }]
          } else {
            btn = [{
              label: 'Login',
              action: function (dialog) {
                dialog.close()
                // TODO
                /*angular.element('#loginModal').modal({
                  show: 'true'
                })*/
              }
            }, {
              label: 'Cancel',
              action: function (dialog) {
                dialog.close()
                // using $rootScope.apply to trigger angular digest cycle
                // changing $location.path inside bootstrap modal wont trigger digest

                /*$rootScope.$apply(function () {
                  vm.router.navigate(['/'])
                })*/
                vm.router.navigate(['/'])
              }
            }]
          }

          // TODO show
          /*BootstrapDialog.show({
            closable: false,
            closeByBackdrop: false,
            closeByKeyboard: false,
            title: 'Insufficient privileges',
            message: data.info.toString(),
            buttons: btn
          })*/
        } else if (op === 'PARAGRAPH') {
          vm.eventService.broadcast('updateParagraph', data)
        } else if (op === 'RUN_PARAGRAPH_USING_SPELL') {
          vm.eventService.broadcast('runParagraphUsingSpell', data)
        } else if (op === 'PARAGRAPH_APPEND_OUTPUT') {
          vm.eventService.broadcast('appendParagraphOutput', data)
        } else if (op === 'PARAGRAPH_UPDATE_OUTPUT') {
          vm.eventService.broadcast('updateParagraphOutput', data)
        } else if (op === 'PROGRESS') {
          vm.eventService.broadcast('updateProgress', data)
        } else if (op === 'COMPLETION_LIST') {
          vm.eventService.broadcast('completionList', data)
        } else if (op === 'EDITOR_SETTING') {
          vm.eventService.broadcast('editorSetting', data)
        } else if (op === 'ANGULAR_OBJECT_UPDATE') {
          vm.eventService.broadcast('angularObjectUpdate', data)
        } else if (op === 'ANGULAR_OBJECT_REMOVE') {
          vm.eventService.broadcast('angularObjectRemove', data)
        } else if (op === 'APP_APPEND_OUTPUT') {
          vm.eventService.broadcast('appendAppOutput', data)
        } else if (op === 'APP_UPDATE_OUTPUT') {
          vm.eventService.broadcast('updateAppOutput', data)
        } else if (op === 'APP_LOAD') {
          vm.eventService.broadcast('appLoad', data)
        } else if (op === 'APP_STATUS_CHANGE') {
          vm.eventService.broadcast('appStatusChange', data)
        } else if (op === 'LIST_REVISION_HISTORY') {
          vm.eventService.broadcast('listRevisionHistory', data)
        } else if (op === 'NOTE_REVISION') {
          vm.eventService.broadcast('noteRevision', data)
        } else if (op === 'INTERPRETER_BINDINGS') {
          //获取当前Note的Bing信息
          vm.eventService.broadcast('interpreterBindings', data)
        } else if (op === 'ERROR_INFO') {
          //TODO show
          /*BootstrapDialog.show({
            closable: false,
            closeByBackdrop: false,
            closeByKeyboard: false,
            title: 'Details',
            message: data.info.toString(),
            buttons: [{
              // close all the dialogs when there are error on running all paragraphs
              label: 'Close',
              action: function () {
                BootstrapDialog.closeAll()
              }
            }]
          })*/
        } else if (op === 'SESSION_LOGOUT') {
          vm.eventService.broadcast('session_logout', data)
        } else if (op === 'CONFIGURATIONS_INFO') {
          vm.eventService.broadcast('configurationsInfo', data)
        } else if (op === 'INTERPRETER_SETTINGS') {
          vm.eventService.broadcast('interpreterSettings', data)
        } else if (op === 'PARAGRAPH_ADDED') {
          vm.eventService.broadcast('addParagraph', data.paragraph, data.index)
        } else if (op === 'PARAGRAPH_REMOVED') {
          vm.eventService.broadcast('removeParagraph', data.id)
        } else if (op === 'PARAGRAPH_MOVED') {
          vm.eventService.broadcast('moveParagraph', data.id, data.index)
        } else if (op === 'NOTE_UPDATED') {
          vm.eventService.broadcast('updateNote',  data.name, data.config, data.info)
        } else if (op === 'SET_NOTE_REVISION') {
          vm.eventService.broadcast('setNoteRevisionResult', data)
        } else if (op === 'PARAS_INFO') {
          vm.eventService.broadcast('updateParaInfos', data)
        } else {
          console.error(`unknown websocket op: ${op}`)
        }

      },
      {autoApply: false}
    )

    this.websocket.onError((event: MessageEvent) => {
      vm.eventService.broadcast('setConnectedStatus', false)
    })

    this.websocket.onClose((event: MessageEvent) => {
      console.log('close message: ', event)
      if (this.pingIntervalId !== null) {
        clearInterval(this.pingIntervalId)
        this.pingIntervalId = null
      }
      vm.eventService.broadcast('setConnectedStatus', false)
    })

    /*while (!this.isConnected()){
      console.log(">>>>>>>>>>>")
    }*/


  }

  sendNewEvent(data) {

    if (this.globalService.ticket !== undefined) {
      data.principal = this.globalService.ticket.principal
      data.ticket = this.globalService.ticket.ticket
      data.roles = this.globalService.ticket.roles
    } else {
      data.principal = ''
      data.ticket = ''
      data.roles = ''
    }
    console.log('Send >> %o, %o, %o, %o, %o', data.op, data.principal, data.ticket, data.roles, data)
    return this.websocket.send(data, WebSocketSendMode.Direct)
  }

  isConnected() {
    return (this.websocket.socket.readyState === this.websocket.readyStateConstants.OPEN)
  }
}
