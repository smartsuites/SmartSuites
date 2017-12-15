import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";
import {NzNotificationService} from "ng-zorro-antd";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  configrations = []

  constructor(public httpClient:HttpClient,
              public baseUrlSrv:BaseUrlService,
              public alertService:NzNotificationService) { }

  ngOnInit() {
    this.getConfigurations()
  }

  getConfigurations() {
    let self  = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/configurations/all')
      .subscribe(
        response => {
          var params = response['body']
          var keys = Object.keys(params)
          for (var i = 0; i < keys.length; i ++) {
            self.configrations.push({
              key    : i,
              name   : keys[i],
              value  : params[keys[i]],
              desc   : ''
            })
          }
          //this.alertService.info('Get all configurations!', 'Success!')
        },
        errorResponse => {
          console.log('Error %o', errorResponse.status)
          if (errorResponse.status === 401) {
            this.alertService.error('You don\'t have permission on this page!', 'Oops!');

            setTimeout(function () {
              window.location.href= this.baseUrlSrv.getBase()
            }, 3000)
          }
          console.log('Error %o %o', errorResponse.status, errorResponse.message)
        }
      );
  }

}
