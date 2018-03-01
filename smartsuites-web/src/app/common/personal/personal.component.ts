import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../service/login/login.service";

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  constructor(public loginService: LoginService) { }

  ngOnInit() {
  }

}
