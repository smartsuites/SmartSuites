import { Component, OnInit } from '@angular/core';
import {Car} from "../../demo/domain/car";
import {CarService} from "../../demo/service/carservice";

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit {

  cars3: Car[];

  constructor(private carService: CarService) { }

  ngOnInit() {
    this.carService.getCarsMedium().then(cars => this.cars3 = cars);
  }

}
