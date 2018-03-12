import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";
import {MessageService} from "primeng/components/common/messageservice";

@Component({
  selector: 'app-notebook-repository',
  templateUrl: './notebook-repository.component.html',
  styleUrls: ['./notebook-repository.component.css']
})
export class NotebookRepositoryComponent implements OnInit {

  min_height = window.innerHeight - 183 + 'px'

  notebookRepos = []

  edit = false;

  constructor(public httpClient:HttpClient,
              public baseUrlSrv:BaseUrlService,
              public messageService:MessageService
              ) { }

  ngOnInit() {
    this.getNotebookRepositories()
  }

  saveNotebookRepo(repo, data) {
    console.log('data %o', data)
    let self  = this;
    this.httpClient.put(this.baseUrlSrv.getRestApiBase() + '/notebook-repositories',{
      'name': repo.className,
      'settings': data
    }).subscribe(
      response => {

        let index = -1
        self.notebookRepos.forEach((val,idx,arr) =>{
          if(val.className === repo.className) {
            index = idx;
          }
        })

        if (index >= 0) {
          self.notebookRepos[index] = response['body']
          console.log('repos %o, data %o', self.notebookRepos, response['body'])
        }
      },
      errorResponse => {
        self.messageService.add({severity:'error', summary:'', detail:'We couldn\'t save that NotebookRepo\'s settings'});
      }
    );
    return 'manual'
  }

  showDropdownSelected(setting) {
    let index = setting.value.findIndex({'value': setting.selected})
    if (index < 0) {
      return 'No value'
    } else {
      return setting.value[index].name
    }
  }

  getNotebookRepositories () {
    let self  = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/notebook-repositories')
      .subscribe(
        response => {
          self.notebookRepos = response['body']
          console.log('ya notebookRepos %o', this.notebookRepos)
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
          self.messageService.add({severity:'error', summary:'', detail:'You don\'t have permission on this page'});
        }
      );
  }

}
