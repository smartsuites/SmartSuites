/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

import {Component, AfterViewInit, ElementRef, Renderer, ViewChild, OnDestroy, OnInit} from '@angular/core';
import {GlobalService} from "./service/global/global.service";
import {LoginService} from "./service/login/login.service";
import {WebsocketMessageService} from "./service/websocket/websocket-message.service";
import {SearchService} from "./service/search/search.service";
import {EventService1} from "./service/event/event.service";
import {BaseUrlService} from "./service/base-url/base-url.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {WebsocketEventService} from "./service/websocket/websocket-event.service";
import {NoteListService} from "./service/note-list/note-list.service";
import {MessageService} from "primeng/components/common/messageservice";
import {Ticket} from "./model/Ticket";
import {CommonService} from "./service/common/common.service";

enum MenuOrientation {
  STATIC,
  OVERLAY,
  SLIM,
  HORIZONTAL
}

declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit, OnDestroy {

  layoutCompact = true;

  layoutMode: MenuOrientation = MenuOrientation.HORIZONTAL;

  darkMenu = false;

  profileMode = 'inline';

  rotateMenuButton: boolean;

  topbarMenuActive: boolean;

  overlayMenuActive: boolean;

  staticMenuDesktopInactive: boolean;

  staticMenuMobileActive: boolean;

  rightPanelActive: boolean;

  rightPanelClick: boolean;

  layoutMenuScroller: HTMLDivElement;

  menuClick: boolean;

  topbarItemClick: boolean;

  activeTopbarItem: any;

  resetMenu: boolean;

  menuHoverActive: boolean;

  @ViewChild('layoutMenuScroller') layoutMenuScrollerViewChild: ElementRef;

  constructor(public renderer: Renderer,
              private globalService:GlobalService,
              private loginService:LoginService,
              private websocketMsgSrv:WebsocketMessageService,
              private searchForm:SearchService,
              private eventService:EventService1,
              private baseUrlService:BaseUrlService,
              private httpClient:HttpClient,
              private router:Router,
              private websocketEventService:WebsocketEventService,
              private messageService: MessageService,
              private noteListFactory:NoteListService,
              private commonService:CommonService
              ) {
    this.ticket = globalService.ticket
    this.notes = this.noteListFactory.notes
  }

  ngAfterViewInit() {

    this.layoutMenuScroller = <HTMLDivElement> this.layoutMenuScrollerViewChild.nativeElement;

    setTimeout(() => {
      //jQuery(this.layoutMenuScroller).nanoScroller({flash: true});
    }, 10);
  }

  onLayoutClick() {
    if (!this.topbarItemClick) {
      this.activeTopbarItem = null;
      this.topbarMenuActive = false;
    }

    if (!this.menuClick) {
      if (this.isHorizontal() || this.isSlim()) {
        this.resetMenu = true;
      }

      if (this.overlayMenuActive || this.staticMenuMobileActive) {
        this.hideOverlayMenu();
      }

      this.menuHoverActive = false;
    }

    if (!this.rightPanelClick) {
      this.rightPanelActive = false;
    }

    this.topbarItemClick = false;
    this.menuClick = false;
    this.rightPanelClick = false;
  }

  onMenuButtonClick(event) {
    this.menuClick = true;
    this.rotateMenuButton = !this.rotateMenuButton;
    this.topbarMenuActive = false;

    if (this.layoutMode === MenuOrientation.OVERLAY) {
      this.overlayMenuActive = !this.overlayMenuActive;
    } else {
      if (this.isDesktop()) {
        this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
      } else {
        this.staticMenuMobileActive = !this.staticMenuMobileActive;
      }
    }

    event.preventDefault();
  }

  onMenuClick($event) {
    this.menuClick = true;
    this.resetMenu = false;

    if (!this.isHorizontal()) {
      setTimeout(() => {
        //jQuery(this.layoutMenuScroller).nanoScroller();
      }, 500);
    }
  }

  onTopbarMenuButtonClick(event) {
    this.topbarItemClick = true;
    this.topbarMenuActive = !this.topbarMenuActive;

    this.hideOverlayMenu();

    event.preventDefault();
  }

  onTopbarItemClick(event, item) {
    this.topbarItemClick = true;

    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = null; } else {
      this.activeTopbarItem = item; }

    event.preventDefault();
  }

  onRightPanelButtonClick(event) {
    this.rightPanelClick = true;
    this.rightPanelActive = !this.rightPanelActive;
    event.preventDefault();
  }

  onRightPanelClick() {
    this.rightPanelClick = true;
  }

  hideOverlayMenu() {
    this.rotateMenuButton = false;
    this.overlayMenuActive = false;
    this.staticMenuMobileActive = false;
  }

  isTablet() {
    const width = window.innerWidth;
    return width <= 1024 && width > 640;
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  isMobile() {
    return window.innerWidth <= 640;
  }

  isOverlay() {
    return this.layoutMode === MenuOrientation.OVERLAY;
  }

  isHorizontal() {
    return this.layoutMode === MenuOrientation.HORIZONTAL;
  }

  isSlim() {
    return this.layoutMode === MenuOrientation.SLIM;
  }

  changeToStaticMenu() {
    this.layoutMode = MenuOrientation.STATIC;
  }

  changeToOverlayMenu() {
    this.layoutMode = MenuOrientation.OVERLAY;
  }

  changeToHorizontalMenu() {
    this.layoutMode = MenuOrientation.HORIZONTAL;
  }

  changeToSlimMenu() {
    this.layoutMode = MenuOrientation.SLIM;
  }

  //************ BUSSINESS **************

  //用户的Token
  ticket:Ticket

  //ws connect
  connected = false

  //对分析人员保存的Note集合
  notes

  looknfeel = 'default'
  asIframe

  isLogin():boolean{
    return this.loginService.isLogin()
  }

  // 获取版本号
  getPlatfromVersion () {
    this.httpClient.get(this.baseUrlService.getRestApiBase() + '/version')
      .subscribe(
        response => {
          this.globalService.dataSmartVersion = response['body']
        },
        errorResponse => {
          console.log('Error %o %o', status, errorResponse.message)
        }
      );
  }

  noteName(note) {
    /*if (!_.isEmpty(note)) {
      return this.arrayOrderingSrv.getNoteName(note)
    }*/
  }

  subscribers = []

  ngOnInit(): void {
    let self = this;

    this.getPlatfromVersion()

    // 监听Websocket的连接状态
    self.eventService.subscribeRegister(self.subscribers,'setConnectedStatus', function (msg) {
      self.connected = msg
    })

    // 用于监听笔记加载消息，异步加载Notes
    self.eventService.subscribeRegister(self.subscribers,'setNoteMenu', function (notes) {
      self.noteListFactory.setNotes(notes)
      self.eventService.broadcast("noteComplete",notes)
    })

    // 监听登录状态
    self.eventService.subscribeRegister(self.subscribers,'loginSuccess', function (msg) {

      /**/

      //TODO 根据Role加载不同的菜单
      //如果是分析人员
      if(self.loginService.isAnalyst()){

        self.listConfigurations()
        self.getHomeNote()
        self.loadNotes()

      }else if(self.loginService.isBusiness()){

        self.eventService.broadcast('businessMenu')

      }else if(self.loginService.isManager()){

        self.eventService.broadcast('managerMenu')

      }

    })

    self.eventService.subscribeRegister(self.subscribers,'setIframe', function (data) {
      if (!event.defaultPrevented) {
        self.asIframe = data
        event.preventDefault()
      }
    })

    self.eventService.subscribeRegister(self.subscribers,'setLookAndFeel', function (data) {
      if (!event.defaultPrevented && data && data !== '' && data !== self.looknfeel) {
        self.looknfeel = data
        event.preventDefault()
      }
    })

    // Set The lookAndFeel to default on every page
    self.eventService.subscribeRegister(self.subscribers,'$routeChangeStart', function (event, next, current) {
      self.eventService.broadcast('setLookAndFeel', 'default')
    })

    //this.loginService.login()
  }


  listConfigurations () {
    this.websocketMsgSrv.listConfigurations()
  }

  loadNotes () {
    this.websocketMsgSrv.getNoteList()
  }

  getHomeNote () {
    this.websocketMsgSrv.getHomeNote()
  }

  ngOnDestroy(): void {
    //jQuery(this.layoutMenuScroller).nanoScroller({flash: true});
    this.eventService.unsubscribeSubscriptions(this.subscribers)
  }


}
