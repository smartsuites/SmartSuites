import { Injectable } from '@angular/core';
import {WebsocketEventService} from "./websocket-event.service";

@Injectable()
export class WebsocketMessageService {

  constructor(public websocketEvents:WebsocketEventService) { }


  getHomeNote() {
    this.websocketEvents.sendNewEvent({op: 'GET_HOME_NOTE'})
  }

  createNotebook(noteName, defaultInterpreterId) {
    this.websocketEvents.sendNewEvent({
      op: 'NEW_NOTE',
      data: {
        name: noteName,
        defaultInterpreterId: defaultInterpreterId
      }
    })
  }

  moveNoteToTrash(noteId) {
    this.websocketEvents.sendNewEvent({op: 'MOVE_NOTE_TO_TRASH', data: {id: noteId}})
  }

  moveFolderToTrash(folderId) {
    this.websocketEvents.sendNewEvent({op: 'MOVE_FOLDER_TO_TRASH', data: {id: folderId}})
  }

  restoreNote(noteId) {
    this.websocketEvents.sendNewEvent({op: 'RESTORE_NOTE', data: {id: noteId}})
  }

  restoreFolder(folderId) {
    this.websocketEvents.sendNewEvent({op: 'RESTORE_FOLDER', data: {id: folderId}})
  }

  restoreAll() {
    this.websocketEvents.sendNewEvent({op: 'RESTORE_ALL'})
  }

  deleteNote(noteId) {
    this.websocketEvents.sendNewEvent({op: 'DEL_NOTE', data: {id: noteId}})
  }

  removeFolder(folderId) {
    this.websocketEvents.sendNewEvent({op: 'REMOVE_FOLDER', data: {id: folderId}})
  }

  emptyTrash() {
    this.websocketEvents.sendNewEvent({op: 'EMPTY_TRASH'})
  }

  cloneNote(noteIdToClone, newNoteName) {
    this.websocketEvents.sendNewEvent({op: 'CLONE_NOTE', data: {id: noteIdToClone, name: newNoteName}})
  }

  getNoteList() {
    this.websocketEvents.sendNewEvent({op: 'LIST_NOTES'})
  }

  reloadAllNotesFromRepo() {
    this.websocketEvents.sendNewEvent({op: 'RELOAD_NOTES_FROM_REPO'})
  }

  getNote(noteId) {
    this.websocketEvents.sendNewEvent({op: 'GET_NOTE', data: {id: noteId}})
  }

  updateNote(noteId, noteName, noteConfig) {
    this.websocketEvents.sendNewEvent({op: 'NOTE_UPDATE', data: {id: noteId, name: noteName, config: noteConfig}})
  }

  updatePersonalizedMode(noteId, modeValue) {
    this.websocketEvents.sendNewEvent({op: 'UPDATE_PERSONALIZED_MODE', data: {id: noteId, personalized: modeValue}})
  }

  renameNote(noteId, noteName) {
    this.websocketEvents.sendNewEvent({op: 'NOTE_RENAME', data: {id: noteId, name: noteName}})
  }

  renameFolder(folderId, folderName) {
    this.websocketEvents.sendNewEvent({op: 'FOLDER_RENAME', data: {id: folderId, name: folderName}})
  }

  moveParagraph(paragraphId, newIndex) {
    this.websocketEvents.sendNewEvent({op: 'MOVE_PARAGRAPH', data: {id: paragraphId, index: newIndex}})
  }

  insertParagraph(newIndex) {
    this.websocketEvents.sendNewEvent({op: 'INSERT_PARAGRAPH', data: {index: newIndex}})
  }

  copyParagraph(newIndex, paragraphTitle, paragraphData,
                           paragraphConfig, paragraphParams) {
    this.websocketEvents.sendNewEvent({
      op: 'COPY_PARAGRAPH',
      data: {
        index: newIndex,
        title: paragraphTitle,
        paragraph: paragraphData,
        config: paragraphConfig,
        params: paragraphParams
      }
    })
  }

  updateAngularObject(noteId, paragraphId, name, value, interpreterGroupId) {
    this.websocketEvents.sendNewEvent({
      op: 'ANGULAR_OBJECT_UPDATED',
      data: {
        noteId: noteId,
        paragraphId: paragraphId,
        name: name,
        value: value,
        interpreterGroupId: interpreterGroupId
      }
    })
  }

  clientBindAngularObject(noteId, name, value, paragraphId) {
    this.websocketEvents.sendNewEvent({
      op: 'ANGULAR_OBJECT_CLIENT_BIND',
      data: {
        noteId: noteId,
        name: name,
        value: value,
        paragraphId: paragraphId
      }
    })
  }

  clientUnbindAngularObject(noteId, name, paragraphId) {
    this.websocketEvents.sendNewEvent({
      op: 'ANGULAR_OBJECT_CLIENT_UNBIND',
      data: {
        noteId: noteId,
        name: name,
        paragraphId: paragraphId
      }
    })
  }

  cancelParagraphRun(paragraphId) {
    this.websocketEvents.sendNewEvent({op: 'CANCEL_PARAGRAPH', data: {id: paragraphId}})
  }

  paragraphExecutedBySpell(paragraphId, paragraphTitle,
                                      paragraphText, paragraphResultsMsg,
                                      paragraphStatus, paragraphErrorMessage,
                                      paragraphConfig, paragraphParams,
                                      paragraphDateStarted, paragraphDateFinished) {
    this.websocketEvents.sendNewEvent({
      op: 'PARAGRAPH_EXECUTED_BY_SPELL',
      data: {
        id: paragraphId,
        title: paragraphTitle,
        paragraph: paragraphText,
        results: {
          code: paragraphStatus,
          msg: paragraphResultsMsg.map(dataWithType => {
            let serializedData = dataWithType.data
            return { type: dataWithType.type, data: serializedData, }
          })
        },
        status: paragraphStatus,
        errorMessage: paragraphErrorMessage,
        config: paragraphConfig,
        params: paragraphParams,
        dateStarted: paragraphDateStarted,
        dateFinished: paragraphDateFinished,
      }
    })
  }

  runParagraph(paragraphId, paragraphTitle, paragraphData, paragraphConfig, paragraphParams) {
    this.websocketEvents.sendNewEvent({
      op: 'RUN_PARAGRAPH',
      data: {
        id: paragraphId,
        title: paragraphTitle,
        paragraph: paragraphData,
        config: paragraphConfig,
        params: paragraphParams
      }
    })
  }

  runAllParagraphs(noteId, paragraphs) {
    this.websocketEvents.sendNewEvent({
      op: 'RUN_ALL_PARAGRAPHS',
      data: {
        noteId: noteId,
        paragraphs: JSON.stringify(paragraphs)
      }
    })
  }

  removeParagraph(paragraphId) {
    this.websocketEvents.sendNewEvent({op: 'PARAGRAPH_REMOVE', data: {id: paragraphId}})
  }

  clearParagraphOutput(paragraphId) {
    this.websocketEvents.sendNewEvent({op: 'PARAGRAPH_CLEAR_OUTPUT', data: {id: paragraphId}})
  }

  clearAllParagraphOutput(noteId) {
    this.websocketEvents.sendNewEvent({op: 'PARAGRAPH_CLEAR_ALL_OUTPUT', data: {id: noteId}})
  }

  completion(paragraphId, buf, cursor) {
    this.websocketEvents.sendNewEvent({
      op: 'COMPLETION',
      data: {
        id: paragraphId,
        buf: buf,
        cursor: cursor
      }
    })
  }

  commitParagraph(paragraphId, paragraphTitle, paragraphData, paragraphConfig, paragraphParams, noteId) {
    return this.websocketEvents.sendNewEvent({
      op: 'COMMIT_PARAGRAPH',
      data: {
        id: paragraphId,
        noteId: noteId,
        title: paragraphTitle,
        paragraph: paragraphData,
        config: paragraphConfig,
        params: paragraphParams
      }
    })
  }

  importNote(note) {
    this.websocketEvents.sendNewEvent({
      op: 'IMPORT_NOTE',
      data: {
        note: note
      }
    })
  }

  checkpointNote(noteId, commitMessage) {
    this.websocketEvents.sendNewEvent({
      op: 'CHECKPOINT_NOTE',
      data: {
        noteId: noteId,
        commitMessage: commitMessage
      }
    })
  }

  setNoteRevision(noteId, revisionId) {
    this.websocketEvents.sendNewEvent({
      op: 'SET_NOTE_REVISION',
      data: {
        noteId: noteId,
        revisionId: revisionId
      }
    })
  }

  listRevisionHistory(noteId) {
    this.websocketEvents.sendNewEvent({
      op: 'LIST_REVISION_HISTORY',
      data: {
        noteId: noteId
      }
    })
  }

  getNoteByRevision(noteId, revisionId) {
    this.websocketEvents.sendNewEvent({
      op: 'NOTE_REVISION',
      data: {
        noteId: noteId,
        revisionId: revisionId
      }
    })
  }

  getEditorSetting(paragraphId, replName) {
    this.websocketEvents.sendNewEvent({
      op: 'EDITOR_SETTING',
      data: {
        paragraphId: paragraphId,
        magic: replName
      }
    })
  }

  isConnected() {
    return this.websocketEvents.isConnected()
  }

  getJobs() {
    this.websocketEvents.sendNewEvent({op: 'LIST_NOTE_JOBS'})
  }

  disconnectJobEvent() {
    this.websocketEvents.sendNewEvent({op: 'UNSUBSCRIBE_UPDATE_NOTE_JOBS'})
  }

  getUpdateNoteJobsList(lastUpdateServerUnixTime) {
    this.websocketEvents.sendNewEvent(
      {op: 'LIST_UPDATE_NOTE_JOBS', data: {lastUpdateUnixTime: lastUpdateServerUnixTime * 1}}
    )
  }

  getInterpreterBindings(noteId) {
    this.websocketEvents.sendNewEvent({op: 'GET_INTERPRETER_BINDINGS', data: {noteId: noteId}})
  }

  saveInterpreterBindings(noteId, selectedSettingIds) {
    this.websocketEvents.sendNewEvent({op: 'SAVE_INTERPRETER_BINDINGS',
      data: {noteId: noteId, selectedSettingIds: selectedSettingIds}})
  }

  listConfigurations() {
    this.websocketEvents.sendNewEvent({op: 'LIST_CONFIGURATIONS'})
  }

  getInterpreterSettings() {
    this.websocketEvents.sendNewEvent({op: 'GET_INTERPRETER_SETTINGS'})
  }

}
