import { Injectable } from '@angular/core';

@Injectable()
export class BaseUrlService {

  constructor() { }

  getPort():number {
    let port = Number(location.port)
    if (!port) {
      port = 80
      if (location.protocol === 'https:') {
        port = 443
      }
    }
    return port
  }

  getWebsocketUrl():string {
    let wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    //return wsProtocol + '//' + location.hostname + ':' + this.getPort() + this.skipTrailingSlash(location.pathname) + '/ws'
    return wsProtocol + '//' + location.hostname + ':8080'+ this.skipTrailingSlash(location.pathname) + '/ws'
    //return wsProtocol + '//localhost:8080/ws'
  }

  getBase():string {
    //return location.protocol + '//localhost:8080'
    //return location.protocol + '//' + location.hostname + ':' + this.getPort() + location.pathname
    return location.protocol + '//' + location.hostname + ':8080' + location.pathname
  }

  getRestApiBase():string {
    return this.skipTrailingSlash(this.getBase()) + '/api'
  }

  skipTrailingSlash(path):string {
    return path.replace(/\/$/, '')
  }

}
