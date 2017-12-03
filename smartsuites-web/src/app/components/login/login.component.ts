import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";
import {Router} from "@angular/router";
import {EventService} from "../../service/event/event.service";
import {GlobalService} from "../../service/global/global.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginParams

  SigningIn = false

  constructor(public httpClient:HttpClient,
              public baseUrlSrv:BaseUrlService,
              public router:Router,
              public eventService:EventService,
              public globalService:GlobalService) { }

  ngOnInit() {

    // handle session logout message received from WebSocket
    this.eventService.subscribe('session_logout', function (event, data) {
      if (this.globalService.userName !== '') {
        this.globalService.userName = ''
        this.globalService.ticket = undefined

        /*setTimeout(function () {
          $scope.loginParams = {}
          $scope.loginParams.errorText = data.info
          angular.element('.nav-login-btn').click()
        }, 1000)
        let locationPath = $location.path()
        $location.path('/').search('ref', locationPath)*/
      }
    })

    /*
     ** $scope.$on functions below
     */
    this.eventService.subscribe('initLoginValues', function () {
      this.initValues()
    })

  }

  initValues() {
    this.loginParams = {
      userName: '',
      password: ''
    }
  }

  login() {
    this.SigningIn = true
    /*this.httpClient.post(this.baseUrlSrv.getRestApiBase() + '/login',{
      method: 'POST',
      url:
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: $httpParamSerializer({
        'userName': $scope.loginParams.userName,
        'password': $scope.loginParams.password
      })
    }).then(function successCallback (response) {
      $rootScope.ticket = response.data.body
      angular.element('#loginModal').modal('toggle')
      $rootScope.$broadcast('loginSuccess', true)
      $rootScope.userName = $scope.loginParams.userName
      $scope.SigningIn = false

      // redirect to the page from where the user originally was
      if ($location.search() && $location.search()['ref']) {
        $timeout(function () {
          let redirectLocation = $location.search()['ref']
          $location.$$search = {}
          $location.path(redirectLocation)
        }, 100)
      }
    }, function errorCallback (errorResponse) {
      $scope.loginParams.errorText = 'The username and password that you entered don\'t match.'
      $scope.SigningIn = false
    })*/
  }

}
