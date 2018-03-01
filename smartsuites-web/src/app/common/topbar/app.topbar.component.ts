import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {LoginService} from "../../service/login/login.service";
import {GlobalService} from "../../service/global/global.service";
import {EventService1} from "../../service/event/event.service";
import {Constants} from "../../model/Constants";
import {MessageService} from "primeng/components/common/messageservice";
import {Message} from "primeng/primeng";
import {NotifyService} from "../../service/notify/notify.service";

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrls: ['./app.topbar.component.css']
})
export class AppTopbarComponent implements OnInit{

  recycleList = []

  msgs: Message[] = [];

  //显示个人配置对话框
  showPersonalSetting = false;

  constructor(public app: AppComponent,
              public loginService: LoginService,
              public eventService:EventService1,
              public globalService:GlobalService,
              private messageService: MessageService,
              public notifyService:NotifyService) {
    let self = this;
    this.eventService.subscribe('noteComplete', function (notes) {
      for(let note of notes[0]){
        if(note.name.indexOf(Constants.TRASH_FOLDER_ID) > -1){
          self.recycleList.push(note)
        }
      }
    });

  }

  // 展示关于Dialog
  display: boolean = false;

  showDialog() {
    this.display = true;
  }

  ngOnInit(): void {

  }


}
