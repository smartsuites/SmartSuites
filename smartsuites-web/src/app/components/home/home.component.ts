import { Component, OnInit } from '@angular/core';
import {NoteListService} from "../../service/note-list/note-list.service";
import {WebsocketMessageService} from "../../service/websocket/websocket-message.service";
import {ArrayOrderingService} from "../../service/array-ordering/array-ordering.service";
import {NoteActionService} from "../../service/note-action/note-action.service";
import {GlobalService} from "../../service/global/global.service";
import {EventService} from "../../service/event/event.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  notebookHome = false
  noteCustomHome = true

  staticHome

  isReloading = false
  TRASH_FOLDER_ID
  query = {q: ''}

  initHome

  isReloadingNotes

  note

  viewOnly

  constructor(public noteListFactory:NoteListService,
              public websocketMsgSrv:WebsocketMessageService,
              public arrayOrderingSrv:ArrayOrderingService,
              public noteActionService:NoteActionService,
              public globalService:GlobalService,
              public eventService:EventService) { }

  ngOnInit() {
    //TODO
    //ngToast.dismiss()
    let vm = this

    if (this.globalService.ticket !== null) {
      vm.staticHome = false
    } else {
      vm.staticHome = true
    }

    // 平台启动加载Notes
    this.eventService.subscribe('platformStartup', function (msg) {
      vm.initHomeFunc()
    })

    vm.eventService.subscribe('setNoteContent', function (note) {
      if (vm.noteCustomHome) {
        return
      }
      if (note) {
        vm.note = note

        // initialize look And Feel
        vm.eventService.broadcast('setLookAndFeel', 'home')

        // make it read only
        vm.viewOnly = true

        vm.notebookHome = true
        vm.staticHome = false
      } else {
        vm.staticHome = true
        vm.notebookHome = false
      }
    })

    vm.eventService.subscribe('setNoteMenu', function (notes) {
      vm.isReloadingNotes = false
    })


    // TODO
    /*angular.element('#loginModal').on('hidden.bs.modal', function (e) {
      $rootScope.$broadcast('initLoginValues')
    })*/

  }

  initHomeFunc() {
    this.websocketMsgSrv.getHomeNote()
    this.noteCustomHome = false
  }

  reloadNoteList() {
    this.websocketMsgSrv.reloadAllNotesFromRepo()
    this.isReloadingNotes = true
  }

  toggleFolderNode(node) {
    node.hidden = !node.hidden
  }

  renameNote(nodeId, nodePath) {
    this.noteActionService.renameNote(nodeId, nodePath)
  }

  moveNoteToTrash(noteId) {
    this.noteActionService.moveNoteToTrash(noteId, false)
  }

  moveFolderToTrash(folderId) {
    this.noteActionService.moveFolderToTrash(folderId)
  }

  restoreNote(noteId) {
    this.websocketMsgSrv.restoreNote(noteId)
  }

  restoreFolder(folderId) {
    this.websocketMsgSrv.restoreFolder(folderId)
  }

  restoreAll() {
    this.noteActionService.restoreAll()
  }

  renameFolder(node) {
    this.noteActionService.renameFolder(node.id)
  }

  removeNote(noteId) {
    this.noteActionService.removeNote(noteId, false)
  }

  removeFolder(folderId) {
    this.noteActionService.removeFolder(folderId)
  }

  emptyTrash() {
    this.noteActionService.emptyTrash()
  }

  clearAllParagraphOutput(noteId) {
    this.noteActionService.clearAllParagraphOutput(noteId)
  }

  isFilterNote(note) {
    if (!this.query.q) {
      return true
    }

    let noteName = note.name
    if (noteName.toLowerCase().indexOf(this.query.q.toLowerCase()) > -1) {
      return true
    }
    return false
  }

  getNoteName(note) {
    //return this.arrayOrderingSrv.getNoteName(note)
  }

  noteComparator(note1, note2) {
    //return this.arrayOrderingSrv.noteComparator(note1, note2)
  }
}
