import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";
import {Router} from "@angular/router";
import {GlobalService} from "../../service/global/global.service";
import {EventService1} from "../../service/event/event.service";
import {MessageService} from "primeng/components/common/messageservice";
import {ConfirmationService} from "primeng/primeng";
import {ParagraphStatus} from "../notebook/paragraph/paragraph.status";
import {SelectItem} from "primeng/api";

@Component({
  selector: 'app-interpreter',
  templateUrl: './interpreter.component.html',
  styleUrls: ['./interpreter.component.css']
})
export class InterpreterComponent implements OnInit {

  //设置的解析器权限
  selectedUsers: string[] = [];

  interpreterSettings = []

  interpreterSettingsTmp = []

  availableInterpreters = {}
  availableInterpretersArray:SelectItem[] = []

  showAddNewPro = false
  showAddNewDep = false

  searchInterpreter = ''

  // 保存所有可用的解析器的属性配置项
  interpreterPropertyTypes = []


  /*//将 InterpreterSettings 数据中的 properties 转换为 propertiesArray  主要为了展示方便
  transformPropertiesToArray(interpreterSettings){
    let interpreterSettingsTmp = []
    for(let interpreterSetting of interpreterSettings){
      let propertiesArray = []
      for(let key in interpreterSetting.properties){
        propertiesArray.push({'key':key,'value':interpreterSetting.properties[key]})
      }
      interpreterSetting.propertiesArray = propertiesArray
      interpreterSettingsTmp.push(interpreterSetting)
    }
    return interpreterSettingsTmp;
  }

  transformPropertiesToArrayForSingle(interpreterSetting){
    let propertiesArray = []
    for(let key in interpreterSetting.properties){
      propertiesArray.push({'key':key,'value':interpreterSetting.properties[key]})
    }
    interpreterSetting.propertiesArray = propertiesArray
    return interpreterSetting;
  }

  //将 InterpreterSettings 数据中的 propertiesArray 转换为 properties，并删除，提交时使用  主要为了展示方便
  transformArrayToProperties(interpreterSettings){
    let interpreterSettingsTmp = []
    for(let interpreterSetting of interpreterSettings){
      let properties = {}
      for(let pro of interpreterSetting.propertiesArray){
        properties[pro.key] = pro.value
      }
      interpreterSetting.properties = properties;
      delete interpreterSetting.propertiesArray;
      interpreterSettingsTmp.push(interpreterSetting)
    }
    return interpreterSettingsTmp;
  }

  transformArrayToPropertiesForSingle(interpreterSetting){
    let properties = {}
    for(let pro of interpreterSetting.propertiesArray){
      properties[pro.key] = pro.value
    }
    interpreterSetting.properties = properties;
    delete interpreterSetting.propertiesArray;
    return interpreterSetting;
  }*/


  constructor(public httpClient:HttpClient,
              public baseUrlSrv:BaseUrlService,
              public router:Router,
              public globalService:GlobalService,
              public eventService:EventService1,
              public messageService:MessageService,
              public confirmationService:ConfirmationService) {
  }

  ngOnInit() {
    let self = this;

    this.getAvailableInterpreterPropertyWidgets()

    this.resetNewInterpreterSetting()
    this.resetNewRepositorySetting()

    this.getInterpreterSettings()
    this.getAvailableInterpreters()
    this.getRepositories()
  }

  // OK 获取解析器的属性类型
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

  // 重设新的解析器设置
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

  // 将对象的属性设置为空
  emptyNewProperty(object) {
    object.propertyValue = '';
    object.propertyKey = '';
    object.propertyType = this.interpreterPropertyTypes[0]
  }

  // 重设新的仓库设置
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

  // 获取所有的解析器配置
  getInterpreterSettings() {
    let self = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/interpreter/setting')
      .subscribe(
        response => {
          self.interpreterSettings = response['body']
          self.checkDownloadingDependencies()
        },
        errorResponse => {
          self.messageService.add({severity:'error', summary:'', detail:'You don\'t have permission on this page'});
          console.log('Error %o', errorResponse)
        }
      );
  }

  // 检测依赖的下载情况，如果失败则爆出
  checkDownloadingDependencies() {
    let isDownloading = false
    let self = this;
    this.interpreterSettings.forEach((val, idx, array) => {
      let setting = val;
      if (setting.status === 'DOWNLOADING_DEPENDENCIES') {
        isDownloading = true
      }

      if (setting.status === ParagraphStatus.ERROR || setting.errorReason) {
        self.messageService.add({severity:'error', summary:'Add interpreter', detail:'Error setting properties for interpreter \'' +
          setting.group + '.' + setting.name + '\': ' + setting.errorReason});
      }
    });

    if (isDownloading) {
      /*$timeout(function () {
        if ($route.current.$$route.originalPath === '/interpreter') {
          getInterpreterSettings()
        }
      }, 2000)*/
    }
  }

  // 获取所有可用的解析器
  getAvailableInterpreters() {
    let self = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/interpreter')
      .subscribe(
        response => {
          self.availableInterpreters = response['body']
          for(let key in self.availableInterpreters){
            self.availableInterpretersArray.push({
              label: self.availableInterpreters[key].name, value: self.availableInterpreters[key].name
            })
          }
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  // 获取所有的额仓库
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

  //*************** 仓库设置  ****************//

  showAddNewRepository = false
  newRepoSetting
  repositories

  // 添加新库
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

  // 删除仓库
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
              let index
              this.repositories.forEach((val, idx, array) => {
                let setting = val;
                if (val.id == repoId) {
                  index = idx
                }
              });
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

  // 是否缺省仓库
  isDefaultRepository(repoId) {
    if (repoId === 'central' || repoId === 'local') {
      return true
    } else {
      return false
    }
  }

  //*************** 添加新解析器 **************//

  newInterpreterSetting
  showAddNewSetting = false

  // 新建解析器配置
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

    let index
    this.interpreterSettings.forEach((val, idx, array) => {
      if(val.name == this.newInterpreterSetting.name){
        self.messageService.add({severity:'warn', summary:'Add interpreter', detail:'Name ' + this.newInterpreterSetting.name + ' already exists'});
        return
      }
    });

    let newSetting = this.newInterpreterSetting
    /*if (newSetting.propertyKey !== '' || newSetting.propertyKey) {
      self.addNewInterpreterProperty()
    }
    if (newSetting.depArtifact !== '' || newSetting.depArtifact) {
      self.addNewInterpreterDependency()
    }*/
    if (newSetting.option.setPermission === undefined) {
      newSetting.option.setPermission = false
    }

    newSetting.option.owners = self.selectedUsers.length>0? self.selectedUsers.reduce((previousValue, currentValue, currentIndex, array) => previousValue + ','+currentValue):'';
    /*newSetting.option.owners = angular.element('#newInterpreterOwners').val()*/

    let request = Object.assign(this.newInterpreterSetting)

    // Change properties to proper request format
    let newProperties = {}

    /*for (let p in newSetting.properties) {
      newProperties[p] = {
        value: newSetting.properties[p].value,
        type: newSetting.properties[p].type,
        name: p
      }
    }*/
    // TODO 版本差异
    for (let p in newSetting.properties) {
      //newProperties[p] = newSetting.properties[p].value
      newProperties[p] = {
        value: newSetting.properties[p].value,
        type: newSetting.properties[p].type,
        name: p
      }
    }

    request.properties = newProperties

    delete request.depArtifact;
    delete request.depExclude;

    self.httpClient.post(this.baseUrlSrv.getRestApiBase() + '/interpreter/setting', request)
      .subscribe(
        response => {
          self.resetNewInterpreterSetting()
          self.getInterpreterSettings()
          self.showAddNewSetting = false
          self.checkDownloadingDependencies()
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
          self.messageService.add({severity:'error', summary:'', detail:errorResponse});
        }
      );
  }

  newInterpreterPropertyKey
  newInterpreterPropertyValue
  // 添加新的解析器属性
  addNewInterpreterProperty(settingId?) {
    if (settingId === -2) {
      // Add new property from create form
      /*if (!this.newInterpreterSetting.propertyKey || this.newInterpreterSetting.propertyKey === '') {
        return
      }*/
      /*this.newInterpreterSetting.properties[this.newInterpreterSetting.propertyKey] = {
        value: this.newInterpreterSetting.propertyValue,
        type: this.newInterpreterSetting.propertyType
      }*/
      this.newInterpreterSetting.properties[this.newInterpreterPropertyKey] = {
        value: this.newInterpreterPropertyValue,
        type: this.newInterpreterSetting.propertyType
      }
      this.emptyNewProperty(this.newInterpreterSetting)
    } else {
      // Add new property from edit form
      let index
      this.interpreterSettings.forEach((val, idx, array) => {
        if(val.id == settingId){
          index = idx
        }
      });

      let setting = this.interpreterSettings[index]

      /*if (!setting.propertyKey || setting.propertyKey === '') {
        return
      }
      setting.properties[setting.propertyKey] =
        {value: setting.propertyValue, type: setting.propertyType}*/

      setting.properties[this.newInterpreterPropertyKey] = this.newInterpreterPropertyValue

      this.emptyNewProperty(setting)
    }
  }

  // 返回默认信息
  defaultValueByType(setting) {
    if (setting.propertyType === 'checkbox') {
      setting.propertyValue = false
      return
    }

    setting.propertyValue = ''
  }

  newGroupArtifactVersion
  newExclusions
  // 添加新的解析器依赖
  addNewInterpreterDependency(settingId?) {
    if (settingId === -2) {
      // Add new dependency from create form
      /*if (!this.newInterpreterSetting.depArtifact || this.newInterpreterSetting.depArtifact === '') {
        return
      }*/

      // overwrite if artifact already exists
      let newSetting = this.newInterpreterSetting
      for (let d in newSetting.dependencies) {
        if (newSetting.dependencies[d].groupArtifactVersion === this.newGroupArtifactVersion) {
          newSetting.dependencies[d] = {
            'groupArtifactVersion': this.newGroupArtifactVersion,
            'exclusions': this.newExclusions
          }
          newSetting.dependencies.splice(d, 1)
        }
      }

      newSetting.dependencies.push({
        'groupArtifactVersion': this.newGroupArtifactVersion,
        'exclusions': (this.newExclusions === '') ? [] : this.newExclusions
      })
      this.emptyNewDependency(newSetting)
    } else {
      // Add new dependency from edit form
      let index
      this.interpreterSettings.forEach((val, idx, array) => {
        if(val.id == settingId){
          index = idx
        }
      });
      let setting = this.interpreterSettings[index]
      /*if (!setting.depArtifact || setting.depArtifact === '') {
        return
      }*/

      // overwrite if artifact already exists
      for (let dep in setting.dependencies) {
        if (setting.dependencies[dep].groupArtifactVersion === this.newGroupArtifactVersion) {
          setting.dependencies[dep] = {
            'groupArtifactVersion': this.newGroupArtifactVersion,
            'exclusions': this.newExclusions
          }
          setting.dependencies.splice(dep, 1)
        }
      }

      setting.dependencies.push({
        'groupArtifactVersion': this.newGroupArtifactVersion,
        'exclusions': (this.newExclusions === '') ? [] : this.newExclusions
      })
      this.emptyNewDependency(setting)
    }
  }

  // 清空新建依赖
  emptyNewDependency(object) {
    object.depArtifact = '';
    object.depExclude = '';
  }

  // 取消新建解析器
  cancelInterpreterSetting() {
    this.showAddNewSetting = false
    this.resetNewInterpreterSetting()
  }

  // 解析器变更
  newInterpreterGroupChange() {
    console.log(this.newInterpreterSetting.group)

    for(let key in this.availableInterpreters){
      if(this.availableInterpreters[key].name === this.newInterpreterSetting.group){
        let properties = {}
        for(let pkey in this.availableInterpreters[key].properties){
          properties[pkey] = {
            value: this.availableInterpreters[key].properties[pkey].defaultValue,
            description: this.availableInterpreters[key].properties[pkey].description,
            type: this.availableInterpreters[key].properties[pkey].type
          }
        }
        this.newInterpreterSetting.properties = properties
        console.log(this.newInterpreterSetting.properties)
        return
      }
    }

    //this.availableInterpreters.filter
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





  //*************** 解析器模式设置 **************//

  // 修改解析器实例模式
  onInstanceModeChange(instanceMode,setting?){
    if(instanceMode === 'Globally')
      this.setInterpreterRunningOption(setting, 'shared', 'shared')
    else if(instanceMode === 'Per Note')
      this.setInterpreterRunningOption(setting, 'scoped', '')
    else if(instanceMode === 'Per User')
      this.setInterpreterRunningOption(setting, 'shared', 'scoped')
  }

  // 修改解析器模式
  onOptionModeChange(optionMode,setting?){
    if(optionMode === 'shared per note')
      this.setPerNoteOption( 'shared',setting)
    else if(optionMode === 'scoped per note')
      this.setPerNoteOption( 'scoped',setting)
    else if(optionMode === 'isolated per note')
      this.setPerNoteOption( 'isolated',setting)
    else if(optionMode === 'scoped per user')
      this.setPerUserOption(setting, 'scoped')
    else if(optionMode === 'isolated per user')
      this.setPerUserOption(setting, 'isolated')
  }

  // 获取Option模式
  getOption(setting?){
    if(this.getInterpreterRunningOption(setting) != 'Per User')
      return this.getPerNoteOption(setting)
    else
      return this.getPerUserOption(setting)
  }

  // 获取笔记的模式
  getPerNoteOption(setting?) {
    let option
    if (setting === undefined) {
      option = this.newInterpreterSetting.option
    } else {
      option = setting.option
    }

    if (option.perNote === 'scoped') {
      return 'scoped'
    } else if (option.perNote === 'isolated') {
      return 'isolated'
    } else {
      return 'shared'
    }
  }

  // 获取每一个用户的模式
  getPerUserOption(setting) {
    let option
    if (setting === undefined) {
      option = this.newInterpreterSetting.option
    } else {
      option = setting.option
    }
    if (option.perUser === 'scoped') {
      return 'scoped'
    } else if (option.perUser === 'isolated') {
      return 'isolated'
    } else {
      return 'shared'
    }
  }

  // 获取解析器的运行模式
  getInterpreterRunningOption(setting) {
    let sharedModeName = 'shared'

    let globallyModeName = 'Globally'
    let perNoteModeName = 'Per Note'
    let perUserModeName = 'Per User'

    let option
    if (setting === undefined) {
      option = this.newInterpreterSetting.option
    } else {
      option = setting.option
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

  // 设置解析器运行模式
  setInterpreterRunningOption(setting, isPerNoteMode, isPerUserMode) {
    let option
    if (setting === undefined) {
      option = this.newInterpreterSetting.option
    } else {
      option = setting.option
    }
    option.perNote = isPerNoteMode
    option.perUser = isPerUserMode
  }

  // 设置Option
  setPerNoteOption(sessionOption,setting?) {
    let option
    if (setting === undefined) {
      option = this.newInterpreterSetting.option
    } else {
      option = setting.option
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

  // 设置Option
  setPerUserOption(setting, sessionOption) {
    let option
    if (setting === undefined) {
      option = this.newInterpreterSetting.option
    } else {
      option = setting.option
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







  //************ 解析器修改 ******************//

  currentEditSetting

  // 检测是否修改当前解析器
  isCurrentEdit(settingid):boolean {
    return this.currentEditSetting == settingid;
  }

  // 更新解析器配置
  updateInterpreterSetting(settingId) {
    let self = this;
    self.confirmationService.confirm({
      message: 'Do you want to update this interpreter and restart with new settings?',
      header: '更新解析器配置',
      icon: 'fa fa-delete',
      accept: () => {
        let setting,index

        self.interpreterSettings.forEach((val, idx, array) => {
          if(val.id == settingId){
            setting = val
            index = idx
          }
        });

        if (setting.propertyKey !== '' || setting.propertyKey) {
          self.addNewInterpreterProperty(settingId)
        }
        if (setting.depArtifact !== '' || setting.depArtifact) {
          self.addNewInterpreterDependency(settingId)
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
        if (!(self.getInterpreterRunningOption(settingId) === 'Per User' &&
            self.getPerUserOption(settingId) === 'isolated')) {
          setting.option.isUserImpersonate = false
        }
        if (setting.option.remote === undefined) {
          // remote always true for now
          setting.option.remote = true
        }
        // 保存权限
        setting.option.owners = self.selectedUsers.length>0? self.selectedUsers.reduce((previousValue, currentValue, currentIndex, array) => previousValue + ','+currentValue):'';

        //转换setting
        //let newSetting = this.transformArrayToPropertiesForSingle(setting)

        let request = {
          option: Object.assign(setting.option),
          properties: Object.assign(setting.properties),
          dependencies: Object.assign(setting.dependencies)
        }

        self.httpClient.put(self.baseUrlSrv.getRestApiBase() + '/interpreter/setting/' + settingId, request)
          .subscribe(
            response => {

              self.interpreterSettings[index] = response['body']

              self.removeTMPSettings(index)
              self.checkDownloadingDependencies()

              self.interpreterSettings.forEach((val, idx, array) => {
                if(val.id == settingId){
                  self.interpreterSettings.splice(idx, 1)
                }
              });

            },
            errorResponse => {
              self.messageService.add({severity:'error', summary:'Error', detail:errorResponse});
              console.log('Error %o', errorResponse)
            }
          );
      },
      reject: () => {
      }
    });
  }

  // 取消解析器更新
  resetInterpreterSetting(settingId) {
    this.interpreterSettings.forEach((val, idx, array) => {
      if(val.id == settingId){
        this.interpreterSettings[idx] = Object.assign(this.interpreterSettingsTmp[idx])
        this.removeTMPSettings(idx)
      }
    });
  }

  // 删除Tmp配置
  removeTMPSettings(index) {
    this.interpreterSettingsTmp.splice(index, 1)
  }

  // 删除解析器属性
  removeInterpreterProperty(key, settingId) {
    if (settingId === undefined) {
      delete this.newInterpreterSetting.properties[key]
    } else {
      let index
      this.interpreterSettings.forEach((val, idx, array) => {
        if(val.id == settingId){
          index = idx
        }
      });
      delete this.interpreterSettings[index].properties[key]
    }
  }

  // 删除解析器依赖
  removeInterpreterDependency(artifact, settingId) {
    if (settingId === undefined) {
      /*this.newInterpreterSetting.dependencies = _.reject(this.newInterpreterSetting.dependencies,
        function (el) {
          return el.groupArtifactVersion === artifact
        })*/
      this.newInterpreterSetting.dependencies =this.newInterpreterSetting.dependencies.filter((value,index,array)=> value.groupArtifactVersion != artifact)
    } else {
      let index
      this.interpreterSettings.forEach((val, idx, array) => {
        if(val.id == settingId){
          index = idx
        }
      });
      /*this.interpreterSettings[index].dependencies = _.reject(this.interpreterSettings[index].dependencies,
        function (el) {
          return el.groupArtifactVersion === artifact
        })*/
      this.interpreterSettings[index].dependencies =this.interpreterSettings[index].dependencies.filter((value,index,array)=> value.groupArtifactVersion != artifact)
    }
  }

  // 修改时将属性先copy到TMP中
  copyOriginInterpreterSettingProperties(settingId) {
    let index
    this.interpreterSettings.forEach((val, idx, array) => {
      if(val.id == settingId){
        index = idx
      }
    });
    this.interpreterSettingsTmp[index] = Object.assign({},this.interpreterSettings[index])
  }






  //************ 解析器控制 ******************//

  // 删除解析器配置
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

              self.interpreterSettings = self.interpreterSettings.filter((value,index,array) => value.id != settingId)

              /*self.interpreterSettings.forEach((val, idx, array) => {
                if(val.id == settingId){
                  self.interpreterSettings.splice(idx, 1)
                }
              });*/
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

  // 重启解析器
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

  // 展示Spark UI
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






  //************ 工具 ******************//

  // 展示错误信息
  showErrorMessage(setting) {
    this.messageService.add({severity:'error', summary:'Error downloading dependencies', detail:setting.errorReason});
  }

  // 获取解析器模式文档
  getInterpreterBindingModeDocsLink = function() {
    const currentVersion = this.globalService.zeppelinVersion
    return `https://zeppelin.apache.org/docs/${currentVersion}/usage/interpreter/interpreter_binding_mode.html`
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

  getKeys(object){
    return Object.keys(object)
  }
}
