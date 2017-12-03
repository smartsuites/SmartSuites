import { Injectable } from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {GlobalService} from "../global/global.service";
import {BaseUrlService} from "../base-url/base-url.service";

@Injectable()
export class LoginService {

  constructor(public router:Router,public httpClient:HttpClient,public globalService:GlobalService, public baseUrlSrv:BaseUrlService) {

    let vm = this;

    this.router.events.subscribe({
      next: function (x) {
        if(x instanceof  NavigationStart){
          if( x.url.trim()=="/login" || x.url.trim()=="/register"){

          }else{
            if(!vm.isLogin()){
              //this.router.navigate(['/login']);
            }
          }
        }
      } ,
      error: err => console.error('something wrong occurred: ' + err),
      complete: () => console.log('done'),
    });
  }

  isLogin():boolean{
    if(this.globalService.ticket.principal == "anonymous")
      return false;
    return true;
  }

  login():void {

    let config = {}
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
      );

  }

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


  logout():void{
    if (this.globalService.userName !== '') {
      this.globalService.userName = ''
      this.globalService.ticket = null
      this.router.navigate(['/'])
    }
  }

}
