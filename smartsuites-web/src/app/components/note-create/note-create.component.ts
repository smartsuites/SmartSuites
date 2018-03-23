import { Component, OnInit } from '@angular/core';
import {WebsocketMessageService} from "../../service/websocket/websocket-message.service";
import {NoteListService} from "../../service/note-list/note-list.service";
import {EventService} from "../../service/event/event.service";
import {SelectItem} from "primeng/primeng";

@Component({
  selector: 'app-note-create',
  templateUrl: './note-create.component.html',
  styleUrls: ['./note-create.component.css']
})
export class NoteCreateComponent implements OnInit {

  dialogDisplay = false;

  // 是否clone note
  clone = false

  notes

  sourceNoteName

  note = {
    notename:'',
    defaultInterpreter:null,
    paragraphs:[]
  }
  interpreterSettings = []
  //note.defaultInterpreter = null

  createNote() {
    let vm = this;
    vm.updateDefaultInterpreter()
    if (!vm.clone) {
      let defaultInterpreterId = ''
      if (vm.note.defaultInterpreter !== null) {
        defaultInterpreterId = vm.note.defaultInterpreter.id
      }
      vm.websocketMsgSrv.createNotebook(vm.note.notename, defaultInterpreterId)
      vm.note.defaultInterpreter = vm.interpreterSettings[0]
    }
  }

  cloneNote(noteId) {
    let vm = this;
    vm.updateDefaultInterpreter()
    vm.websocketMsgSrv.cloneNote(noteId, vm.note.notename)
  }

  openCreateNoteDialog(path?){
    this.dialogDisplay = true
    this.clone = false
    this.note.notename = this.newNoteName(path)
  }

  openCloneNoteDialog(sourceNoteName){
    this.dialogDisplay = true
    this.clone = true
    this.sourceNoteName = sourceNoteName
    this.note.notename = this.cloneNoteName()
  }

  handleNameEnter() {
    let vm = this;
    vm.createNote()
  }

  /*preVisible(clone, sourceNoteName, path) {
    let vm = this;
    vm.clone = clone
    vm.sourceNoteName = sourceNoteName
    vm.note.notename = vm.clone ? vm.cloneNoteName() : vm.newNoteName(path)
  }*/

  newNoteName(path?) {
    let vm = this;
    let newCount = 1
    vm.notes.flatList.forEach( function (noteName) {
      noteName = noteName.name
      if (noteName.match(/^Untitled Note [0-9]*$/)) {
        let lastCount = noteName.substr(14) * 1
        if (newCount <= lastCount) {
          newCount = lastCount + 1
        }
      }
    })
    return (path ? path + '/' : '') + 'Untitled Note ' + newCount
  }

  cloneNoteName() {
    let vm = this;
    let copyCount = 1
    let newCloneName = ''
    let lastIndex = vm.sourceNoteName.lastIndexOf(' ')
    let endsWithNumber = !!vm.sourceNoteName.match('^.+?\\s\\d$')
    let noteNamePrefix = endsWithNumber ? vm.sourceNoteName.substr(0, lastIndex) : vm.sourceNoteName
    let regexp = new RegExp('^' + noteNamePrefix + ' .+')

    vm.notes.flatList.forEach(function (noteName) {
      noteName = noteName.name
      if (noteName.match(regexp)) {
        let lastCopyCount = noteName.substr(lastIndex).trim()
        newCloneName = noteNamePrefix
        lastCopyCount = parseInt(lastCopyCount)
        if (copyCount <= lastCopyCount) {
          copyCount = lastCopyCount + 1
        }
      }
    })

    if (!newCloneName) {
      newCloneName = vm.sourceNoteName
    }
    return newCloneName + ' ' + copyCount
  }

  getInterpreterSettings() {
    this.websocketMsgSrv.getInterpreterSettings()
  }


  interpreterSettingOptions: SelectItem[] = [];
  selectInterpreterSetting: SelectItem;

  updateDefaultInterpreter(){
    if(this.selectInterpreterSetting){
      for(let interpreterSetting of this.interpreterSettings){
        if(interpreterSetting.id == this.selectInterpreterSetting.value.id){
          this.note.defaultInterpreter = interpreterSetting
        }
      }
    }
  }

  constructor(private noteListFactory:NoteListService,
              private websocketMsgSrv:WebsocketMessageService,
              private eventService:EventService) {
    this.notes = noteListFactory.notes
  }

  ngOnInit() {
    let self = this;
    this.eventService.subscribe('interpreterSettings', function (data) {

      self.interpreterSettings = data.interpreterSettings

      for(let interpreterSetting of data.interpreterSettings){
        self.interpreterSettingOptions.push({label: interpreterSetting.name, value: {id: interpreterSetting.id}});
      }

      // initialize default interpreter with Spark interpreter
      self.note.defaultInterpreter = data.interpreterSettings[0]
    })
  }

}
