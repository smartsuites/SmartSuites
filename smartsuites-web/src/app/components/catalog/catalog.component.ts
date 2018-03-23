import {Component, OnInit} from '@angular/core';
import {MenuItem, SelectItem, TreeNode} from "primeng/primeng";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {


  //********** Create Note ***********//
  createRootDialogDisplay: boolean = false;

  createSubDialogDisplay: boolean = false;

  catalogItems: TreeNode[];

  selectedNode: TreeNode;

  constructor() {
  }

  ngOnInit() {

    this.initCatalogItems();

    /*this.filesTree1 =[{
      label: 'Root',
      data:'id',
      expandedIcon: "fa-home",
      collapsedIcon: "fa-home",
      expanded: true,
      children: [
        {
          label: "Documents",
          data: "Documents Folder",
          "expandedIcon": "fa-folder-open",
          "collapsedIcon": "fa-folder",
          "children": [{
            "label": "Work",
            "data": "Work Folder",
            "expandedIcon": "fa-folder-open",
            "collapsedIcon": "fa-folder",
            "children": [{"label": "Expenses.doc", "icon": "fa-file-word-o", "data": "Expenses Document"}, {"label": "Resume.doc", "icon": "fa-file-word-o", "data": "Resume Document"}]
          },
            {
              "label": "Home",
              "data": "Home Folder",
              "expandedIcon": "fa-folder-open",
              "collapsedIcon": "fa-folder",
              "children": [{"label": "Invoices.txt", "icon": "fa-file-word-o", "data": "Invoices for this month"}]
            }]
        },
        {
          "label": "Pictures",
          "data": "Pictures Folder",
          "expandedIcon": "fa-folder-open",
          "collapsedIcon": "fa-folder",
          "children": [
            {"label": "barcelona.jpg", "icon": "fa-file-image-o", "data": "Barcelona Photo"},
            {"label": "logo.jpg", "icon": "fa-file-image-o", "data": "PrimeFaces Logo"},
            {"label": "primeui.png", "icon": "fa-file-image-o", "data": "PrimeUI Logo"}]
        },
        {
          "label": "Movies",
          "data": "Movies Folder",
          "expandedIcon": "fa-folder-open",
          "collapsedIcon": "fa-folder",
          "children": [{
            "label": "Al Pacino",
            "data": "Pacino Movies",
            "children": [{"label": "Scarface", "icon": "fa-file-video-o", "data": "Scarface Movie"}, {"label": "Serpico", "icon": "fa-file-video-o", "data": "Serpico Movie"}]
          },
            {
              "label": "Robert De Niro",
              "data": "De Niro Movies",
              "children": [{"label": "Goodfellas", "icon": "fa-file-video-o", "data": "Goodfellas Movie"}, {"label": "Untouchables", "icon": "fa-file-video-o", "data": "Untouchables Movie"}]
            }]
        }
      ]
    }]*/

    /*this.catalogItems = [{
      label: 'CEO',
      type: 'dir',
      styleClass: 'dir',
      expanded: true,
      data: {icon: 'fa-home'},

      children: [
        {
          label: 'CFO',
          type: 'dir',
          styleClass: 'dir',
          expanded: true,
          data: {icon: 'fa-folder-open'},
          children: [{
            label: 'Tax',
            styleClass: 'doc'
          },
            {
              label: 'Legal',
              styleClass: 'doc'
            }],
        },
        {
          label: 'COO',
          type: 'dir',
          styleClass: 'dir',
          expanded: true,
          data: {name: 'Mike E.', icon: 'fa-folder-open'},
          children: [{
            label: 'Operations',
            styleClass: 'doc'
          }]
        },
        {
          label: 'CTO',
          type: 'dir',
          styleClass: 'dir',
          expanded: true,
          data: {name: 'Jesse Pinkman', icon: 'fa-folder-open'},
          children: [{
            label: 'Development',
            styleClass: 'doc',
            expanded: true,
            children: [{
              label: 'Analysis',
              styleClass: 'doc'
            },
              {
                label: 'Front End',
                styleClass: 'doc'
              },
              {
                label: 'Back End',
                styleClass: 'doc'
              }]
          },
            {
              label: 'QA',
              styleClass: 'doc'
            },
            {
              label: 'R&D',
              styleClass: 'doc'
            }]
        }
      ]
    }];*/

  }

  // 从服务器端加载目录
  private initCatalogItems() {

    this.catalogItems = [{
      label: 'Root',
      data: this.getNewGUIDString(),
      icon: "fa-home",
      expanded: true,
      children:[]
    }]

  }

  onNodeSelect(event) {
    event.node.label
  }


  // 创建主目录
  public createRootCatalog(catalog: string) {

    this.catalogItems[0].children.push({
      label: catalog,
      data:this.getNewGUIDString(),
      expandedIcon: "fa-folder-open",
      collapsedIcon: "fa-folder",
      expanded: true,
      children: []
    })

  }

  // 创建子目录
  public createSubCatalog(catalog: string) {

    console.log(this.catalogItems)
    console.log(this.selectedNode)

    let parentid = this.selectedNode.data

    let parentDir = this.findDir(this.catalogItems[0], parentid)

    if (parentDir == null) {
      console.log("can not find dir with id :" + parentid)
      return
    }

    parentDir.children.push({
      label: catalog,
      data:this.getNewGUIDString(),
      expandedIcon: "fa-folder-open",
      collapsedIcon: "fa-folder",
      expanded: true,
      children: []
    })

  }

  private getNewGUIDString() {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  private findDir(parentDir:TreeNode, parentid: string) {

    if(null == parentDir.children)
      return

    for (let item of parentDir.children) {

      if (item.data == parentid)
        return item;

      this.findDir(item, parentid)

    }

    return null;
  }

  private findParentDir(parentDir:TreeNode, childid: string) {

    for (let item of parentDir.children) {

      if (item.data == childid)
        return parentDir;

      this.findParentDir(item, childid)

    }

    return null;
  }

  // 删除子目录
  public removeCatalog() {

    let dirid = this.selectedNode.data

    let parentDir = this.findParentDir(this.catalogItems[0], dirid);

    let temp = []
    for (let item of parentDir.children) {
      if (item.data != dirid)
        temp.push(item)
    }

    parentDir.children = temp;

  }

  // 移动文档
  public moveDocumentToOtherCatalog() {

  }

}
