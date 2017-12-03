import { Injectable } from '@angular/core';
import {WebsocketMessageService} from "../websocket/websocket-message.service";
import {Router} from "@angular/router";
import {NoteRenameService} from "../note-rename/note-rename.service";
import {NoteListService} from "../note-list/note-list.service";

@Injectable()
export class NoteActionService {

  constructor(public websocketMsgSrv:WebsocketMessageService,
              public router:Router,
              public noteRenameService:NoteRenameService,
              public noteListFactory:NoteListService) { }

  moveNoteToTrash(noteId, redirectToHome) {
    /*BootstrapDialog.confirm({
      closable: true,
      title: 'Move this note to trash?',
      message: 'This note will be moved to <strong>trash</strong>.',
      callback: function (result) {
        if (result) {
          this.websocketMsgSrv.moveNoteToTrash(noteId)
          if (redirectToHome) {
            this.router.navigate(['/'])
          }
        }
      }
    })*/
  }

  moveFolderToTrash(folderId) {
    /*BootstrapDialog.confirm({
      closable: true,
      title: 'Move this folder to trash?',
      message: 'This folder will be moved to <strong>trash</strong>.',
      callback: function (result) {
        if (result) {
          this.websocketMsgSrv.moveFolderToTrash(folderId)
        }
      }
    })*/
  }

  removeNote = function (noteId, redirectToHome) {
    /*BootstrapDialog.confirm({
      type: BootstrapDialog.TYPE_WARNING,
      closable: true,
      title: 'WARNING! This note will be removed permanently',
      message: 'This cannot be undone. Are you sure?',
      callback: function (result) {
        if (result) {
          this.websocketMsgSrv.deleteNote(noteId)
          if (redirectToHome) {
            this.router.navigate(['/'])
          }
        }
      }
    })*/
  }

  removeFolder(folderId) {
    /*BootstrapDialog.confirm({
      type: BootstrapDialog.TYPE_WARNING,
      closable: true,
      title: 'WARNING! This folder will be removed permanently',
      message: 'This cannot be undone. Are you sure?',
      callback: function (result) {
        if (result) {
          this.websocketMsgSrv.removeFolder(folderId)
        }
      }
    })*/
  }

  restoreAll = function () {
    /*BootstrapDialog.confirm({
      closable: true,
      title: 'Are you sure want to restore all notes in the trash?',
      message: 'Folders and notes in the trash will be ' +
      '<strong>merged</strong> into their original position.',
      callback: function (result) {
        if (result) {
          this.websocketMsgSrv.restoreAll()
        }
      }
    })*/
  }

  emptyTrash = function () {
    /*BootstrapDialog.confirm({
      type: BootstrapDialog.TYPE_WARNING,
      closable: true,
      title: 'WARNING! Notes under trash will be removed permanently',
      message: 'This cannot be undone. Are you sure?',
      callback: function (result) {
        if (result) {
          this.websocketMsgSrv.emptyTrash()
        }
      }
    })*/
  }

  clearAllParagraphOutput = function (noteId) {
    /*BootstrapDialog.confirm({
      closable: true,
      title: '',
      message: 'Do you want to clear all output?',
      callback: function (result) {
        if (result) {
          this.websocketMsgSrv.clearAllParagraphOutput(noteId)
        }
      }
    })*/
  }

  renameNote(noteId, notePath) {
    this.noteRenameService.openRenameModal({
      title: 'Rename note',
      oldName: notePath,
      callback: function (newName) {
        this.websocketMsgSrv.renameNote(noteId, newName)
      }
    })
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
