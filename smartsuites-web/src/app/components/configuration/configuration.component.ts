import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";
import {MessageService} from "primeng/components/common/messageservice";

class Item{
  key    : number;
  name   : string;
  value  : string;
  desc   : string;

  constructor(key: number, name: string, value: string, desc: string) {
    this.key = key;
    this.name = name;
    this.value = value;
    this.desc = desc;
  }
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  selectedItem: Item;

  configrations : Item[] = []

  constructor(public httpClient:HttpClient,
              public baseUrlSrv:BaseUrlService,
              public messageService:MessageService) { }

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
          var configs:Item[] = []
          for (var i = 0; i < keys.length; i ++) {
            configs.push(new Item(i,keys[i],params[keys[i]],""))
          }
          self.configrations = configs

          //this.alertService.info('Get all configurations!', 'Success!')
        },
        errorResponse => {
          console.log('Error %o', errorResponse.status)
          if (errorResponse.status === 401) {
            //this.alertService.error('You don\'t have permission on this page!', 'Oops!');

            setTimeout(function () {
              window.location.href= this.baseUrlSrv.getBase()
            }, 3000)
          }
          console.log('Error %o %o', errorResponse.status, errorResponse.message)
        }
      );
  }

}
