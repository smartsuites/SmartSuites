import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";
import {Router} from "@angular/router";
import {EventService1} from "../../service/event/event.service";
import {GlobalService} from "../../service/global/global.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Ticket} from "../../model/Ticket";
import {LoginService} from "../../service/login/login.service";
import {SelectItem} from "primeng/primeng";

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
  height = window.innerHeight - 450;

  // 登录界面表单的类型
  formType:FormType

  // 用户登录的角色
  roles: SelectItem[];
  selectedRole: any;

  constructor(private eventService:EventService1,
              private loginService:LoginService) {
    this.formType = FormType.Login
  }

  ngOnInit() {
    let self = this;

    // 初始化登录欢迎图片
    this.images.push({source: 'assets/login/bg1.jpg', alt: '数据智能分析系统', title: 'DataSmart'});
    this.images.push({source: 'assets/login/bg3.jpg', alt: '数据智能分析系统', title: 'DataSmart'});

    this.roles = [];
    this.roles.push({label: '选择角色', value: null});
    this.roles.push({label: '分析人员', value: {id: 0, name: '分析人员', code: 'analyst'}});
    this.roles.push({label: '业务人员', value: {id: 1, name: '业务人员', code: 'business'}});
    this.roles.push({label: '管理人员', value: {id: 2, name: '管理人员', code: 'manager'}});


    // 监听用户登出消息
    this.eventService.subscribe('session_logout', function (event, data) {
      self.loginService.logout()
    })

    /*
     ** $scope.$on functions below  TODO 暂时不知道干么
     */
    this.eventService.subscribe('initLoginValues', function () {
      this.initValues()
    })
  }

  showRegisterForm(){
    this.formType = FormType.Register
  }

  showForgetForm(){
    this.formType = FormType.Forget
  }

  showLoginForm(){
    this.formType = FormType.Login
  }

  _submitLoginForm() {
    this.loginService.setRole(this.selectedRole.code)
    this.loginService.login()
  }

  _submitRegisterForm() {
  }

  _submitForgetForm() {
  }

}
