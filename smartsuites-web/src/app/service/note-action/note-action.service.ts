import { Injectable } from '@angular/core';
import {WebsocketMessageService} from "../websocket/websocket-message.service";
import {Router} from "@angular/router";
import {NoteRenameService} from "../note-rename/note-rename.service";
import {NoteListService} from "../note-list/note-list.service";
import {ConfirmationService} from "primeng/primeng";

@Injectable()
export class NoteActionService {

  constructor(private websocketMsgSrv:WebsocketMessageService,
              private router:Router,
              private noteRenameService:NoteRenameService,
              private noteListFactory:NoteListService,
              private confirmationService: ConfirmationService) { }

  moveNoteToTrash(noteId, redirectToHome) {
    this.confirmationService.confirm({
      message: '笔记将被删除到 <strong>回收站</strong>.',
      header: '删除笔记到回收站?',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.websocketMsgSrv.moveNoteToTrash(noteId)
        if (redirectToHome) {
          this.router.navigate(['/analysisDashboard'])
        }
      },
      reject: () => {
      }
    });
  }

  moveFolderToTrash(folderId) {
    this.confirmationService.confirm({
      message: '整个文件夹将要被删除到 <strong>回收站</strong>.',
      header: '删除文件夹到回收站?',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.websocketMsgSrv.moveFolderToTrash(folderId)
      },
      reject: () => {
      }
    });
  }

  removeNote = function (noteId, redirectToHome) {
    this.confirmationService.confirm({
      message: 'This cannot be undone. Are you sure?',
      header: 'WARNING! This note will be removed permanently',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.websocketMsgSrv.deleteNote(noteId)
        if (redirectToHome) {
          this.router.navigate(['/'])
        }
      },
      reject: () => {
      }
    });
  }

  removeFolder(folderId) {
    this.confirmationService.confirm({
      message: 'This folder will be removed permanently. This cannot be undone. Are you sure?',
      header: 'WARNING!',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.websocketMsgSrv.removeFolder(folderId)
      },
      reject: () => {
      }
    });
  }

  restoreAll = function () {
    this.confirmationService.confirm({
      message: 'Folders and notes in the trash will be \' +\n' +
      '      \'<strong>merged</strong> into their original position.',
      header: 'Are you sure want to restore all notes in the trash?',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.websocketMsgSrv.restoreAll()
      },
      reject: () => {
      }
    });
  }

  emptyTrash = function () {
    this.confirmationService.confirm({
      message: 'Notes under trash will be removed permanently. This cannot be undone. Are you sure?',
      header: 'WARNING!',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.websocketMsgSrv.emptyTrash()
      },
      reject: () => {
      }
    });
  }

  clearAllParagraphOutput = function (noteId) {
    this.confirmationService.confirm({
      message: 'Do you want to clear all output?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.websocketMsgSrv.clearAllParagraphOutput(noteId)
      },
      reject: () => {
      }
    });
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
