import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";
import {Router} from "@angular/router";
import {EventService} from "../../service/event/event.service";
import {GlobalService} from "../../service/global/global.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Ticket} from "../../model/Ticket";
import {LoginService} from "../../service/login/login.service";

export enum FormType {
  Login = 0,
  Register = 1,
  Forget = 2
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // 表单的类型
  formType:FormType

  validateLoginForm: FormGroup;
  validateRegisterForm: FormGroup;
  validateForgetForm: FormGroup;

  roles = [{
    label:"管理人员",
    value:"manager"
  },{
    label:"分析人员",
    value:"analyst;"
  },{
    label:"业务人员",
    value:"business"
  }];

  constructor(private httpClient:HttpClient,
              private baseUrlSrv:BaseUrlService,
              private router:Router,
              private eventService:EventService,
              private globalService:GlobalService,
              private formBuilder: FormBuilder,
              private loginService:LoginService) {
    this.formType = FormType.Login
  }

  ngOnInit() {
    this.validateLoginForm = this.formBuilder.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      remember: [ true ],
    });

    this.validateRegisterForm = this.formBuilder.group({
      email            : [ null, [ Validators.email ] ],
      password         : [ null, [ Validators.required ] ],
      checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
      nickname         : [ null, [ Validators.required ] ],
      phoneNumberPrefix: [ '+86' ],
      phoneNumber      : [ null, [ Validators.required ] ],
      website          : [ null, [ Validators.required ] ],
      captcha          : [ null, [ Validators.required ] ],
      agree            : [ false ]
    });


    // handle session logout message received from WebSocket
    this.eventService.subscribe('session_logout', function (event, data) {
      if (this.globalService.ticket.ticket !== '' && this.globalService.ticket.ticket !== "anonymous") {
        this.globalService.ticket = new Ticket
        this.router.navigate(['/'])

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

  showRegisterForm(){
    this.formType = FormType.Register
  }

  showForgetForm(){
    this.formType = FormType.Forget
  }

  showLoginForm(){
    this.formType = FormType.Login
  }

  _submitLoginForm() {
    for (const i in this.validateLoginForm.controls) {
      this.validateLoginForm.controls[ i ].markAsDirty();
    }
    this.loginService.login()
  }

  _submitRegisterForm() {
    for (const i in this.validateRegisterForm.controls) {
      this.validateRegisterForm.controls[ i ].markAsDirty();
    }
  }

  _submitForgetForm() {
    for (const i in this.validateForgetForm.controls) {
      this.validateForgetForm.controls[ i ].markAsDirty();
    }
  }

  login() {
    this.globalService.login = true
    //this.SigningIn = true
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

  register(){}

  forget(){}

  updateRegisterConfirmValidator() {
    /** wait for refresh value */
    setTimeout(_ => {
      this.validateRegisterForm.controls[ 'checkPassword' ].updateValueAndValidity();
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateRegisterForm.controls[ 'password' ].value) {
      return { confirm: true, error: true };
    }
  };

  getFormControl(name) {
    return this.validateRegisterForm.controls[ name ];
  }

  getCaptcha(e: MouseEvent) {
    e.preventDefault();
  }

}
