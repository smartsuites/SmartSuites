/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


// UI PRIMENG
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HttpModule} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {AccordionModule, SidebarModule} from 'primeng/primeng';
import {AutoCompleteModule} from 'primeng/primeng';
import {BreadcrumbModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import {CalendarModule} from 'primeng/primeng';
import {CarouselModule} from 'primeng/primeng';
import {ColorPickerModule} from 'primeng/primeng';
import {ChartModule} from 'primeng/primeng';
import {CheckboxModule} from 'primeng/primeng';
import {ChipsModule} from 'primeng/primeng';
import {CodeHighlighterModule} from 'primeng/primeng';
import {ConfirmDialogModule} from 'primeng/primeng';
import {SharedModule} from 'primeng/primeng';
import {ContextMenuModule} from 'primeng/primeng';
import {DataGridModule} from 'primeng/primeng';
import {DataListModule} from 'primeng/primeng';
import {DataScrollerModule} from 'primeng/primeng';
import {DataTableModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import {DragDropModule} from 'primeng/primeng';
import {DropdownModule} from 'primeng/primeng';
import {EditorModule} from 'primeng/primeng';
import {FieldsetModule} from 'primeng/primeng';
import {FileUploadModule} from 'primeng/primeng';
import {GalleriaModule} from 'primeng/primeng';
import {GMapModule} from 'primeng/primeng';
import {GrowlModule} from 'primeng/primeng';
import {InputMaskModule} from 'primeng/primeng';
import {InputSwitchModule} from 'primeng/primeng';
import {InputTextModule} from 'primeng/primeng';
import {InputTextareaModule} from 'primeng/primeng';
import {LightboxModule} from 'primeng/primeng';
import {ListboxModule} from 'primeng/primeng';
import {MegaMenuModule} from 'primeng/primeng';
import {MenuModule} from 'primeng/primeng';
import {MenubarModule} from 'primeng/primeng';
import {MessagesModule} from 'primeng/primeng';
import {MultiSelectModule} from 'primeng/primeng';
import {OrderListModule} from 'primeng/primeng';
import {OrganizationChartModule} from 'primeng/primeng';
import {OverlayPanelModule} from 'primeng/primeng';
import {PaginatorModule} from 'primeng/primeng';
import {PanelModule} from 'primeng/primeng';
import {PanelMenuModule} from 'primeng/primeng';
import {PasswordModule} from 'primeng/primeng';
import {PickListModule} from 'primeng/primeng';
import {ProgressBarModule} from 'primeng/primeng';
import {RadioButtonModule} from 'primeng/primeng';
import {RatingModule} from 'primeng/primeng';
import {ScheduleModule} from 'primeng/primeng';
import {SelectButtonModule} from 'primeng/primeng';
import {SlideMenuModule} from 'primeng/primeng';
import {SliderModule} from 'primeng/primeng';
import {SpinnerModule} from 'primeng/primeng';
import {SplitButtonModule} from 'primeng/primeng';
import {StepsModule} from 'primeng/primeng';
import {TabMenuModule} from 'primeng/primeng';
import {TabViewModule} from 'primeng/primeng';
import {TerminalModule} from 'primeng/primeng';
import {TieredMenuModule} from 'primeng/primeng';
import {ToggleButtonModule} from 'primeng/primeng';
import {ToolbarModule} from 'primeng/primeng';
import {TooltipModule} from 'primeng/primeng';
import {TreeModule} from 'primeng/primeng';
import {TreeTableModule} from 'primeng/primeng';


import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {LoginComponent} from './common/login/login.component';
import {NoteCreateComponent} from './components/note-create/note-create.component';
import {NoteListComponent} from './components/note-list/note-list.component';
import {NoteRenameComponent} from './components/note-rename/note-rename.component';
import {NoteImportComponent} from './components/note-import/note-import.component';
import {NgEnterDirective} from './directive/ng-enter/ng-enter.directive';
import {NgEscapeDirective} from './directive/ng-escape/ng-escape.directive';
import {ArrayOrderingService} from "./service/array-ordering/array-ordering.service";
import {BaseUrlService} from "./service/base-url/base-url.service";
import {WebsocketMessageService} from "./service/websocket/websocket-message.service";
import {WebsocketEventService} from "./service/websocket/websocket-event.service";
import {ConfigurationComponent} from './components/configuration/configuration.component';
import {CredentialComponent} from './components/credential/credential.component';
import {SearchService} from "./service/search/search.service";
import {GlobalService} from "./service/global/global.service";
import {EventService1} from "./service/event/event.service";
import {AppRoutingModule} from "./route/app-routing.module";
import {HomeComponent} from './components/home/home.component';
import {NoteActionService} from "./service/note-action/note-action.service";
import {NoteRenameService} from "./service/note-rename/note-rename.service";
import {NoteListService} from "./service/note-list/note-list.service";
import {NotebookRepositoryComponent} from './components/notebook-repository/notebook-repository.component';
import {InterpreterComponent} from './components/interpreter/interpreter.component';
import {JobmanagerComponent} from './components/jobmanager/jobmanager.component';
import {JobComponent} from './components/jobmanager/job/job.component';
import {WidgetComponent} from './components/interpreter/widget/widget.component';
import {HeliumComponent} from './components/helium/helium.component';
import {NotebookComponent} from './components/notebook/notebook.component';
import {ParagraphComponent} from './components/notebook/paragraph/paragraph.component';
import {SearchComponent} from './components/search/search.component';
import {SpellComponent} from './components/spell/spell.component';
import {TabledataComponent} from './components/tabledata/tabledata.component';
import {VisualizationComponent} from './components/visualization/visualization.component';
import {BuiltinsComponent} from './components/visualization/builtins/builtins.component';
import {LoginService} from "./service/login/login.service";

import {NgIncludeDirective } from './directive/ng-include/ng-include.directive';
import {AppProfileComponent } from './common/profile/app.profile.component';
import {AppFooterComponent } from './common/footer/app.footer.component';
import {AppMenuComponent, AppSubMenuComponent} from './common/menu/app.menu.component';
import {AppTopbarComponent } from './common/topbar/app.topbar.component';

// DEMO ONLY
import {DashboardDemoComponent} from './demo/view/dashboarddemo.component';
import {SampleDemoComponent} from './demo/view/sampledemo.component';
import {FormsDemoComponent} from './demo/view/formsdemo.component';
import {DataDemoComponent} from './demo/view/datademo.component';
import {PanelsDemoComponent} from './demo/view/panelsdemo.component';
import {OverlaysDemoComponent} from './demo/view/overlaysdemo.component';
import {MenusDemoComponent} from './demo/view/menusdemo.component';
import {MessagesDemoComponent} from './demo/view/messagesdemo.component';
import {MiscDemoComponent} from './demo/view/miscdemo.component';
import {EmptyDemoComponent} from './demo/view/emptydemo.component';
import {ChartsDemoComponent} from './demo/view/chartsdemo.component';
import {FileDemoComponent} from './demo/view/filedemo.component';
import {UtilsDemoComponent} from './demo/view/utilsdemo.component';
import {DocumentationComponent} from './demo/view/documentation.component';

import {CarService} from './demo/service/carservice';
import {CountryService} from './demo/service/countryservice';
import {EventService} from './demo/service/eventservice';
import {NodeService} from './demo/service/nodeservice';



import { ScreenComponent } from './components/screen/screen.component';
import { MessageService} from "primeng/components/common/messageservice";
import {HubComponent} from "./components/hub/hub.component";
import {AdminDashboardComponent} from "./components/admin-dashboard/admin-dashboard.component";
import {BussDashboardComponent} from "./components/buss-dashboard/buss-dashboard.component";
import {AnalysisDashboardComponent} from "./components/analysis-dashboard/analysis-dashboard.component";
import {NoteVarShareService} from "./service/note-var-share/note-var-share.service";
import {SaveAsService} from "./service/save-as/save-as.service";
import {AceEditorDirective} from "ng2-ace-editor";
import {MomentModule} from "angular2-moment";
import {NgxEchartsModule} from "ngx-echarts";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConfigurationComponent,
    NotebookComponent,
    AceEditorDirective,
    ParagraphComponent,

    /*NavbarComponent,

    NoteCreateComponent,
    NoteListComponent,
    NoteRenameComponent,
    NoteImportComponent,
    NgEnterDirective,
    NgEscapeDirective,

    CredentialComponent,
    HomeComponent,
    NotebookRepositoryComponent,
    InterpreterComponent,
    JobmanagerComponent,
    JobComponent,
    WidgetComponent,
    HeliumComponent,

    SearchComponent,
    SpellComponent,
    TabledataComponent,
    VisualizationComponent,
    BuiltinsComponent,
    NgIncludeDirective,*/
    AppProfileComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppSubMenuComponent,
    AppTopbarComponent,

    //DEMO ONLY
    DashboardDemoComponent,
    SampleDemoComponent,
    FormsDemoComponent,
    DataDemoComponent,
    PanelsDemoComponent,
    OverlaysDemoComponent,
    MenusDemoComponent,
    MessagesDemoComponent,
    MessagesDemoComponent,
    MiscDemoComponent,
    ChartsDemoComponent,
    EmptyDemoComponent,
    FileDemoComponent,
    UtilsDemoComponent,
    ScreenComponent,
    HubComponent,
    AdminDashboardComponent,
    BussDashboardComponent,
    AnalysisDashboardComponent,

    DocumentationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MomentModule,
    NgxEchartsModule,

    //UI
    HttpModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ColorPickerModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    SelectButtonModule,
    SlideMenuModule,
    SidebarModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule
  ],
  entryComponents: [
  ],
  providers: [
    ArrayOrderingService,
    BaseUrlService,
    WebsocketMessageService,
    WebsocketEventService,
    SearchService,
    NoteListService,
    EventService1,
    GlobalService,
    NoteRenameService,
    NoteActionService,
    LoginService,
    MessageService,
    NoteVarShareService,
    SaveAsService,

    //DEMO ONLY
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    CarService, CountryService, EventService, NodeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
