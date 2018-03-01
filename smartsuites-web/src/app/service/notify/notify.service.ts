import { Injectable } from '@angular/core';

const EventLevel = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
}

@Injectable()
export class NotifyService {

  top10Event = []

  events = []

  constructor() {
    this.events = [{
      'id':1,
      'resolve':false,
      'level':'INFO',
      'timestamp':'2017年12月12日 12:12:12',
      'title':'用户XX执行了数据任务',
      'msg':'用户XX提交了XX的数据任务'
    },{
      'id':2,
      'resolve':false,
      'level':'WARNING',
      'timestamp':'2017年12月12日 12:12:12',
      'title':'用户XX执行了数据任务',
      'msg':'用户XX提交了XX的数据任务'
    },{
      'id':3,
      'resolve':false,
      'level':'ERROR',
      'timestamp':'2017年12月12日 12:12:12',
      'title':'用户XX执行了数据任务',
      'msg':'用户XX提交了XX的数据任务'
    }]

    this.top10Event = this.events.slice(0,10)

  }

  getEventIconByStatus(eventLevel) {
    if (eventLevel === EventLevel.INFO) {
      return 'fa fa-info-circle'
    } else if (eventLevel === EventLevel.WARNING) {
      return 'fa fa-warning'
    } else if (eventLevel === EventLevel.ERROR) {
      return 'fa fa-times-circle'
    }
  }

  getEventColorByStatus(resolve,eventLevel) {
    if(resolve)
      return 'gray'
    if (eventLevel === EventLevel.INFO) {
      return 'green'
    } else if (eventLevel === EventLevel.WARNING) {
      return 'orange'
    } else if (eventLevel === EventLevel.ERROR) {
      return 'red'
    }
  }



}
