import { Injectable } from '@angular/core';
import * as html2canvas from 'html2canvas'

@Injectable()
export class CaptureService {

  constructor() { }

  capture(){

    html2canvas(document.body).then(function(canvas) {
      document.body.appendChild(canvas);
    });

  }

}
