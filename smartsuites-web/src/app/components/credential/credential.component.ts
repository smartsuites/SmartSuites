import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";
//import {NzNotificationService} from "ng-zorro-antd";

@Component({
  selector: 'app-credential',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.css']
})
export class CredentialComponent implements OnInit {

  // 认证信息
  credentialInfo = []

  // 是否展示添加认证信息窗口
  showAddNewCredentialInfo = false

  // 可用的解析器
  availableInterpreters = []

  edit = false

  // 添加认证的信息
  entity = ''
  password = ''
  username = ''

  constructor(public httpClient:HttpClient,
              public baseUrlSrv:BaseUrlService,
              /*public alertService: NzNotificationService*/) {
    // TODO
    //ngToast.dismiss()
    //this.toastService.toastr.success('You are awesome!', 'Success!');
  }

  ngOnInit() {
    this.getAvailableInterpreters()
    this.getCredentialInfo()
  }

  hasCredential(){
    return Array.isArray(this.credentialInfo) && this.credentialInfo.length > 0
  }

  getAvailableInterpreters = function () {

    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/interpreter/setting')
      .subscribe(
        response => {

          for (let setting = 0; setting < response['body'].length; setting++) {
            this.availableInterpreters.push(
              response['body'][setting].group + '.' + response['body'][setting].name)
          }

          console.log('Success %o', this.availableInterpreters)
          // TODO
          /*angular.element('#entityname').autocomplete({
            source: this.availableInterpreters,
            select: function (event, selected) {
              this.entity = selected.item.value
              return false
            }
          })*/
        },
        errorResponse => {
          //this.showToast(data.message, 'danger')
          console.log('Error %o', errorResponse)
        }
      );
  }

  getCredentialInfo = function () {
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/credential')
      .subscribe(
        response => {
          this.credentialInfo.length = 0 // keep the ref while cleaning
          const returnedCredentials = response['body']['userCredentials']

          for (let key in returnedCredentials) {
            const value = returnedCredentials[key]
            this.credentialInfo.push({
              entity: key,
              password: value.password,
              username: value.username,
            })
          }

          console.log('Success %o', this.credentialInfo)
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
          /*if (status === 401) {
            ngToast.danger({
              content: 'You don\'t have permission on this page',
              verticalPosition: 'bottom',
              timeout: '3000'
            })
            setTimeout(function () {
              window.location = this.baseUrlSrv.getBase()
            }, 3000)
          }
          console.log('Error %o %o', status, data.message)*/

        }
      );
  }

  isValidCredential = function() {
    return this.entity.trim() !== '' && this.username.trim() !== ''
  }

  addNewCredentialInfo = function () {
    if (!this.isValidCredential()) {
      this.showToast('Username \\ Entity can not be empty.', 'danger')
      return
    }

    let newCredential = {
      'entity': this.entity,
      'username': this.username,
      'password': this.password
    }

    this.httpClient.put(this.baseUrlSrv.getRestApiBase() + '/credential',newCredential)
      .subscribe(
        response => {
          const returnedCredentials = response['body']['userCredentials']

          //this.showToast('Successfully saved credentials.', 'success')
          this.credentialInfo.push(newCredential)
          this.resetCredentialInfo()
          this.showAddNewCredentialInfo = false
          console.log('Success %o', response['message'])
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  toggleAddNewCredentialInfo = function () {
    if (this.showAddNewCredentialInfo) {
      this.showAddNewCredentialInfo = false
    } else {
      this.showAddNewCredentialInfo = true
    }
  }

  cancelCredentialInfo = function () {
    this.showAddNewCredentialInfo = false
    this.resetCredentialInfo()
  }

  resetCredentialInfo = function () {
    this.entity = ''
    this.username = ''
    this.password = ''
  }

  copyOriginCredentialsInfo = function () {
    this.showToast('Since entity is a unique key, you can edit only username & password', 'info')
  }

  updateCredentialInfo = function (form, data, entity) {
    if (!this.isValidCredential()) {
      this.showToast('Username \\ Entity can not be empty.', 'danger')
      return
    }

    let credential = {
      entity: entity,
      username: data.username,
      password: data.password
    }

    this.httpClient.put(this.baseUrlSrv.getRestApiBase() + '/credential/', credential)
      .success(function (data, status, headers, config) {
        const index = this.credentialInfo.findIndex(elem => elem.entity === entity)
        this.credentialInfo[index] = credential
        return true
      })
      .error(function (data, status, headers, config) {
        this.showToast('We could not save the credential', 'danger')
        console.log('Error %o %o', status, data.message)
        form.$show()
      })
    return false
  }

  removeCredentialInfo = function (entity) {
    // TODO
    /*BootstrapDialog.confirm({
      closable: false,
      closeByBackdrop: false,
      closeByKeyboard: false,
      title: '',
      message: 'Do you want to delete this credential information?',
      callback: function (result) {
        if (result) {
          this.httpClient.delete(this.baseUrlSrv.getRestApiBase() + '/credential/' + entity)
            .success(function (data, status, headers, config) {
              const index = this.credentialInfo.findIndex(elem => elem.entity === entity)
              this.credentialInfo.splice(index, 1)
              console.log('Success %o %o', status, data.message)
            })
            .error(function (data, status, headers, config) {
              this.showToast(data.message, 'danger')
              console.log('Error %o %o', status, data.message)
            })
        }
      }
    })*/
  }

  showToast(message, type) {
    const verticalPosition = 'bottom'
    const timeout = '3000'

    // TODO
    /*if (type === 'success') {
      ngToast.success({ content: message, verticalPosition: verticalPosition, timeout: timeout, })
    } else if (type === 'info') {
      ngToast.info({ content: message, verticalPosition: verticalPosition, timeout: timeout, })
    } else {
      ngToast.danger({ content: message, verticalPosition: verticalPosition, timeout: timeout, })
    }*/
  }

}
