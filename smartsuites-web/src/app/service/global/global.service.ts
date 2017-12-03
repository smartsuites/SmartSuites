import { Injectable } from '@angular/core';
import {Ticket} from "../../model/Ticket";

@Injectable()
export class GlobalService {

  ticket:Ticket;

  zeppelinVersion:String

  userName

  author = "yufei.wu@live.com"

  constructor() {
    this.ticket = new Ticket()
  }

}
