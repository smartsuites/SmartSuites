import { Component, OnInit } from '@angular/core';
import {MenuItem, SelectItem} from "primeng/primeng";
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";
import {GlobalService} from "../../service/global/global.service";

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit {

  directory
  tmpItems = []
  // 可视化树目录
  items: MenuItem[] = [];

  stepsItems: MenuItem[];

  // 当页的可视化数组
  visions = []

  selectedDirId

  constructor(public httpClient:HttpClient,
              public baseUrlSrv:BaseUrlService,
              public globalService:GlobalService) { }

  ngOnInit() {

    this.stepsItems = [
      {
        label: 'Personal'
      },
      {
        label: 'Seat'
      },
      {
        label: 'Payment'
      }
    ];

    this.getVisionTree()
  }

  getVisionTree(){
    let self = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/directory')
      .subscribe(
        response => {
          console.log('Success %o', response)
          self.directory = response['body']

          self.directory.forEach((item, index, array) => {
            self.createTree(self.tmpItems, item);
          })
          self.items = self.tmpItems[0].items
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  deleteVisionNotes(dirid,noteid){
    let self = this;
    self.visions = []
    this.httpClient.delete(self.baseUrlSrv.getRestApiBase() + '/directory/'+dirid+"/" + self.globalService.ticket.principal +"/"+noteid)
      .subscribe(
        response => {
          console.log('Success %o', response)
          //self.fetchVisionNotes(dirid);
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  fetchVisionNotes(dirid){
    let self = this;
    self.visions = []
    this.httpClient.get(self.baseUrlSrv.getRestApiBase() + '/directory/'+dirid+"/"+self.globalService.ticket.principal)
      .subscribe(
        response => {
          console.log('Success %o', response)
          self.visions = response['body']
          self.selectedDirId = dirid;
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  createTree(children, item):boolean{
    let self = this
    if(children.length == 0 && item.parent_directory == -1){
      children.push({
        label: item.directory_name,
        icon: 'fa-pie-chart',
        badge: '5',
        command: (event) => {
          self.fetchVisionNotes(event.item.id)
        },
        id: item.id
      })
      return true;
    }

    for(let child of children){
      if(child.id == item.parent_directory){
        if(!child.items)
          child.items = []
        child.items.push({
          label: item.directory_name,
          icon: 'fa-pie-chart',
          badge: '5',
          command: (event) => {
            self.fetchVisionNotes(event.item.id)
          },
          id: item.id
        })
        return true;
      }else{
        if(child.items)
          this.createTree(child.items, item)
      }
    }
    return false;
  }

}
