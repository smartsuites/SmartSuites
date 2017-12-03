import { Component, OnInit } from '@angular/core';
import {ArrayOrderingService} from "../../service/array-ordering/array-ordering.service";
import {WebsocketMessageService} from "../../service/websocket/websocket-message.service";
import {SearchService} from "../../service/search/search.service";
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";
import {GlobalService} from "../../service/global/global.service";
import {EventService} from "../../service/event/event.service";
import {Router} from "@angular/router";
import {Ticket} from "../../model/Ticket";
import {NoteListService} from "../../service/note-list/note-list.service";
import {DialogService} from "ng2-bootstrap-modal";
import {ModalComponent} from "../modal/modal.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // websocket connect state
  connected

  // 查询字符串
  query = {q: ''}

  TRASH_FOLDER_ID

  isFilterNote

  isActive

  logout

  search

  notes

  showLoginWindow

  isDrawNavbarNoteList

  ticket:Ticket

  constructor(//public arrayOrderingSrv:ArrayOrderingService,
              public websocketMsgSrv:WebsocketMessageService,
              public searchForm:SearchService,
              public baseUrlSrv:BaseUrlService,
              public httpClient:HttpClient,
              public noteListFactory:NoteListService,
              public globalService:GlobalService,
              public eventSevice:EventService,
              public router:Router,
              public dialogService:DialogService
              /*TRASH_FOLDER_ID*/) {

    let self = this;
    this.ticket = globalService.ticket
    this.connected = websocketMsgSrv.isConnected()
    this.notes = this.noteListFactory.notes

    // TODO
    //this.TRASH_FOLDER_ID = TRASH_FOLDER_ID
    this.isFilterNote = this.isFilterNoteFunc
    this.isActive = this.isActiveFunc
    this.logout = this.logoutFunc
    this.search = this.searchFunc

    //this.showLoginWindow = this.showLoginWindowFunc
  }

  ngOnInit() {
    let self = this;

    // 监听Websocket的连接状态
    this.eventSevice.subscribe('setConnectedStatus', function (msg) {
      self.connected = msg
    })

    // 平台启动加载Notes
    this.eventSevice.subscribe('platformStartup', function (msg) {
      self.loadNotes()
    })

    // 加载Notes
    this.eventSevice.subscribe('setNoteMenu', function (notes) {
      self.noteListFactory.setNotes(notes)

      self.initNotebookListEventListener()
    })

    this.getZeppelinVersion()

    this.isDrawNavbarNoteList = false

    // TODO
    /*angular.element('#notebook-list').perfectScrollbar({suppressScrollX: true})

    angular.element(document).click(function () {
      this.query.q = ''
    })*/






    this.eventSevice.subscribe('loginSuccess', function (event, param) {
      this.globalService.ticket.screenUsername = this.globalService.ticket.principal
      this.listConfigurations()
      this.loadNotes()
      this.getHomeNote()
    })


  }

  // 获取版本号
  getZeppelinVersion () {
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/version')
      .subscribe(
        response => {
          this.globalService.zeppelinVersion = response['body']
        },
        errorResponse => {
          console.log('Error %o %o', status, errorResponse.message)
        }
      );
  }

  isFilterNoteFunc (note) {

    // TODO
    /*if (!$scope.query.q) {
      return true
    }

    let noteName = note.name
    if (noteName.toLowerCase().indexOf($scope.query.q.toLowerCase()) > -1) {
      return true
    }*/
    return false
  }

  isActiveFunc (noteId) {
    // TODO
    /*return ($routeParams.noteId === noteId)*/
  }

  listConfigurations () {
    this.websocketMsgSrv.listConfigurations()
  }

  loadNotes () {
    this.websocketMsgSrv.getNoteList()
  }

  getHomeNote () {
    this.websocketMsgSrv.getHomeNote()
  }

  logoutFunc () {
    //let logoutURL = this.baseUrlSrv.getRestApiBase() + '/login/logout'

    let vm = this

    // for firefox and safari
    //logoutURL = logoutURL.replace('//', '//false:false@')

    // TODO
    /*vm.httpClient.post(logoutURL).error(function () {
      // force authcBasic (if configured) to logout
      vm.httpClient.post(logoutURL).error(function () {
        vm.globalService.userName = ''
        vm.globalService.ticket.principal = ''
        vm.globalService.ticket.screenUsername = ''
        vm.globalService.ticket.ticket = ''
        vm.globalService.ticket.roles = ''

        // TODO show
        BootstrapDialog.show({
          message: 'Logout Success'
        })
        setTimeout(function () {
          window.location = vm.baseUrlSrv.getBase()
        }, 1000)
      })
    })*/
  }

  searchFunc (searchTerm) {
    this.router.navigate(['/search/' + searchTerm])
  }

  showLoginWindowFunc () {

    let disposable = this.dialogService.addDialog(ModalComponent, {
      title:'Confirm title',
      message:'Confirm message'})
      .subscribe((isConfirmed)=>{
        //We get dialog result
        if(isConfirmed) {
          alert('accepted');
        }
        else {
          alert('declined');
        }
      });
    //We can close dialog calling disposable.unsubscribe();
    //If dialog was not closed manually close it by timeout
    setTimeout(()=>{
      disposable.unsubscribe();
    },1000);

    //this.router.navigate(['/login'])
    // TODO
    /*setTimeout(function () {
      angular.element('#userName').focus()
    }, 500)*/
  }

  /*
   ** Performance optimization for Browser Render.
   */
  initNotebookListEventListener () {
    // TODO
    /*angular.element(document).ready(function () {
      angular.element('.notebook-list-dropdown').on('show.bs.dropdown', function () {
        $scope.isDrawNavbarNoteList = true
      })

      angular.element('.notebook-list-dropdown').on('hide.bs.dropdown', function () {
        $scope.isDrawNavbarNoteList = false
      })
    })*/
  }

  calculateTooltipPlacement(note) {
    if (note !== undefined && note.name !== undefined) {
      let length = note.name.length
      if (length < 2) {
        return 'top-left'
      } else if (length > 7) {
        return 'top-right'
      }
    }
    return 'top'
  }
}
