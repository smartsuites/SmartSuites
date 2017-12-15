import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {LoginComponent} from './components/login/login.component';
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
import {RouterModule} from "@angular/router";
import {SearchService} from "./service/search/search.service";
import {GlobalService} from "./service/global/global.service";
import {EventService} from "./service/event/event.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
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
import {SaveAsComponent} from './components/notebook/save-as/save-as.component';
import {DropdownInputComponent} from './components/notebook/dropdown-input/dropdown-input.component';
import {ElasticInputComponent} from './components/notebook/elastic-input/elastic-input.component';
import {ParagraphComponent} from './components/notebook/paragraph/paragraph.component';
import {SearchComponent} from './components/search/search.component';
import {SpellComponent} from './components/spell/spell.component';
import {TabledataComponent} from './components/tabledata/tabledata.component';
import {VisualizationComponent} from './components/visualization/visualization.component';
import {BuiltinsComponent} from './components/visualization/builtins/builtins.component';
import {LoginService} from "./service/login/login.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastModule} from "ng2-toastr";
import {NgIncludeDirective } from './directive/ng-include/ng-include.directive';
import {NgZorroAntdModule} from "ng-zorro-antd";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    NoteCreateComponent,
    NoteListComponent,
    NoteRenameComponent,
    NoteImportComponent,
    NgEnterDirective,
    NgEscapeDirective,
    ConfigurationComponent,
    CredentialComponent,
    HomeComponent,
    NotebookRepositoryComponent,
    InterpreterComponent,
    JobmanagerComponent,
    JobComponent,
    WidgetComponent,
    HeliumComponent,
    NotebookComponent,
    SaveAsComponent,
    DropdownInputComponent,
    ElasticInputComponent,
    ParagraphComponent,
    SearchComponent,
    SpellComponent,
    TabledataComponent,
    VisualizationComponent,
    BuiltinsComponent,
    NgIncludeDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // Toast
    ToastModule.forRoot(),
    // UI
    NgZorroAntdModule.forRoot(),
    ReactiveFormsModule
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
    EventService,
    GlobalService,
    NoteRenameService,
    NoteActionService,
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
