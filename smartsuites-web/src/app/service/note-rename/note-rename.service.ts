import { Injectable } from '@angular/core';
import {EventService} from "../event/event.service";

@Injectable()
export class NoteRenameService {

  constructor(public eventService:EventService) { }

  openRenameModal(options) {
    this.eventService.broadcast('openRenameModal', options)
  }

}
