import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";

@Component({
  selector: 'app-notebook-repository',
  templateUrl: './notebook-repository.component.html',
  styleUrls: ['./notebook-repository.component.css']
})
export class NotebookRepositoryComponent implements OnInit {

  notebookRepos = []

  edit = false;

  constructor(public httpClient:HttpClient,
              public baseUrlSrv:BaseUrlService,
              ) { }

  ngOnInit() {
    this._getInterpreterSettings()
  }

  saveNotebookRepo(className,valueform) {
    console.log('data %o', valueform)
    let self  = this;
    this.httpClient.put(this.baseUrlSrv.getRestApiBase() + '/notebook-repositories',{
      'name': className,
      'settings': valueform
    }).subscribe(
        response => {

          /*let index = self.notebookRepos.findIndex({'className': repo.className})
          if (index >= 0) {
            self.notebookRepos[index] = data.body
            console.log('repos %o, data %o', self.notebookRepos, response['body'])
          }*/
          //valueform.$show()
        },
        errorResponse => {
          /*ngToast.danger({
            content: 'We couldn\'t save that NotebookRepo\'s settings',
            verticalPosition: 'bottom',
            timeout: '3000'
          })
          valueform.$show()*/
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

  _getInterpreterSettings () {
    let self  = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/notebook-repositories')
      .subscribe(
        response => {
          self.notebookRepos = response['body']
          console.log('ya notebookRepos %o', this.notebookRepos)
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

}
