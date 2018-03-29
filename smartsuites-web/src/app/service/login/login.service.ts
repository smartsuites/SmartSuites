import { Injectable } from '@angular/core';
import {ActivatedRoute, NavigationStart, Params, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {GlobalService} from "../global/global.service";
import {BaseUrlService} from "../base-url/base-url.service";
import {Ticket} from "../../model/Ticket";
import {EventService} from "../event/event.service";
import {isVisionMode} from "../../utils/Utils";

@Injectable()
export class LoginService {

  message = ''

  constructor(private router:Router,
              private httpClient:HttpClient,
              private globalService:GlobalService,
              private baseUrlSrv:BaseUrlService,
              private eventService:EventService) {

    let vm = this;
    //如果没有登录则返回到login
    this.router.events.subscribe({
      next: function (x) {
        if(x instanceof  NavigationStart){
          if( x.url.trim()=="/login" || x.url.trim()=="/register"){
            // DO NOTHING
          }else{
            if(!vm.isLogin()){
              if(!isVisionMode(x.url))
                vm.router.navigate(['/login']);
            }
          }
        }
      } ,
      error: err => console.error('something wrong occurred: ' + err),
      complete: () => console.log('done'),
    });
  }

  // 检测是否登录
  isLogin():boolean{
    return this.globalService.login;
  }

  // 获取展示的用户名
  getLoginUsername():String{
    return this.globalService.ticket.screenUsername
  }

  // 获取Ticket
  getTicket():Ticket{
    return this.globalService.ticket
  }

  getRole(){
    if(this.isAnalyst()){
      return '分析人员'
    }else if(this.isBusiness()){
      return '业务人员'
    }else if(this.isManager()){
      return '管理人员'
    }
  }

  isAnalyst():boolean {
    return this.globalService.ticket.roles.includes("ANALYST")
  }

  isBusiness():boolean {
    return this.globalService.ticket.roles.includes("BUSINESS")
  }

  isManager():boolean {
    return this.globalService.ticket.roles.includes("MANAGER")
  }

  // 登录
  login(username, password):void {
    let self = this;
    this.httpClient.post(this.baseUrlSrv.getRestApiBase() + '/login', null,{
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        params:{
          'userName': username,
          'password': password
        }
      })
      .subscribe(
        response => {
          self.message = response['message']
          self.globalService.ticket = response['body']
          self.globalService.ticket.screenUsername = self.globalService.ticket.principal
          self.globalService.login = true;
          console.log(response)
          this.eventService.broadcast("loginSuccess")
          if(this.isAnalyst()){
            this.router.navigate(['/analysisDashboard']);
          }else if(this.isBusiness()){
            this.router.navigate(['/bussDashboard']);
          }else if(this.isManager()){
            this.router.navigate(['/adminDashboard']);
          }
          setTimeout(function(){
            self.message = "";
          },2000)
        },
        errorResponse => {
          self.message = errorResponse.error.message
          self.globalService.login = false;
          console.log(errorResponse)
        }
      );
  }

  // 注册用户
  register():void {
    //this.router.navigate(['/login']);
    /*this.http
      .get(constant.BUSSINESS_SERVER_URL+'/rest/users/register?username='+user.username+'&password='+user.password)
      .subscribe(
        data => {
          if(data['success'] == true){
            this.router.navigate(['/login']);
          }
          this.data = data;

        },
        err => {
          console.log('Something went wrong!');
          this.data['success'] = false;
          this.data['message'] = '服务器错误！';
        }
      );*/
  }

  // 退出登录
  logout():void{
    this.globalService.ticket = new Ticket
    this.globalService.login = false
    this.router.navigate(['/login'])

  }

}
