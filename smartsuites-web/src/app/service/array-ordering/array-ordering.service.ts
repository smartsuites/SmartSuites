import { Injectable } from '@angular/core';

@Injectable()
export class ArrayOrderingService {

  // 回收站ID？
  TRASH_FOLDER_ID:String

  constructor() {
    //this.TRASH_FOLDER_ID = TRASH_FOLDER_ID
  }

  noteListOrdering(note):String {
    if (note.id === this.TRASH_FOLDER_ID) {
      return '\uFFFF'
    }
    return this.getNoteName(note)
  }

  getNoteName(note):string {
    if (note.name === undefined || note.name.trim() === '') {
      return 'Note ' + note.id
    } else {
      return note.name
    }
  }

  noteComparator(v1, v2):number {
    let note1 = v1.value
    let note2 = v2.value

    if (note1.id === this.TRASH_FOLDER_ID) {
      return 1
    }

    if (note2.id === this.TRASH_FOLDER_ID) {
      return -1
    }

    if (note1.children === undefined && note2.children !== undefined) {
      return 1
    }

    if (note1.children !== undefined && note2.children === undefined) {
      return -1
    }

    let noteName1 = this.getNoteName(note1)
    let noteName2 = this.getNoteName(note2)

    return noteName1.localeCompare(noteName2)
  }
}
