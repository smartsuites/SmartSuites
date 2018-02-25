import {Injectable} from '@angular/core';
import {GlobalService} from "../global/global.service";
import {BaseUrlService} from "../base-url/base-url.service";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "primeng/components/common/messageservice";
import {WebsocketMessageService} from "../websocket/websocket-message.service";

@Injectable()
export class JobmanagerService {

  constructor(private globalService:GlobalService,
              private websocketMsgSrv:WebsocketMessageService,
              private baseUrlService:BaseUrlService,
              private httpClient:HttpClient) { }

  sendStopJobRequest(noteId) {
    const apiURL = this.baseUrlService.getRestApiBase() + `/notebook/job/${noteId}`
    return this.httpClient.delete(apiURL)
  }

  sendRunJobRequest(noteId) {
    const apiURL = this.baseUrlService.getRestApiBase() + `/notebook/job/${noteId}`
    return this.httpClient.post(apiURL,null)
  }

  getJobs() {
    this.websocketMsgSrv.getJobs()
  }

  disconnect() {
    this.websocketMsgSrv.disconnectJobEvent()
  }

  subscribeSetJobs(controllerScope, receiveCallback) {
    /*const event = 'jobmanager:set-jobs'
    console.log(`(Event) Subscribed: ${event}`)
    const unsubscribeHandler = this.$rootScope.$on(event, receiveCallback)

    controllerScope.$on('$destroy', () => {
      console.log(`(Event) Unsubscribed: ${event}`)
      unsubscribeHandler()
    })*/
  }

  subscribeUpdateJobs(controllerScope, receiveCallback) {
    /*const event = 'jobmanager:update-jobs'
    console.log(`(Event) Subscribed: ${event}`)
    const unsubscribeHandler = this.$rootScope.$on(event, receiveCallback)

    controllerScope.$on('$destroy', () => {
      console.log(`(Event) Unsubscribed: ${event}`)
      unsubscribeHandler()
    })*/
  }
}
