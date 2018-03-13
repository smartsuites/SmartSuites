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
    // 4200 is for angularjs develop
    let port = this.getPort() == 4200? 8080 : this.getPort()
    let wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    return wsProtocol + '//' + location.hostname + ':'+ port + this.skipTrailingSlash(location.pathname) + '/ws'
  }

  getBase():string {
    // 4200 is for angularjs develop
    let port = this.getPort() == 4200? 8080 : this.getPort()
    return location.protocol + '//' + location.hostname + ':'+ port + location.pathname
  }

  getRestApiBase():string {
    return this.skipTrailingSlash(this.getBase()) + '/api'
  }

  skipTrailingSlash(path):string {
    return path.replace(/\/$/, '')
  }

}
