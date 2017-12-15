import { Injectable } from '@angular/core';
import {Ticket} from "../../model/Ticket";

// Should Not Use Directly
@Injectable()
export class GlobalService {

  ticket:Ticket;

  zeppelinVersion:String

  login:boolean

  //userName

  //author = "yufei.wu@live.com"

  constructor() {
    this.ticket = new Ticket()
    this.login = false
  }

}
