import { Injectable } from '@angular/core';
import {WebsocketMessageService} from "../websocket/websocket-message.service";
import {Router} from "@angular/router";
import {NoteRenameService} from "../note-rename/note-rename.service";
import {NoteListService} from "../note-list/note-list.service";
//import {NzModalService} from "ng-zorro-antd";

@Injectable()
export class NoteActionService {

  constructor(private websocketMsgSrv:WebsocketMessageService,
              private router:Router,
              private noteRenameService:NoteRenameService,
              private noteListFactory:NoteListService,
              /*private modalService:NzModalService*/) { }

  moveNoteToTrash(noteId, redirectToHome) {
    /*this.modalService.confirm({
      closable: true,
      title: 'Move this note to trash?',
      content: 'This note will be moved to <strong>trash</strong>.',
      onOk(){
        this.websocketMsgSrv.moveNoteToTrash(noteId)
        if (redirectToHome) {
          this.router.navigate(['/'])
        }
      }
    })*/
  }

  moveFolderToTrash(folderId) {
    /*this.modalService.confirm({
      closable: true,
      title: 'Move this folder to trash?',
      content: 'This folder will be moved to <strong>trash</strong>.',
      onOk(){
        this.websocketMsgSrv.moveFolderToTrash(folderId)
      }
    })*/
  }

  removeNote = function (noteId, redirectToHome) {
    this.modalService.confirm({
      iconType: 'warning',
      closable: true,
      title: 'WARNING! This note will be removed permanently',
      content: 'This cannot be undone. Are you sure?',
      onOk(){
        this.websocketMsgSrv.deleteNote(noteId)
        if (redirectToHome) {
          this.router.navigate(['/'])
        }
      }
    })
  }

  removeFolder(folderId) {
    /*this.modalService.confirm({
      iconType: 'warning',
      closable: true,
      title: 'WARNING! This folder will be removed permanently',
      content: 'This cannot be undone. Are you sure?',
      onOk(){
        this.websocketMsgSrv.removeFolder(folderId)
      }
    })*/
  }

  restoreAll = function () {
    /*this.modalService.confirm({
      closable: true,
      title: 'Are you sure want to restore all notes in the trash?',
      content: 'Folders and notes in the trash will be ' +
      '<strong>merged</strong> into their original position.',
      onOk(){
        this.websocketMsgSrv.restoreAll()
      }
    })*/
  }

  emptyTrash = function () {
    /*this.modalService.confirm({
      iconType: 'warning',
      closable: true,
      title: 'WARNING! Notes under trash will be removed permanently',
      content: 'This cannot be undone. Are you sure?',
      onOk(){
        this.websocketMsgSrv.emptyTrash()
      }
    })*/
  }

  clearAllParagraphOutput = function (noteId) {
    /*this.modalService.confirm({
      closable: true,
      title: '',
      content: 'Do you want to clear all output?',
      onOk() {
        this.websocketMsgSrv.clearAllParagraphOutput(noteId)
      }
    })*/
  }

  renameNote(noteId, notePath) {
    /*this.noteRenameService.openRenameModal({
      title: 'Rename note',
      oldName: notePath,
      callback: function (newName) {
        this.websocketMsgSrv.renameNote(noteId, newName)
      }
    })*/
  }

  renameFolder(folderId) {
    this.noteRenameService.openRenameModal({
      title: 'Rename folder',
      oldName: folderId,
      callback: function (newName) {
        let newFolderId = this.normalizeFolderId(newName)
        /*if (_.has(this.noteListFactory.flatFolderMap, newFolderId)) {
          BootstrapDialog.confirm({
            type: BootstrapDialog.TYPE_WARNING,
            closable: true,
            title: 'WARNING! The folder will be MERGED',
            message: 'The folder will be merged into <strong>' + newFolderId + '</strong>. Are you sure?',
            callback: function (result) {
              if (result) {
                this.websocketMsgSrv.renameFolder(folderId, newFolderId)
              }
            }
          })
        } else {
          this.websocketMsgSrv.renameFolder(folderId, newFolderId)
        }*/
      }
    })
  }

  normalizeFolderId (folderId) {
    folderId = folderId.trim()

    while (folderId.indexOf('\\') > -1) {
      folderId = folderId.replace('\\', '/')
    }

    while (folderId.indexOf('///') > -1) {
      folderId = folderId.replace('///', '/')
    }

    folderId = folderId.replace('//', '/')

    if (folderId === '/') {
      return '/'
    }

    if (folderId[0] === '/') {
      folderId = folderId.substring(1)
    }

    if (folderId.slice(-1) === '/') {
      folderId = folderId.slice(0, -1)
    }

    return folderId
  }

}
