import { Injectable } from '@angular/core';

@Injectable()
export class NoteVarShareService {

  store = {}

  clear = function () {
    this.store = {}
  }

  put = function (key, value) {
    this.store[key] = value
  }

  get = function (key) {
    return this.store[key]
  }

  del = function (key) {
    let v = this.store[key]
    delete this.store[key]
    return v
  }

}
