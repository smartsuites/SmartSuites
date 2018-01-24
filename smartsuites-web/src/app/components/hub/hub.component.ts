import { Component, OnInit } from '@angular/core';
import {Car} from "../../demo/domain/car";
import {CarService} from "../../demo/service/carservice";

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.css']
})
export class HubComponent implements OnInit {

  cars = [];

  constructor(private carService: CarService) { }

  ngOnInit() {

    this.cars = [
      {title: 'Spark', img: 'avatar.png'},
      {title: 'Hadoop', img: 'avatar1.png'},
      {title: 'Flink', img: 'avatar2.png'},
      {title: 'Kylin', img: 'avatar3.png'},
      {title: 'Oracle', img: 'avatar4.png'},
    ];
  }

}
