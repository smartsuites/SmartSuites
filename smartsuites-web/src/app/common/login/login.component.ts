import {Component, OnInit} from '@angular/core';
import {EventService} from "../../service/event/event.service";
import {LoginService} from "../../service/login/login.service";

export enum FormType {
  Login = 0,
  Register = 1,
  Forget = 2
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // 登录界面欢迎图片
  images = [];

  // 登录界面欢迎图片的高度
  height = window.innerHeight

  // 登录界面表单的类型
  formType: FormType

  // 选择的角色
  //selectedRole = "analyst";

  constructor(private eventService: EventService,
              public loginService: LoginService) {
    this.formType = FormType.Login
  }

  ngOnInit() {
    let self = this;

    // 初始化登录欢迎图片
    this.images.push({source: 'assets/login/bg0.jpg', alt: '数据智能分析系统', title: 'DATA SMART'});
    this.images.push({source: 'assets/login/bg1.jpg', alt: '数据智能分析系统', title: 'DATA SMART'});
    this.images.push({source: 'assets/login/bg2.jpg', alt: '数据智能分析系统', title: 'DATA SMART'});

    // 监听用户登出消息
    this.eventService.subscribe('session_logout', function (event, data) {
      self.loginService.logout()
    })
  }

  showRegisterForm() {
    this.formType = FormType.Register
  }

  showForgetForm() {
    this.formType = FormType.Forget
  }

  showLoginForm() {
    this.formType = FormType.Login
  }

  _submitLoginForm(username, password) {
    let self = this;
    if(username == '' || password == ''){
      this.loginService.message= "请输入用户名和密码！";
      setTimeout(function(){
        self.loginService.message= "";
      },2000)
      return;
    }
    this.loginService.login(username, password)
  }

  KeyDown(event,username, password){
    if (event.keyCode == 13)
    {
      event.returnValue=false;
      event.cancel = true;
      this._submitLoginForm(username, password);
    }
  }

  _submitRegisterForm() {
  }

  _submitForgetForm() {
  }

}
