import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";
import {Router} from "@angular/router";
import {GlobalService} from "../../service/global/global.service";
import {EventService1} from "../../service/event/event.service";
import {MessageService} from "primeng/components/common/messageservice";
import {ConfirmationService} from "primeng/primeng";

@Component({
  selector: 'app-interpreter',
  templateUrl: './interpreter.component.html',
  styleUrls: ['./interpreter.component.css']
})
export class InterpreterComponent implements OnInit {

  newInterpreterSetting

  interpreterSettings = []

  showInterpreterAuth

  interpreterSettingsTmp = []

  availableInterpreters = {}

  showAddNewSetting = false
  showRepositoryInfo = false
  showAddNewRepository = false
  showEditSetting = false
  searchInterpreter = ''

  interpreterPropertyTypes = []

  newRepoSetting

  repositories

  constructor(public httpClient:HttpClient,
              public baseUrlSrv:BaseUrlService,
              public router:Router,
              public globalService:GlobalService,
              public eventService:EventService1,
              public messageService:MessageService,
              public confirmationService:ConfirmationService) { }

  ngOnInit() {

    this.eventService.subscribe('ngRenderFinished', function (event, data) {
      for (let setting = 0; setting < this.interpreterSettings.length; setting++) {
        //angular.element('#' + this.interpreterSettings[setting].name + 'Owners').select2(getSelectJson())
      }
    })

    this.getAvailableInterpreterPropertyWidgets()

    this.resetNewInterpreterSetting()
    this.resetNewRepositorySetting()

    this.getInterpreterSettings()
    this.getAvailableInterpreters()
    this.getRepositories()
  }


  getPerNoteOption(settingId) {
    let option
    if (settingId === undefined) {
      option = this.newInterpreterSetting.option
    } else {
      // TODO
      this.interpreterSettings.forEach((val, idx, array) => {
        // val: 当前值
        // idx：当前index
        // array: Array
        if(val.id == settingId){
          let setting = this.interpreterSettings[idx]
          option = setting.option
        }
      });
    }

    if (option.perNote === 'scoped') {
      return 'scoped'
    } else if (option.perNote === 'isolated') {
      return 'isolated'
    } else {
      return 'shared'
    }
  }

  getPerUserOption(settingId) {
    let option
    if (settingId === undefined) {
      option = this.newInterpreterSetting.option
    } else {
      this.interpreterSettings.forEach((val, idx, array) => {
        // val: 当前值
        // idx：当前index
        // array: Array
        if(val.id == settingId){
          let setting = this.interpreterSettings[idx]
          option = setting.option
        }
      });
    }

    if (option.perUser === 'scoped') {
      return 'scoped'
    } else if (option.perUser === 'isolated') {
      return 'isolated'
    } else {
      return 'shared'
    }
  }

  getInterpreterRunningOption(settingId) {
    let sharedModeName = 'shared'

    let globallyModeName = 'Globally'
    let perNoteModeName = 'Per Note'
    let perUserModeName = 'Per User'

    let option
    if (settingId === undefined) {
      option = this.newInterpreterSetting.option
    } else {
      this.interpreterSettings.forEach((val, idx, array) => {
        // val: 当前值
        // idx：当前index
        // array: Array
        if(val.id == settingId){
          let setting = this.interpreterSettings[idx]
          option = setting.option
        }
      });
    }

    let perNote = option.perNote
    let perUser = option.perUser

    // Globally == shared_perNote + shared_perUser
    if (perNote === sharedModeName && perUser === sharedModeName) {
      return globallyModeName
    }

    if (this.globalService.ticket.ticket === 'anonymous' && this.globalService.ticket.roles === '[]') {
      if (perNote !== undefined && typeof perNote === 'string' && perNote !== '') {
        return perNoteModeName
      }
    } else if (this.globalService.ticket.ticket !== 'anonymous') {
      if (perNote !== undefined && typeof perNote === 'string' && perNote !== '') {
        if (perUser !== undefined && typeof perUser === 'string' && perUser !== '') {
          return perUserModeName
        }
        return perNoteModeName
      }
    }

    option.perNote = sharedModeName
    option.perUser = sharedModeName
    return globallyModeName
  }

  setInterpreterRunningOption(settingId, isPerNoteMode, isPerUserMode) {
    let option
    if (settingId === undefined) {
      option = this.newInterpreterSetting.option
    } else {
      this.interpreterSettings.forEach((val, idx, array) => {
        if(val.id == settingId){
          let setting = this.interpreterSettings[idx]
          option = setting.option
        }
      });
    }
    option.perNote = isPerNoteMode
    option.perUser = isPerUserMode
  }

  updateInterpreterSetting(form, settingId) {

    /*const thisConfirm = BootstrapDialog.confirm({*/
    /*const thisConfirm = BootstrapDialog.confirm({
      closable: false,
      closeByBackdrop: false,
      closeByKeyboard: false,
      title: '',
      message: 'Do you want to update this interpreter and restart with new settings?',
      callback: function (result) {
        if (result) {
          /!*let index = _.findIndex(this.interpreterSettings, {'id': settingId})*!/
          let index = result.findIndex(this.interpreterSettings, {'id': settingId})
          let setting = this.interpreterSettings[index]
          if (setting.propertyKey !== '' || setting.propertyKey) {
            this.addNewInterpreterProperty(settingId)
          }
          if (setting.depArtifact !== '' || setting.depArtifact) {
            this.addNewInterpreterDependency(settingId)
          }
          // add missing field of option
          if (!setting.option) {
            setting.option = {}
          }
          if (setting.option.isExistingProcess === undefined) {
            setting.option.isExistingProcess = false
          }
          if (setting.option.setPermission === undefined) {
            setting.option.setPermission = false
          }
          if (setting.option.isUserImpersonate === undefined) {
            setting.option.isUserImpersonate = false
          }
          if (!(this.getInterpreterRunningOption(settingId) === 'Per User' &&
              this.getPerUserOption(settingId) === 'isolated')) {
            setting.option.isUserImpersonate = false
          }
          if (setting.option.remote === undefined) {
            // remote always true for now
            setting.option.remote = true
          }
          //setting.option.owners = angular.element('#' + setting.name + 'Owners').val()

          let request = {
            /!*option: angular.copy(setting.option),
            properties: angular.copy(setting.properties),
            dependencies: angular.copy(setting.dependencies)*!/
          }

          thisConfirm.$modalFooter.find('button').addClass('disabled')
          thisConfirm.$modalFooter.find('button:contains("OK")')
            .html('<i class="fa fa-circle-o-notch fa-spin"></i> Saving Setting')

          this.httpClient.put(this.baseUrlSrv.getRestApiBase() + '/interpreter/setting/' + settingId, request)
            .then(function (res) {
              this.interpreterSettings[index] = res.data.body
              this.removeTMPSettings(index)
              this.checkDownloadingDependencies()
              thisConfirm.close()
            })
            .catch(function (res) {
              const message = res.data ? res.data.message : 'Could not connect to server.'
              console.log('Error %o %o', res.status, message)
              //ngToast.danger({content: message, verticalPosition: 'bottom'})
              form.$show()
              thisConfirm.close()
            })
          return false
        } else {
          form.$show()
        }
      }
    })*/
  }

  resetInterpreterSetting(settingId) {
    this.interpreterSettings.forEach((val, idx, array) => {
      if(val.id == settingId){
        this.interpreterSettings[idx] = Object.assign({},this.interpreterSettingsTmp[idx])
        this.removeTMPSettings(idx)
      }
    });
  }

  removeInterpreterSetting(settingId) {
    let self = this;
    self.confirmationService.confirm({
      message: 'Do you want to delete this interpreter setting?',
      header: '删除解析器配置',
      icon: 'fa fa-delete',
      accept: () => {

        self.httpClient.delete(this.baseUrlSrv.getRestApiBase() + '/interpreter/setting/' + settingId)
          .subscribe(
            response => {
              self.interpreterSettings.forEach((val, idx, array) => {
                if(val.id == settingId){
                  self.interpreterSettings.splice(idx, 1)
                }
              });
            },
            errorResponse => {
              console.log('Error %o', errorResponse)
            }
          );
      },
      reject: () => {
      }
    });
  }

  newInterpreterGroupChange() {
    /*let el = _.pluck(_.filter(this.availableInterpreters, {'name': this.newInterpreterSetting.group}), 'properties')
    let properties = {}
    for (let i = 0; i < el.length; i++) {
      let intpInfo = el[i]
      for (let key in intpInfo) {
        properties[key] = {
          value: intpInfo[key].defaultValue,
          description: intpInfo[key].description,
          type: intpInfo[key].type
        }
      }
    }
    this.newInterpreterSetting.properties = properties*/
  }

  restartInterpreterSetting(settingId) {
    let self = this;
    self.confirmationService.confirm({
      message: 'Do you want to restart this interpreter?',
      header: '重启解析器',
      icon: 'fa fa-refresh',
      accept: () => {

        self.httpClient.delete(this.baseUrlSrv.getRestApiBase() + '/interpreter/setting/restart/' + settingId)
          .subscribe(
            response => {
              self.interpreterSettings.forEach((val, idx, array) => {
                if(val.id == settingId){
                  self.interpreterSettings.splice(idx, 1)

                  self.interpreterSettings.splice(idx, 1)
                  self.interpreterSettings[idx] = response['body']
                  self.messageService.add({severity:'info', summary:'', detail:'Interpreter stopped. Will be lazily started on next run.'});
                }
              });
            },
            errorResponse => {
              console.log('Error %o', errorResponse)
            }
          );
      },
      reject: () => {
      }
    });
  }

  addNewInterpreterSetting() {
    let self = this;
    // user input validation on interpreter creation
    if (!this.newInterpreterSetting.name ||
      !this.newInterpreterSetting.name.trim() || !this.newInterpreterSetting.group) {
      self.messageService.add({severity:'warn', summary:'Add interpreter', detail:'Please fill in interpreter name and choose a group'});
      return
    }

    if (this.newInterpreterSetting.name.indexOf('.') >= 0) {
      self.messageService.add({severity:'warn', summary:'Add interpreter', detail:'\'.\' is invalid for interpreter name'});
      return
    }

    /*if (_.findIndex($scope.interpreterSettings, {'name': this.newInterpreterSetting.name}) >= 0) {
      self.messageService.add({severity:'warn', summary:'Add interpreter', detail:'Name ' + this.newInterpreterSetting.name + ' already exists'});

      return
    }*/

    let newSetting = this.newInterpreterSetting
    if (newSetting.propertyKey !== '' || newSetting.propertyKey) {
      //this.addNewInterpreterProperty()
    }
    if (newSetting.depArtifact !== '' || newSetting.depArtifact) {
      //this.addNewInterpreterDependency()
    }
    if (newSetting.option.setPermission === undefined) {
      newSetting.option.setPermission = false
    }
    /*newSetting.option.owners = angular.element('#newInterpreterOwners').val()

    let request = angular.copy(this.newInterpreterSetting)*/

    // Change properties to proper request format
    let newProperties = {}

    for (let p in newSetting.properties) {
      newProperties[p] = {
        value: newSetting.properties[p].value,
        type: newSetting.properties[p].type,
        name: p
      }
    }

    //request.properties = newProperties

    /*this.httpClient.post(this.baseUrlSrv.getRestApiBase() + '/interpreter/setting', request)
      .then(function (res) {
        this.resetNewInterpreterSetting()
        this.getInterpreterSettings()
        this.showAddNewSetting = false
        this.checkDownloadingDependencies()
      }).catch(function (res) {
      const errorMsg = res.data ? res.data.message : 'Could not connect to server.'
      console.log('Error %o %o', res.status, errorMsg)
      ngToast.danger({content: errorMsg, verticalPosition: 'bottom'})
    })*/
  }

  cancelInterpreterSetting() {
    this.showAddNewSetting = false
    this.resetNewInterpreterSetting()
  }

  resetNewInterpreterSetting() {
    this.newInterpreterSetting = {
      name: undefined,
      group: undefined,
      properties: {},
      dependencies: [],
      option: {
        remote: true,
        isExistingProcess: false,
        setPermission: false,
        session: false,
        process: false

      }
    }
    this.emptyNewProperty(this.newInterpreterSetting)
  }

  removeInterpreterProperty(key, settingId) {
    if (settingId === undefined) {
      delete this.newInterpreterSetting.properties[key]
    } else {
      /*let index = _.findIndex(this.interpreterSettings, {'id': settingId})
      delete this.interpreterSettings[index].properties[key]*/
    }
  }

  removeInterpreterDependency(artifact, settingId) {
    /*if (settingId === undefined) {
      this.newInterpreterSetting.dependencies = _.reject(this.newInterpreterSetting.dependencies,
        function (el) {
          return el.groupArtifactVersion === artifact
        })
    } else {
      let index = _.findIndex(this.interpreterSettings, {'id': settingId})
      this.interpreterSettings[index].dependencies = _.reject(this.interpreterSettings[index].dependencies,
        function (el) {
          return el.groupArtifactVersion === artifact
        })
    }*/
  }

  addNewInterpreterProperty(settingId) {
    if (settingId === undefined) {
      // Add new property from create form
      if (!this.newInterpreterSetting.propertyKey || this.newInterpreterSetting.propertyKey === '') {
        return
      }
      this.newInterpreterSetting.properties[this.newInterpreterSetting.propertyKey] = {
        value: this.newInterpreterSetting.propertyValue,
        type: this.newInterpreterSetting.propertyType
      }
      this.emptyNewProperty(this.newInterpreterSetting)
    } else {
      // Add new property from edit form
      //let index = _.findIndex(this.interpreterSettings, {'id': settingId})
      let index = settingId.findIndex(this.interpreterSettings, {'id': settingId})
      let setting = this.interpreterSettings[index]

      if (!setting.propertyKey || setting.propertyKey === '') {
        return
      }

      setting.properties[setting.propertyKey] =
        {value: setting.propertyValue, type: setting.propertyType}

      this.emptyNewProperty(setting)
    }
  }

  addNewInterpreterDependency(settingId) {
    if (settingId === undefined) {
      // Add new dependency from create form
      if (!this.newInterpreterSetting.depArtifact || this.newInterpreterSetting.depArtifact === '') {
        return
      }

      // overwrite if artifact already exists
      let newSetting = this.newInterpreterSetting
      for (let d in newSetting.dependencies) {
        if (newSetting.dependencies[d].groupArtifactVersion === newSetting.depArtifact) {
          newSetting.dependencies[d] = {
            'groupArtifactVersion': newSetting.depArtifact,
            'exclusions': newSetting.depExclude
          }
          newSetting.dependencies.splice(d, 1)
        }
      }

      newSetting.dependencies.push({
        'groupArtifactVersion': newSetting.depArtifact,
        'exclusions': (newSetting.depExclude === '') ? [] : newSetting.depExclude
      })
      this.emptyNewDependency(newSetting)
    } else {
      // Add new dependency from edit form
      //let index = _.findIndex(this.interpreterSettings, {'id': settingId})
      let index = 1
      let setting = this.interpreterSettings[index]
      if (!setting.depArtifact || setting.depArtifact === '') {
        return
      }

      // overwrite if artifact already exists
      for (let dep in setting.dependencies) {
        if (setting.dependencies[dep].groupArtifactVersion === setting.depArtifact) {
          setting.dependencies[dep] = {
            'groupArtifactVersion': setting.depArtifact,
            'exclusions': setting.depExclude
          }
          setting.dependencies.splice(dep, 1)
        }
      }

      setting.dependencies.push({
        'groupArtifactVersion': setting.depArtifact,
        'exclusions': (setting.depExclude === '') ? [] : setting.depExclude
      })
      this.emptyNewDependency(setting)
    }
  }

  copyOriginInterpreterSettingProperties(settingId) {
    /*let index = _.findIndex(this.interpreterSettings, {'id': settingId})
    this.interpreterSettingsTmp[index] = angular.copy(this.interpreterSettings[index])*/
  }

  setPerNoteOption(settingId, sessionOption) {
    let option
    if (settingId === undefined) {
      option = this.newInterpreterSetting.option
    } else {
      /*let index = _.findIndex(this.interpreterSettings, {'id': settingId})
      let setting = this.interpreterSettings[index]
      option = setting.option*/
    }

    if (sessionOption === 'isolated') {
      option.perNote = sessionOption
      option.session = false
      option.process = true
    } else if (sessionOption === 'scoped') {
      option.perNote = sessionOption
      option.session = true
      option.process = false
    } else {
      option.perNote = 'shared'
      option.session = false
      option.process = false
    }
  }

  defaultValueByType(setting) {
    if (setting.propertyType === 'checkbox') {
      setting.propertyValue = false
      return
    }

    setting.propertyValue = ''
  }

  setPerUserOption(settingId, sessionOption) {
    let option
    if (settingId === undefined) {
      option = this.newInterpreterSetting.option
    } else {
      /*let index = _.findIndex(this.interpreterSettings, {'id': settingId})
      let setting = this.interpreterSettings[index]
      option = setting.option*/
    }

    if (sessionOption === 'isolated') {
      option.perUser = sessionOption
      option.session = false
      option.process = true
    } else if (sessionOption === 'scoped') {
      option.perUser = sessionOption
      option.session = true
      option.process = false
    } else {
      option.perUser = 'shared'
      option.session = false
      option.process = false
    }
  }



  resetNewRepositorySetting() {
    this.newRepoSetting = {
      id: '',
      url: '',
      snapshot: false,
      username: '',
      password: '',
      proxyProtocol: 'HTTP',
      proxyHost: '',
      proxyPort: null,
      proxyLogin: '',
      proxyPassword: ''
    }
  }

  getRepositories() {
    let self = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/interpreter/repository')
      .subscribe(
        response => {
          self.repositories = response['body']
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  addNewRepository() {
    let request = Object.assign({},this.newRepoSetting)
    let self = this;
    self.httpClient.post(this.baseUrlSrv.getRestApiBase() + '/interpreter/repository',request)
      .subscribe(
        response => {
          let result = response['body']
          self.getRepositories()
          self.resetNewRepositorySetting()
          //angular.element('#repoModal').modal('hide')
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  removeRepository(repoId) {
    let self = this;
    if(self.isDefaultRepository(repoId))
      return;
    self.confirmationService.confirm({
      message: 'Do you want to delete this repository?',
      header: '删除仓库',
      icon: 'fa fa-refresh',
      accept: () => {

        self.httpClient.delete(this.baseUrlSrv.getRestApiBase() + '/interpreter/repository/' + repoId)
          .subscribe(
            response => {
              let index = self.repositories.findIndex({'id': repoId})
              self.repositories.splice(index, 1)
            },
            errorResponse => {
              console.log('Error %o', errorResponse)
            }
          );
      },
      reject: () => {
      }
    });

  }

  isDefaultRepository(repoId) {
    if (repoId === 'central' || repoId === 'local') {
      return true
    } else {
      return false
    }
  }

  showErrorMessage(setting) {
    this.messageService.add({severity:'error', summary:'Error downloading dependencies', detail:setting.errorReason});
  }


  showSparkUI(settingId) {
    let self = this;
    self.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/interpreter/metadata/' + settingId)
      .subscribe(
        response => {
          let result = response['body']
          if (result === undefined) {
            self.messageService.add({severity:'warn', summary:'', detail:'No spark application running'});
            return
          }
          if (result.url) {
            window.open(result.url, '_blank')
          } else {
            self.messageService.add({severity:'warn', summary:'', detail:result.message});
          }
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  getInterpreterBindingModeDocsLink = function() {
    const currentVersion = this.globalService.zeppelinVersion
    return `https://zeppelin.apache.org/docs/${currentVersion}/usage/interpreter/interpreter_binding_mode.html`
  }

  getAvailableInterpreters() {
    let self = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/interpreter')
      .subscribe(
        response => {
          self.availableInterpreters = response['body']
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  getAvailableInterpreterPropertyWidgets() {
    let self = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/interpreter/property/types')
      .subscribe(
        response => {
          self.interpreterPropertyTypes = response['body']
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  emptyNewProperty(object) {
    //angular.extend(object, {propertyValue: '', propertyKey: '', propertyType: $scope.interpreterPropertyTypes[0]})
  }

  emptyNewDependency(object) {
    //angular.extend(object, {depArtifact: '', depExclude: ''})
  }

  removeTMPSettings(index) {
    this.interpreterSettingsTmp.splice(index, 1)
  }

  getInterpreterSettings() {
    let self = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/interpreter/setting')
      .subscribe(
        response => {
          self.interpreterSettings = response['body']
          self.checkDownloadingDependencies()
        },
        errorResponse => {
          /*if (res.status === 401) {
            ngToast.danger({
              content: 'You don\'t have permission on this page',
              verticalPosition: 'bottom',
              timeout: '3000'
            })
            setTimeout(function () {
              window.location = baseUrlSrv.getBase()
            }, 3000)
          }*/
          console.log('Error %o', errorResponse)
        }
      );
  }

  checkDownloadingDependencies() {
    let isDownloading = false
    /*for (let index = 0; index < $scope.interpreterSettings.length; index++) {
      let setting = $scope.interpreterSettings[index]
      if (setting.status === 'DOWNLOADING_DEPENDENCIES') {
        isDownloading = true
      }

      if (setting.status === ParagraphStatus.ERROR || setting.errorReason) {
        ngToast.danger({content: 'Error setting properties for interpreter \'' +
        setting.group + '.' + setting.name + '\': ' + setting.errorReason,
          verticalPosition: 'top',
          dismissOnTimeout: false
        })
      }
    }

    if (isDownloading) {
      $timeout(function () {
        if ($route.current.$$route.originalPath === '/interpreter') {
          getInterpreterSettings()
        }
      }, 2000)
    }*/
  }

  openPermissions() {
    this.showInterpreterAuth = true
  }

  closePermissions() {
    this.showInterpreterAuth = false
  }

  getSelectJson() {
    let selectJson = {
      tags: true,
      minimumInputLength: 3,
      multiple: true,
      tokenSeparators: [',', ' '],
      ajax: {
        url: function (params) {
          if (!params.term) {
            return false
          }
          return this.baseUrlSrv.getRestApiBase() + '/security/userlist/' + params.term
        },
        delay: 250,
        processResults: function (data, params) {
          let results = []

          if (data.body.users.length !== 0) {
            let users = []
            for (let len = 0; len < data.body.users.length; len++) {
              users.push({
                'id': data.body.users[len],
                'text': data.body.users[len]
              })
            }
            results.push({
              'text': 'Users :',
              'children': users
            })
          }
          if (data.body.roles.length !== 0) {
            let roles = []
            for (let len = 0; len < data.body.roles.length; len++) {
              roles.push({
                'id': data.body.roles[len],
                'text': data.body.roles[len]
              })
            }
            results.push({
              'text': 'Roles :',
              'children': roles
            })
          }
          return {
            results: results,
            pagination: {
              more: false
            }
          }
        },
        cache: false
      }
    }
    return selectJson
  }

  togglePermissions(intpName) {
    //angular.element('#' + intpName + 'Owners').select2(this.getSelectJson())
    if (this.showInterpreterAuth) {
      this.closePermissions()
    } else {
      this.openPermissions()
    }
  }

}
