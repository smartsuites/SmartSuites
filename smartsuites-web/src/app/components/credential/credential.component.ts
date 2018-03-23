import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../../service/base-url/base-url.service";
import {SelectItem, TreeNode} from "primeng/primeng";

@Component({
  selector: 'app-credential',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.css']
})
export class CredentialComponent implements OnInit {

  min_height = window.innerHeight - 183 + 'px'

  showAddNewUser = false;
  showEditUser = false;
  showAddDirectory = false;
  showEditDirectory = false;

  //**************** Directory *****************//

  loading = true;

  directory
  visionTree: TreeNode[] = [];

  selectedTreeNode

  createNewDir(parentNode,newDirName){
    let self = this;
    this.httpClient.post(this.baseUrlSrv.getRestApiBase() + '/directory/'+parentNode.data+'/'+newDirName,null)
      .subscribe(
        response => {
          console.log('Success %o', response)
          self.createTree(self.visionTree,response['body'])
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  updateDirName(parentNode,newDirName){
    let self = this;
    this.httpClient.put(this.baseUrlSrv.getRestApiBase() + '/directory/'+parentNode.data+'/'+newDirName,null)
      .subscribe(
        response => {
          console.log('Success %o', response)
          self.findNode(self.visionTree[0],response['body'],function(parent,index,item){
            item.label = response['body'].directory_name
          })
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  deleteDir(node){
    let self = this;
    this.httpClient.delete(this.baseUrlSrv.getRestApiBase() + '/directory/'+node.data)
      .subscribe(
        response => {
          console.log('Success %o', response)
          self.findNode(self.visionTree[0],response['body'],function(parent,index,item){
            parent.children.splice(index,1)
          })
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  createTree(children, item):boolean{

    if(children.length == 0 && item.parent_directory == -1){
      children.push({
        label: item.directory_name,
        data: item.id,
        expandedIcon: "fa-folder-open",
        collapsedIcon: "fa-folder",
        expanded:true,
        children:[]
      })
      return true;
    }

    for(let child of children){
      if(child.data == item.parent_directory){
        child.children.push({
          label: item.directory_name,
          data: item.id,
          expandedIcon: "fa-folder-open",
          collapsedIcon: "fa-folder",
          expanded:true,
          children:[]
        })
        return true;
      }else{
        this.createTree(child.children, item)
      }
    }
    return false;
  }

  findNode(node, item,callback):boolean{
    if(node.data == item.id){
      callback(null, node)
    }

    node.children.forEach((child, index, array) =>{
      if(child.data == item.id){
        callback(node, index, child)
        return true;
      }else{
        this.findNode(child,item,callback)
      }
    })

    for(let child of node.children){

    }
    return false;
  }

  // 获取所有的目录
  getAllDirectories(){
    let self = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/directory')
      .subscribe(
        response => {
          console.log('Success %o', response)
          self.directory = response['body']

          self.directory.forEach((item, index, array) => {
            self.createTree(self.visionTree, item);
          })
          self.loading = false;
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  //******************  User *******************//

  // 用户的类型
  users = [{
    "data":{
      "username":"管理人员",
      "data":"MANAGER",
      "type":"Folder",
      "icon":"fa fa-user"
    },
    "children":[]
  },{
    "data":{
      "username":"分析人员",
      "size":"ANALYST",
      "type":"Folder"
    },
    "children":[]
  },{
    "data":{
      "username":"业务人员",
      "size":"BUSINESS",
      "type":"Folder"
    },
    "children":[]
  }]

  types : SelectItem[] = [{label: '管理人员', value: 'MANAGER'},
    {label: '分析人员', value: 'ANALYST'},
    {label: '业务人员', value: 'BUSINESS'}];

  selectUser;
  userLoading = true;

  userType;

  getAllUsers(){
    let self = this;
    this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/users')
      .subscribe(
        response => {
          console.log('Success %o', response)
          response['body'].elements.forEach((item, index, array) => {
            item.type = "Document";
            if(item.roles.startsWith("MANAGER")){
              self.users[0].children.push({
                data:item
              })
            }else if(item.roles.startsWith("ANALYST")){
              self.users[1].children.push({
                data:item
              })
            }else if(item.roles.startsWith("BUSINESS")){
              self.users[2].children.push({
                data:item
              })
            }
          })
          //self.users = response['body'].elements
          self.userLoading = false
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  createNewUser(username,password,email,role){
    let self = this;
    let payload = {
      password:password,
      email:email,
      role: role
    }
    this.httpClient.post(this.baseUrlSrv.getRestApiBase() + '/users/'+ username,payload)
      .subscribe(
        response => {
          console.log('Success %o', response)
          if(role.startsWith("MANAGER")){
            self.users[0].children.push({
              data:response['body'].members
            })
          }else if(role.startsWith("ANALYST")){
            self.users[1].children.push({
              data:response['body'].members
            })
          }else if(role.startsWith("BUSINESS")){
            self.users[2].children.push({
              data:response['body'].members
            })
          }
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  removeUser(user){
    if(user.data.type == "Folder")
      return;
    let self = this;
    this.httpClient.delete(this.baseUrlSrv.getRestApiBase() + '/users/' + user.data.username)
      .subscribe(
        response => {
          console.log('Success %o', response)
          if(user.data.roles.startsWith("MANAGER")){
            let idx
            self.users[0].children.forEach((item, index, array) => {
              if(item.username === user.data.username)
                idx = index;
            })
            self.users[0].children.splice(idx,1)
          }else if(user.data.roles.startsWith("ANALYST")){
            let idx
            self.users[1].children.forEach((item, index, array) => {
              if(item.username === user.data.username)
                idx = index;
            })
            self.users[1].children.splice(idx,1)
          }else if(user.data.roles.startsWith("BUSINESS")){
            let idx
            self.users[2].children.forEach((item, index, array) => {
              if(item.username === user.data.username)
                idx = index;
            })
            self.users[2].children.splice(idx,1)
          }
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }

  updateUser(username,password,email,role){
    let self = this;
    let payload = {
      password:password,
      email:email
    }
    this.httpClient.put(this.baseUrlSrv.getRestApiBase() + '/users/'+ username,payload)
      .subscribe(
        response => {
          console.log('Success %o', response)
          if(role.startsWith("MANAGER")){
            self.users[0].children.push({
              data:response['body'].members
            })
          }else if(role.startsWith("ANALYST")){
            self.users[1].children.push({
              data:response['body'].members
            })
          }else if(role.startsWith("BUSINESS")){
            self.users[2].children.push({
              data:response['body'].members
            })
          }
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }


  //************** 目录配比  ****************//

  showEditDir = false;
  selectedUserTreeNodes;

  saveUserDirs(){
    if(this.selectUser.data.type == "Folder")
      return;
    let list = []
    this.selectedUserTreeNodes.forEach((item,index,array) => {
      list.push(item.data)
    })
    this.httpClient.post(this.baseUrlSrv.getRestApiBase() + '/users/'+ this.selectUser.data.username + '/dir',list)
      .subscribe(
        response => {
          console.log('Success %o', response)
        },
        errorResponse => {
          console.log('Error %o', errorResponse)
        }
      );
  }




  constructor(public httpClient:HttpClient,
              public baseUrlSrv:BaseUrlService) {
  }

  ngOnInit() {
    this.getAllDirectories()
    this.getAllUsers()
  }

  // 认证信息
  /*credentialInfo = []

  // 是否展示添加认证信息窗口
  showAddNewCredentialInfo = false

  // 可用的解析器
  availableInterpreters = []

  edit = false

  // 添加认证的信息
  entity = ''
  password = ''
  username = ''

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
          /!*angular.element('#entityname').autocomplete({
            source: this.availableInterpreters,
            select: function (event, selected) {
              this.entity = selected.item.value
              return false
            }
          })*!/
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
          /!*if (status === 401) {
            ngToast.danger({
              content: 'You don\'t have permission on this page',
              verticalPosition: 'bottom',
              timeout: '3000'
            })
            setTimeout(function () {
              window.location = this.baseUrlSrv.getBase()
            }, 3000)
          }
          console.log('Error %o %o', status, data.message)*!/

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
    /!*BootstrapDialog.confirm({
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
    })*!/
  }

  showToast(message, type) {
    const verticalPosition = 'bottom'
    const timeout = '3000'

    // TODO
    /!*if (type === 'success') {
      ngToast.success({ content: message, verticalPosition: verticalPosition, timeout: timeout, })
    } else if (type === 'info') {
      ngToast.info({ content: message, verticalPosition: verticalPosition, timeout: timeout, })
    } else {
      ngToast.danger({ content: message, verticalPosition: verticalPosition, timeout: timeout, })
    }*!/
  }*/

}
