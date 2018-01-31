import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class EventService1 {

  private _topic

  constructor() {
    let initEvent = new EventObject(EventType.PLATFORM_INIT,"")
    this._topic = new BehaviorSubject<EventObject>(initEvent)
  }

  broadcast(eventType, ...eventMsg){
    let eventObject = new EventObject(eventType,eventMsg)
    this._topic.next(eventObject)
  }

  subscribe(eventType,callback) {
    this._topic.subscribe({
      next: (v) => {
        if(v.eventType.trim() == eventType.trim()){
          callback(v.eventMsg[0])
          console.log("event:"+eventType + " data:")
          console.log(v.eventMsg[0])
        }
      }
    })
  }

  unsubscribe(subscription){
    subscription.unsubscribe()
  }

}

export class EventObject{
  eventType:String
  eventMsg:any

  constructor(eventType, eventMsg) {
    this.eventType = eventType;
    this.eventMsg = eventMsg;
  }
}

var EventType = {
  //********** INIT ************
  PLATFORM_INIT : 'platform_init',

  //********** WEBSOCKET **********
  setConnectedStatus : 'setConnectedStatus',
  setNoteContent : 'setNoteContent',
  setNoteMenu : 'setNoteMenu',
  //jobmanager:set-jobs:'jobmanager:set-jobs',
  //jobmanager:update-jobs: 'jobmanager:update-jobs',
  updateParagraph : 'updateParagraph',
  runParagraphUsingSpell : 'runParagraphUsingSpell',
  appendParagraphOutput : 'appendParagraphOutput',
  updateParagraphOutput : 'updateParagraphOutput',
  updateProgress : 'updateProgress',
  completionList : 'completionList',
  editorSetting : 'editorSetting',
  angularObjectUpdate : 'angularObjectUpdate',
  angularObjectRemove : 'angularObjectRemove',
  appendAppOutput : 'appendAppOutput',
  updateAppOutput : 'updateAppOutput',
  appLoad : 'appLoad',
  appStatusChange : 'appStatusChange',
  listRevisionHistory : 'listRevisionHistory',
  noteRevision : 'noteRevision',
  interpreterBindings : 'interpreterBindings',
  session_logout : 'session_logout',
  configurationsInfo : 'configurationsInfo',
  interpreterSettings : 'interpreterSettings',
  addParagraph : 'addParagraph',
  removeParagraph : 'removeParagraph',
  moveParagraph : 'moveParagraph',
  updateNote : 'updateNote',
  setNoteRevisionResult : 'setNoteRevisionResult',
  updateParaInfos : 'updateParaInfos',


  openRenameModal: 'openRenameModal',
  setLookAndFeel : 'setLookAndFeel',
  platformStartup : 'platformStartup'

}
export {EventType}
