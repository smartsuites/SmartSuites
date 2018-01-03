import {AfterViewInit, Directive, ElementRef, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Directive({
  selector: '[appNgInclude]',
  inputs: ['src']
})
export class NgIncludeDirective implements AfterViewInit{

  ngAfterViewInit(): void {
    console.log(">>>>"+this.src)



    this.httpClient.get(this.src)
      .subscribe(
        response => {
          console.log(response)
          this.element.nativeElement.innerHTML = response
        },
        errorResponse => {
        }
      );



  }

  src:string

  constructor(private element: ElementRef, public httpClient:HttpClient) {
  }
}
