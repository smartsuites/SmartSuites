import { Injectable } from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {GlobalService} from "../global/global.service";
import {BaseUrlService} from "../base-url/base-url.service";
import {Ticket} from "../../model/Ticket";

@Injectable()
export class LoginService {

  constructor(private router:Router,private httpClient:HttpClient,private globalService:GlobalService, private baseUrlSrv:BaseUrlService) {
    let vm = this;
    //如果没有登录则返回到login
    this.router.events.subscribe({
      next: function (x) {
        if(x instanceof  NavigationStart){
          if( x.url.trim()=="/login" || x.url.trim()=="/register"){

          }else{
            if(!vm.isLogin()){
              this.router.navigate(['/login']);
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

  // 登录
  login():void {
    this.globalService.login = true
    /*let config = {}
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/security/ticket', config)
      .subscribe(
        response => {
          this.globalService.ticket = response['body']
          this.globalService.ticket.screenUsername = this.globalService.ticket.principal

          if (this.globalService.ticket.principal.indexOf('#Pac4j') === 0) {
            let re = ', name=(.*?),'
            this.globalService.ticket.screenUsername = this.globalService.ticket.principal.match(re)[1]
          }
        },
        errorResponse => {
          let redirect = errorResponse.headers('Location')
          if (errorResponse.status === 401 && redirect !== undefined) {
            // Handle page redirect
            window.location.href = redirect
          }
        }
      );*/

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
    this.router.navigate(['/'])
  }

}
