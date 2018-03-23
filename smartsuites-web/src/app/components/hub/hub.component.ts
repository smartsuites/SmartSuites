import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.css']
})
export class HubComponent implements OnInit {

  cars = [];

  constructor() { }

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
