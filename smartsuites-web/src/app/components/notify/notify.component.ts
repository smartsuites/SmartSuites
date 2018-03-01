import { Component, OnInit } from '@angular/core';
import {NotifyService} from "../../service/notify/notify.service";

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit {

  min_height = window.innerHeight - 183 + 'px'

  constructor(public notifyService:NotifyService) { }

  ngOnInit() {
  }

  resolveEvent(id){
    console.log(id)
  }



}
