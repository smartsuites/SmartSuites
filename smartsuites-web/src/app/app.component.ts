import {AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {GlobalService} from "./service/global/global.service";
import {ArrayOrderingService} from "./service/array-ordering/array-ordering.service";
import {EventService} from "./service/event/event.service";
import {BaseUrlService} from "./service/base-url/base-url.service";
import {LoginService} from "./service/login/login.service";
import {WebsocketEventService} from "./service/websocket/websocket-event.service";
import {ToastsManager} from "ng2-toastr";
import {ToastService} from "./service/toast/toast.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit{

  looknfeel = 'default'

  @ViewChild("vc", {read: ViewContainerRef})
  vc: ViewContainerRef;

  ngAfterViewInit(): void {
    this.toastService.initToast(this.vc)
  }

  constructor(public globalService:GlobalService,
              /*public arrayOrderingSrv:ArrayOrderingService,*/
              public eventService:EventService,
              public baseUrlService:BaseUrlService,
              public loginService:LoginService,
              public websocketEventService:WebsocketEventService,
              public toastService:ToastService) {

  }

  ngOnInit(): void {

    this.loginService.login()

    this.eventService.subscribe('setIframe', function (event, data) {
      if (!event.defaultPrevented) {
        this.asIframe = data
        event.preventDefault()
      }
    })

    this.eventService.subscribe('setLookAndFeel', function (event, data) {
      if (!event.defaultPrevented && data && data !== '' && data !== this.looknfeel) {
        this.looknfeel = data
        event.preventDefault()
      }
    })

    // Set The lookAndFeel to default on every page
    this.eventService.subscribe('$routeChangeStart', function (event, next, current) {
      this.eventService.broadcast('setLookAndFeel', 'default')
    })

    /*BootstrapDialog.defaultOptions.onshown = function () {
      angular.element('#' + this.id).find('.btn:last').focus()
    }

    // Remove BootstrapDialog animation
    BootstrapDialog.configDefaultOptions({animate: false})*/

  }

  noteName(note) {
    /*if (!_.isEmpty(note)) {
      return this.arrayOrderingSrv.getNoteName(note)
    }*/
  }

}
