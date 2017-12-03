import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  configrations = {}

  constructor(public httpClient:HttpClient,
              public baseUrlSrv:BaseUrlService) { }

  ngOnInit() {
    this.getConfigurations()
  }

  getConfigurations() {
    let self  = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/configurations/all')
      .subscribe(
        response => {
          self.configrations = response['body']
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
          /*if (status === 401) {
            ngToast.danger({
              content: 'You don\'t have permission on this page',
              verticalPosition: 'bottom',
              timeout: '3000'
            })
            setTimeout(function () {
              window.location = this.baseUrlSrv.getBase()
            }, 3000)
          }
          console.log('Error %o %o', status, data.message)*/

        }
      );
  }

  getKeys(item){
    return Object.keys(item);
  }

}
