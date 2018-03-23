import { Injectable } from '@angular/core';
import {EventService} from "../event/event.service";

@Injectable()
export class NoteRenameService {

  constructor(public eventService:EventService) { }

  /**
   * <options schema>
   * title: string - Modal title
   * oldName: string - name to initialize input
   * callback: (newName: string)=>void - callback onButtonClick
   * validator: (str: string)=>boolean - input validator
   */
  openRenameModal(options) {
    this.eventService.broadcast('openRenameModal', options)
  }

}
