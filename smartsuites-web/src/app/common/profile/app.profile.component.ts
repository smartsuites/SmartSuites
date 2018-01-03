import {Component, Input, OnInit, EventEmitter, ViewChild, trigger, state, transition, style, animate} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import {LoginService} from "../../service/login/login.service";

@Component({
  selector: 'app-inline-profile',
  templateUrl: './app.profile.component.html',
  animations: [
    trigger('menu', [
      state('hidden', style({
        height: '0px'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class AppProfileComponent {

  constructor(public loginSerivce:LoginService) {

  }

  active: boolean;

  onClick(event) {
    this.active = !this.active;
    event.preventDefault();
  }
}

