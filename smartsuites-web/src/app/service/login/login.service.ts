import { Injectable } from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {GlobalService} from "../global/global.service";
import {BaseUrlService} from "../base-url/base-url.service";
import {Ticket} from "../../model/Ticket";
import {EventService} from "../event/event.service";
import {AnalysisDashboardComponent} from "../../components/analysis-dashboard/analysis-dashboard.component";
import {AdminDashboardComponent} from "../../components/admin-dashboard/admin-dashboard.component";
import {BussDashboardComponent} from "../../components/buss-dashboard/buss-dashboard.component";

@Injectable()
export class LoginService {

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

  setRole(role:string){
    this.globalService.role = role
  }

  getRole(){
    return this.globalService.role
  }

  isAnalyst():boolean {
    return this.globalService.role == 'analyst'
  }

  isBusiness():boolean {
    return this.globalService.role == 'business'
  }

  isManager():boolean {
    return this.globalService.role == 'manager'
  }

  // 登录
  login():void {
    this.globalService.login = true

    if(this.isAnalyst()){
      this.router.navigate(['/analysisDashboard']);
    }else if(this.isBusiness()){
      this.router.navigate(['/bussDashboard']);
    }else if(this.isManager()){
      this.router.navigate(['/adminDashboard']);
    }

    this.eventService.broadcast("loginSuccess")
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
    this.router.navigate(['/login'])
  }

}
