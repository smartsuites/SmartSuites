import {Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {MenuItem, SelectItem} from 'primeng/primeng';
import {AppComponent} from '../../app.component';
import {EventService} from "../../service/event/event.service";
import {Constants} from "../../model/Constants";
import {NoteCreateComponent} from "../../components/note-create/note-create.component";

@Component({
  selector: 'app-menu',
  templateUrl:'./app.menu.component.html',
})
export class AppMenuComponent implements OnInit,OnDestroy {

  @Input() reset: boolean;

  model: any[];

  items = [];

  //********** Create Note ***********//

  @ViewChild("noteCreate")
  noteCreateComponent:NoteCreateComponent


  showCreateNoteDialog() {
    this.noteCreateComponent.getInterpreterSettings()
    this.noteCreateComponent.openCreateNoteDialog()
  }

  noteName
  defaultInter


  //********** Import Note ***********//
  importUrl

  importUrlClick: boolean = false;

  importNoteDialogDisplay: boolean = false;

  showImportNoteDialog() {
    this.importNoteDialogDisplay = true;
  }

  constructor(public app: AppComponent,
              private eventService: EventService) {
  }

  subscribers = []

  ngOnDestroy(): void {
    this.eventService.unsubscribeSubscriptions(this.subscribers)
  }

  ngOnInit() {

    let self = this;
    // 用于监听笔记加载消息，异步加载Notes
    self.eventService.subscribeRegister(self.subscribers,'noteComplete', function (notes) {

      self.items = self.generateNoteBookMenu(self.app.notes.root.children)

      self.model = [
        /*{label: '系统首页', icon: 'fa fa-fw fa-home', routerLink: ['/home']},*/
        {label: '系统首页', icon: 'fa fa-fw fa-home', routerLink: ['/analysisDashboard']},
        {
          label: '笔记管理', icon: 'fa fa-fw fa-book', /*routerLink: ['/notebook'],*/
          items: self.items
        },
        {label: '新建笔记', icon: 'fa fa-fw fa-plus-circle', command: (event) => {
            self.showCreateNoteDialog()
          }},
        {label: '导入笔记', icon: 'fa fa-fw fa-upload', command: (event) => {
            self.showImportNoteDialog()
          }},
        {label: '任务监管', icon: 'fa fa-fw fa-tasks', routerLink: ['/jobmanager']},
        {label: '大屏发布', icon: 'fa fa-fw fa-dashboard', routerLink: ['/screen']},
        {label: '远程HUB', icon: 'fa fa-fw fa-soundcloud', routerLink: ['/hub']},
        {label: '在线文档', icon: 'fa fa-fw fa-book', routerLink: ['/document']}
      ];


    });


    self.eventService.subscribeRegister(self.subscribers,'businessMenu', function () {

      self.model = [
        /*{label: '系统首页', icon: 'fa fa-fw fa-home', routerLink: ['/home']},*/
        {label: '系统首页', icon: 'fa fa-fw fa-home', routerLink: ['/bussDashboard']},
        {
          label: '财务部报表', icon: 'fa fa-fw fa-laptop',
          items: [
            {
              label: 'Submenu 1', icon: 'fa fa-fw fa-sign-in',
              items: [
                {
                  label: 'Submenu 1.1', icon: 'fa fa-fw fa-sign-in',
                  items: [
                    {label: 'Submenu 1.1.2', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.1.3', icon: 'fa fa-fw fa-sign-in'},
                  ]
                },
                {
                  label: 'Submenu 1.2', icon: 'fa fa-fw fa-sign-in',
                  items: [
                    {label: 'Submenu 1.2.1', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.2.2', icon: 'fa fa-fw fa-sign-in'}
                  ]
                },
              ]
            },
            {label: 'Utils', icon: 'fa fa-fw fa-wrench', routerLink: ['/utils']},
          ]
        },
        {
          label: '销售部报表', icon: 'fa fa-fw fa-laptop',
          items: [
            {
              label: 'Submenu 1', icon: 'fa fa-fw fa-sign-in',
              items: [
                {
                  label: 'Submenu 1.1', icon: 'fa fa-fw fa-sign-in',
                  items: [
                    {label: 'Submenu 1.1.1', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.1.2', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.1.3', icon: 'fa fa-fw fa-sign-in'},
                  ]
                },
                {
                  label: 'Submenu 1.2', icon: 'fa fa-fw fa-sign-in',
                  items: [
                    {label: 'Submenu 1.2.1', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.2.2', icon: 'fa fa-fw fa-sign-in'}
                  ]
                },
              ]
            },
            {label: 'Utils', icon: 'fa fa-fw fa-wrench', routerLink: ['/utils']},
          ]
        },
        {
          label: '人事部报表', icon: 'fa fa-fw fa-laptop',
          items: [
            {
              label: 'Submenu 1', icon: 'fa fa-fw fa-sign-in',
              items: [
                {
                  label: 'Submenu 1.1', icon: 'fa fa-fw fa-sign-in',
                  items: [
                    {label: 'Submenu 1.1.1', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.1.2', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.1.3', icon: 'fa fa-fw fa-sign-in'},
                  ]
                },
                {
                  label: 'Submenu 1.2', icon: 'fa fa-fw fa-sign-in',
                  items: [
                    {label: 'Submenu 1.2.1', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.2.2', icon: 'fa fa-fw fa-sign-in'}
                  ]
                },
              ]
            },
            {label: 'Utils', icon: 'fa fa-fw fa-wrench', routerLink: ['/utils']},
          ]
        },
        {
          label: '生产部报表', icon: 'fa fa-fw fa-laptop',
          items: [
            {
              label: 'Submenu 1', icon: 'fa fa-fw fa-sign-in',
              items: [
                {
                  label: 'Submenu 1.1', icon: 'fa fa-fw fa-sign-in',
                  items: [
                    {label: 'Submenu 1.1.1', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.1.2', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.1.3', icon: 'fa fa-fw fa-sign-in'},
                  ]
                },
                {
                  label: 'Submenu 1.2', icon: 'fa fa-fw fa-sign-in',
                  items: [
                    {label: 'Submenu 1.2.1', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.2.2', icon: 'fa fa-fw fa-sign-in'}
                  ]
                },
              ]
            },
            {label: 'Utils', icon: 'fa fa-fw fa-wrench', routerLink: ['/utils']},
          ]
        },
        {label: '我的订阅', icon: 'fa fa-fw fa-book', routerLink: ['/documentation']}
      ]

    })

    self.eventService.subscribeRegister(self.subscribers,'managerMenu', function () {

      self.model = [
        /*{label: '系统首页', icon: 'fa fa-fw fa-home', routerLink: ['/home']},*/
        {label: '系统首页', icon: 'fa fa-fw fa-home', routerLink: ['/adminDashboard']},
        {label: '运行任务', icon: 'fa fa-fw fa-tasks', routerLink: ['/jobmanager']},
        {
          label: '系统配置', icon: 'fa fa-fw fa-gears',
          items: [
            {label: '解析器配置管理', icon: 'fa fa-fw fa-cube', routerLink: ['/interpreter']},
            {label: '笔记仓库管理', icon: 'fa fa-fw fa-database', routerLink: ['/notebookRepos']},
            {label: '用户权限管理', icon: 'fa fa-fw fa-users', routerLink: ['/credential']},
            {label: '插件配置管理', icon: 'fa fa-fw fa-list-alt', routerLink: ['/helium']},
            /*{label: '目录管理', icon: 'fa fa-fw fa-list', routerLink: ['/catalog']},*/
            {label: '个性化配置管理', icon: 'fa fa-fw fa-pencil-square-o', routerLink: ['/custom']},
            {label: '参数配置管理', icon: 'fa fa-fw fa-cog', routerLink: ['/configuration']}
          ]
        },
        {
          label: '平台定制化', icon: 'fa fa-fw fa-eye', badge: '8',
          items: [
            {
              label: '菜单模式',
              icon: 'fa fa-fw fa-bars',
              items: [
                {label: '竖向菜单模式', icon: 'fa fa-fw fa-bars', command: () => self.app.changeToStaticMenu()},
                {label: '浮动菜单模式', icon: 'fa fa-fw fa-bars', command: () => self.app.changeToOverlayMenu()},
                {label: '简洁菜单模式', icon: 'fa fa-fw fa-bars', command: () => self.app.changeToSlimMenu()},
                {label: '横向菜单模式', icon: 'fa fa-fw fa-bars', command: () => self.app.changeToHorizontalMenu()},
              ]
            },
            {
              label: '菜单颜色',
              icon: 'fa fa-fw  fa-tachometer',
              items: [
                {label: '白色菜单', icon: 'fa fa-sun-o fa-fw', command: () => self.app.darkMenu = false},
                {label: '黑色菜单', icon: 'fa fa-moon-o fa-fw', command: () => self.app.darkMenu = true}
              ]
            },
            {
              label: '用户位置',
              icon: 'fa fa-fw fa-user',
              items: [
                {label: '菜单跟随', icon: 'fa fa-sun-o fa-fw', command: () => self.app.profileMode = 'inline'},
                {label: '顶部跟随', icon: 'fa fa-moon-o fa-fw', command: () => self.app.profileMode = 'top'},
              ]
            },
            {
              label: '主题配置', icon: 'fa fa-fw fa-paint-brush', badge: '5',
              items: [
                {
                  label: '蓝色主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('blue');
                }
                },
                {
                  label: '青色主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('cyan');
                }
                },
                {
                  label: '靛蓝主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('indigo');
                }
                },
                {
                  label: '紫色主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('purple');
                }
                },
                {
                  label: '蓝绿主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('teal');
                }
                },
                {
                  label: '橙色主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('orange');
                }
                },
                {
                  label: '深紫主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('deeppurple');
                }
                },
                {
                  label: '淡蓝主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('lightblue');
                }
                },
                {
                  label: '绿色主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('green');
                }
                },
                {
                  label: '浅绿主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('lightgreen');
                }
                },
                {
                  label: '青橙主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('lime');
                }
                },
                {
                  label: '琥珀主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('amber');
                }
                },
                {
                  label: '棕色主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('brown');
                }
                },
                {
                  label: '深灰主题', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                  self.changeTheme('darkgrey');
                }
                },
              ]
            },
            {
              label: '布局颜色', icon: 'fa fa-fw fa-magic',
              items: [
                {
                  label: '单色模式',
                  icon: 'fa fa-fw fa-circle',
                  items: [
                    {
                      label: '蓝色模式', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('blue');
                    }
                    },
                    {
                      label: '紫色模式', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('purple');
                    }
                    },
                    {
                      label: '青色模式', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('cyan');
                    }
                    },
                    {
                      label: '靛蓝模式', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('indigo');
                    }
                    },
                    {
                      label: '蓝绿模式', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('teal');
                    }
                    },
                    {
                      label: '粉红模式', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('pink');
                    }
                    },
                    {
                      label: '青橙模式', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('lime');
                    }
                    },
                    {
                      label: '绿色模式', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('green');
                    }
                    },
                    {
                      label: '琥珀模式', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('amber');
                    }
                    },
                    {
                      label: '深灰模式', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('darkgrey');
                    }
                    },
                  ]
                },
                {
                  label: '特殊模式',
                  icon: 'fa fa-fw fa-fire',
                  items: [
                    {
                      label: '流行模式', icon: 'fa fa-fw fa-paint-brush',
                      command: (event) => {
                        self.changeLayout('influenza', true);
                      }
                    },
                    {
                      label: 'Suzy', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('suzy', true);
                    }
                    },
                    {
                      label: 'Calm', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('calm', true);
                    }
                    },
                    {
                      label: 'Crimson', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('crimson', true);
                    }
                    },
                    {
                      label: 'Night', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('night', true);
                    }
                    },
                    {
                      label: 'Skyling', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('skyline', true);
                    }
                    },
                    {
                      label: 'Sunkist', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('sunkist', true);
                    }
                    },
                    {
                      label: 'Little Leaf', icon: 'fa fa-fw fa-paint-brush',
                      command: (event) => {
                        self.changeLayout('littleleaf', true);
                      }
                    },
                    {
                      label: 'Joomla', icon: 'fa fa-fw fa-paint-brush', command: (event) => {
                      self.changeLayout('joomla', true);
                    }
                    },
                    {
                      label: 'Firewatch', icon: 'fa fa-fw fa-paint-brush',
                      command: (event) => {
                        self.changeLayout('firewatch', true);
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }/*,
        {
          label: 'Components', icon: 'fa fa-fw fa-sitemap',
          items: [
            {label: 'Sample Page', icon: 'fa fa-fw fa-columns', routerLink: ['/sample']},
            {label: 'Forms', icon: 'fa fa-fw fa-code', routerLink: ['/forms']},
            {label: 'Data', icon: 'fa fa-fw fa-table', routerLink: ['/data']},
            {label: 'Panels', icon: 'fa fa-fw fa-list-alt', routerLink: ['/panels']},
            {label: 'Overlays', icon: 'fa fa-fw fa-square', routerLink: ['/overlays']},
            {label: 'Menus', icon: 'fa fa-fw fa-minus-square-o', routerLink: ['/menus']},
            {label: 'Messages', icon: 'fa fa-fw fa-circle-o-notch', routerLink: ['/messages']},
            {label: 'Charts', icon: 'fa fa-fw fa-area-chart', routerLink: ['/charts']},
            {label: 'File', icon: 'fa fa-fw fa-arrow-circle-o-up', routerLink: ['/file']},
            {label: 'Misc', icon: 'fa fa-fw fa-user-secret', routerLink: ['/misc']}
          ]
        },
        {
          label: 'Template Pages', icon: 'fa fa-fw fa-life-saver',
          items: [
            {label: 'Empty Page', icon: 'fa fa-fw fa-square-o', routerLink: ['/empty']},
            {
              label: 'Landing Page',
              icon: 'fa fa-fw fa-certificate',
              url: 'assets/pages/landing.html',
              target: '_blank'
            },
            {label: 'Login Page', icon: 'fa fa-fw fa-sign-in', url: 'assets/pages/login.html', target: '_blank'},
            {
              label: 'Error Page',
              icon: 'fa fa-fw fa-exclamation-circle',
              url: 'assets/pages/error.html',
              target: '_blank'
            },
            {label: 'Not Found Page', icon: 'fa fa-fw fa-times', url: 'assets/pages/notfound.html', target: '_blank'},
            {
              label: 'Access Denied Page', icon: 'fa fa-fw fa-exclamation-triangle',
              url: 'assets/pages/access.html', target: '_blank'
            }
          ]
        },
        {
          label: 'Menu Hierarchy', icon: 'fa fa-fw fa-gg',
          items: [
            {
              label: 'Submenu 1', icon: 'fa fa-fw fa-sign-in',
              items: [
                {
                  label: 'Submenu 1.1', icon: 'fa fa-fw fa-sign-in',
                  items: [
                    {label: 'Submenu 1.1.1', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.1.2', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.1.3', icon: 'fa fa-fw fa-sign-in'},
                  ]
                },
                {
                  label: 'Submenu 1.2', icon: 'fa fa-fw fa-sign-in',
                  items: [
                    {label: 'Submenu 1.2.1', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 1.2.2', icon: 'fa fa-fw fa-sign-in'}
                  ]
                },
              ]
            },
            {
              label: 'Submenu 2', icon: 'fa fa-fw fa-sign-in',
              items: [
                {
                  label: 'Submenu 2.1', icon: 'fa fa-fw fa-sign-in',
                  items: [
                    {label: 'Submenu 2.1.1', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 2.1.2', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 2.1.3', icon: 'fa fa-fw fa-sign-in'},
                  ]
                },
                {
                  label: 'Submenu 2.2', icon: 'fa fa-fw fa-sign-in',
                  items: [
                    {label: 'Submenu 2.2.1', icon: 'fa fa-fw fa-sign-in'},
                    {label: 'Submenu 2.2.2', icon: 'fa fa-fw fa-sign-in'}
                  ]
                },
              ]
            }
          ]
        },
        {label: 'Utils', icon: 'fa fa-fw fa-wrench', routerLink: ['/utils']},
        {label: 'Documentation', icon: 'fa fa-fw fa-book', routerLink: ['/documentation']}*/
      ];

    })

  }

  generateNoteBookMenu(nodes) {

    var items = []

    for (let node of nodes) {

      // 去掉回收站
      if(node.name.indexOf(Constants.TRASH_FOLDER_ID) > -1){
        continue;
      }

      if (node.children) {

        var subitem = this.generateNoteBookMenu(node.children)

        var treeNode = {
          label: node.name,
          icon: 'fa fa-fw fa-folder',
          items: subitem
        }

        items.push(treeNode)

      } else {
        var leafNode = {
          label: node.name,
          icon: 'fa fa-fw fa-book',
          routerLink: ['/notebook/' + node.id]
        }
        items.push(leafNode)
      }

    }

    return items
  }

  changeTheme(theme: string) {
    const themeLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('theme-css');

    themeLink.href = 'assets/theme/theme-' + theme + '.css';
  }

  changeLayout(layout: string, special?: boolean) {
    const layoutLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('layout-css');
    layoutLink.href = 'assets/layout/css/layout-' + layout + '.css';

    if (special) {
      this.app.darkMenu = true;
    }
  }
}

@Component({
  /* tslint:disable:component-selector */
  selector: '[app-submenu]',
  /* tslint:enable:component-selector */
  template: `
    <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
      <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass"
          *ngIf="child.visible === false ? false : true">
        <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)"
           class="ripplelink" *ngIf="!child.routerLink"
           [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
          <i [ngClass]="child.icon"></i><span>{{child.label}}</span>
          <i class="fa fa-fw fa-angle-down menuitem-toggle-icon" *ngIf="child.items"></i>
          <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
        </a>

        <a (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)" class="ripplelink"
           *ngIf="child.routerLink"
           [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
           [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null"
           [attr.target]="child.target">
          <i [ngClass]="child.icon"></i><span>{{child.label}}</span>
          <i class="fa fa-fw fa-angle-down menuitem-toggle-icon" *ngIf="child.items"></i>
          <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
        </a>
        <div class="layout-menu-tooltip">
          <div class="layout-menu-tooltip-arrow"></div>
          <div class="layout-menu-tooltip-text">{{child.label}}</div>
        </div>
        <div class="submenu-arrow" *ngIf="child.items"></div>
        <ul app-submenu [item]="child" *ngIf="child.items" [visible]="isActive(i)" [reset]="reset"
            [@children]="(app.isSlim()||app.isHorizontal())&&root ? isActive(i) ?
                     'visible' : 'hidden' : isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
      </li>
    </ng-template>
  `,
  animations: [
    trigger('children', [
      state('hiddenAnimated', style({
        height: '0px'
      })),
      state('visibleAnimated', style({
        height: '*'
      })),
      state('visible', style({
        display: 'block'
      })),
      state('hidden', style({
        display: 'none'
      })),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class AppSubMenuComponent {

  @Input() item: MenuItem;

  @Input() root: boolean;

  @Input() visible: boolean;

  _reset: boolean;

  activeIndex: number;

  constructor(public app: AppComponent) {
  }

  itemClick(event: Event, item: MenuItem, index: number) {
    if (this.root) {
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }

    // avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    // activate current item and deactivate active sibling if any
    this.activeIndex = (this.activeIndex === index) ? null : index;

    // execute command
    if (item.command) {
      item.command({originalEvent: event, item: item});
    }

    // prevent hash change
    if (item.items || (!item.url && !item.routerLink)) {
      event.preventDefault();
    }

    // hide menu
    if (!item.items) {
      if (this.app.isHorizontal() || this.app.isSlim()) {
        this.app.resetMenu = true;
      } else {
        this.app.resetMenu = false;
      }

      this.app.overlayMenuActive = false;
      this.app.staticMenuMobileActive = false;
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }
  }

  onMouseEnter(index: number) {
    if (this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim())) {
      this.activeIndex = index;
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  @Input()
  get reset(): boolean {
    return this._reset;
  }

  set reset(val: boolean) {
    this._reset = val;

    if (this._reset && (this.app.isHorizontal() || this.app.isSlim())) {
      this.activeIndex = null;
    }
  }
}
