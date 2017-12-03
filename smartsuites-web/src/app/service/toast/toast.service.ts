import {Injectable, ViewContainerRef} from '@angular/core';
import {ToastsManager} from "ng2-toastr";

//https://www.npmjs.com/package/ng2-toastr

@Injectable()
export class ToastService {

  constructor(public toastr: ToastsManager) { }

  initToast(vcr: ViewContainerRef){
    this.toastr.setRootViewContainerRef(vcr);
  }

}
