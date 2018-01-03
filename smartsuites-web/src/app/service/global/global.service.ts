import { Injectable } from '@angular/core';
import {Ticket} from "../../model/Ticket";

// Should Not Use Directly
@Injectable()
export class GlobalService {

  ticket:Ticket;

  dataSmartVersion:String

  login:boolean

  role:string

  isMac:boolean

  constructor() {
    this.ticket = new Ticket()
    this.login = false
  }

}
