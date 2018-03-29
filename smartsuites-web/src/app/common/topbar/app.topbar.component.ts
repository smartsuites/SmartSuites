import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {LoginService} from "../../service/login/login.service";
import {GlobalService} from "../../service/global/global.service";
import {EventService} from "../../service/event/event.service";
import {Constants} from "../../model/Constants";
import {MessageService} from "primeng/components/common/messageservice";
import {Message} from "primeng/primeng";
import {NotifyService} from "../../service/notify/notify.service";
import {NoteActionService} from "../../service/note-action/note-action.service";

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrls: ['./app.topbar.component.css']
})
export class AppTopbarComponent implements OnInit,OnDestroy{

  recycleList = []

  msgs: Message[] = [];

  //显示个人配置对话框
  showPersonalSetting = false;

  subscribers = []

  constructor(public app: AppComponent,
              public loginService: LoginService,
              public eventService:EventService,
              public globalService:GlobalService,
              private messageService: MessageService,
              public notifyService:NotifyService,
              private noteActionService:NoteActionService) {
    let self = this;
    self.eventService.subscribeRegister(self.subscribers,'noteComplete', function (notes) {
      self.recycleList = []
      for(let note of notes){
        if(note.isTrash){
          self.recycleList.push(note)
        }
      }
    });

  }

  clearTheTrash(){
    this.noteActionService.emptyTrash()
  }

  restoreNote(noteid){
    //this.noteActionService.
  }

  // 展示关于Dialog
  display: boolean = false;

  showDialog() {
    this.display = true;
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.eventService.unsubscribeSubscriptions(this.subscribers)
  }


}
