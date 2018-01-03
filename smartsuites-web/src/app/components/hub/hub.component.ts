import { Component, OnInit } from '@angular/core';
import {Car} from "../../demo/domain/car";
import {CarService} from "../../demo/service/carservice";

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.css']
})
export class HubComponent implements OnInit {

  carouselCars: Car[];

  cars2: Car[];

  constructor(private carService: CarService) { }

  ngOnInit() {

    this.carService.getCarsMedium().then(cars => this.cars2 = cars);

    this.carouselCars = [
      {vin: 'r3278r2', year: 2010, brand: 'Audi', color: 'Black'},
      {vin: 'jhto2g2', year: 2015, brand: 'BMW', color: 'White'},
      {vin: 'h453w54', year: 2012, brand: 'Honda', color: 'Blue'},
      {vin: 'g43gwwg', year: 1998, brand: 'Renault', color: 'White'},
      {vin: 'gf45wg5', year: 2011, brand: 'VW', color: 'Red'},
      {vin: 'bhv5y5w', year: 2015, brand: 'Jaguar', color: 'Blue'},
      {vin: 'ybw5fsd', year: 2012, brand: 'Ford', color: 'Yellow'},
      {vin: '45665e5', year: 2011, brand: 'Mercedes', color: 'Brown'},
      {vin: 'he6sb5v', year: 2015, brand: 'Ford', color: 'Black'}
    ];
  }

}
