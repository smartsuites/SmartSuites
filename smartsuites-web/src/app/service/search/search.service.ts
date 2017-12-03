import { Injectable } from '@angular/core';
import {BaseUrlService} from "../base-url/base-url.service";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class SearchService {

  searchTerm = ''

  constructor(public httpClient:HttpClient, public baseUrlSrv:BaseUrlService) {

  }

  search(term) {
    this.searchTerm = term.q
    console.log('Searching for: %o', term.q)
    if (!term.q) { // TODO(bzz): empty string check
      return
    }
    // TODO  window.encodeURIComponent(term.q)
    //let encQuery =  window.encodeURIComponent(term.q)
    let encQuery =  term.q

    return this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/notebook/search?q=' + encQuery)
      /*.subscribe(
        data => {
          if(data['success'] == true){
            this.user = data['user'];
            this.router.navigate(['/home']);
          }
          this.data = data;

        },
        err => {
          console.log('Somethi,g went wrong!');
          this.data['success'] = false;
          this.data['message'] = '服务器错误！';
        }
      );*/
  }

}
