import {Component} from '@angular/core';
import {AppComponent} from "../../app.component";
import {LoginService} from "../../service/login/login.service";
import {GlobalService} from "../../service/global/global.service";

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrls: ['./app.topbar.component.css']
})
export class AppTopbarComponent {

  constructor(public app: AppComponent,
              public loginService: LoginService,
              public globalService:GlobalService) {

  }

  // 展示关于Dialog
  display: boolean = false;

  showDialog() {
    this.display = true;
  }

}
