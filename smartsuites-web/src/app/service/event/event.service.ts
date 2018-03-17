import { Injectable } from '@angular/core';
import * as Rx from "rxjs/Rx"
import {Subscription} from "rxjs/src/Subscription";

@Injectable()
export class EventService1 {

  private subjects = []

  private getSubjectByType(eventType){
    for(let topic of this.subjects){
      if(topic.name === eventType){
        return topic.subject
      }
    }
    let subject = new Rx.Subject();
    this.subjects.push({
      name:eventType,
      subject:subject
    })
    return subject;
  }

  subscribe(eventType,callback):Subscription {
    return this.getSubjectByType(eventType).subscribe({
      next: x => {
        if(x != 'empty'){
          console.log('Subscribe >> %o, %o', eventType, x)
          callback(...x)
        }
      },
      error: err => {
        console.log(err)
      },
      complete: () => {
        console.log(eventType + ' Topic Complete')
      }
    })
  }

  subscribeRegister(subscriptions:Subscription[],eventType,callback):Subscription[] {
    subscriptions.push(this.subscribe(eventType,callback))
    return subscriptions
  }

  broadcast(eventType, ...eventMsg){
    console.log('Broadcast >> %o, %o', eventType, eventMsg)
    this.getSubjectByType(eventType).next(eventMsg)
  }

  unsubscribeSubject(eventType){
    this.getSubjectByType(eventType).unsubscribe()
  }

  unsubscribeSubscriptions(subscriptions){
    console.log('Unsubscribe >> %o', subscriptions)
    for(let subscription of subscriptions){
      subscription.unsubscribe()
    }
  }
}
