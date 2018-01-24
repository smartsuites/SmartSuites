import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from "../app.component";
import {ConfigurationComponent} from "../components/configuration/configuration.component";
import {CredentialComponent} from "../components/credential/credential.component";
import {LoginComponent} from "../common/login/login.component";
import {NotebookRepositoryComponent} from "../components/notebook-repository/notebook-repository.component";
import {InterpreterComponent} from "../components/interpreter/interpreter.component";
import {HeliumComponent} from "../components/helium/helium.component";
import {JobmanagerComponent} from "../components/jobmanager/jobmanager.component";
import {SearchComponent} from "../components/search/search.component";
import {NotebookComponent} from "../components/notebook/notebook.component";


// DEMO ONLY
import {DashboardDemoComponent} from "../demo/view/dashboarddemo.component";
import {SampleDemoComponent} from "../demo/view/sampledemo.component";
import {FormsDemoComponent} from "../demo/view/formsdemo.component";
import {DataDemoComponent} from "../demo/view/datademo.component";
import {PanelsDemoComponent} from "../demo/view/panelsdemo.component";
import {OverlaysDemoComponent} from "../demo/view/overlaysdemo.component";
import {MenusDemoComponent} from "../demo/view/menusdemo.component";
import {MessagesDemoComponent} from "../demo/view/messagesdemo.component";
import {MiscDemoComponent} from "../demo/view/miscdemo.component";
import {EmptyDemoComponent} from "../demo/view/emptydemo.component";
import {ChartsDemoComponent} from "../demo/view/chartsdemo.component";
import {FileDemoComponent} from "../demo/view/filedemo.component";
import {UtilsDemoComponent} from "../demo/view/utilsdemo.component";
import {DocumentationComponent} from "../demo/view/documentation.component";
import {ScreenComponent} from "../components/screen/screen.component";
import {HubComponent} from "../components/hub/hub.component";
import {AdminDashboardComponent} from "../components/admin-dashboard/admin-dashboard.component";
import {AnalysisDashboardComponent} from "../components/analysis-dashboard/analysis-dashboard.component";
import {BussDashboardComponent} from "../components/buss-dashboard/buss-dashboard.component";
import {DocumentComponent} from "../components/document/document.component";
import {CatalogComponent} from "../components/catalog/catalog.component";
import {CustomComponent} from "../components/custom/custom.component";


const routes: Routes = [
  /*{path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'movies/:id', component: AppComponent},


  {path: 'login', component: LoginComponent},
  {path: 'notebookRepos', component: NotebookRepositoryComponent},
  {path: 'interpreter', component: InterpreterComponent},
  {path: 'helium', component: HeliumComponent},
  {path: 'jobmanager', component: JobmanagerComponent},
  {path: 'search/:searchTerm', component: SearchComponent},
  {path: 'notebook', component: NotebookComponent},

  {path: 'notebook/:noteId', component: NotebookComponent},
  {path: 'notebook/:noteId/paragraph?=:paragraphId', component: NotebookComponent},
  {path: 'notebook/:noteId/paragraph/:paragraphId?', component: NotebookComponent},
  {path: 'notebook/:noteId/revision/:revisionId', component: NotebookComponent},*/

  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'screen', component: ScreenComponent},
  {path: 'hub', component: HubComponent},
  {path: 'configuration', component: ConfigurationComponent},
  {path: 'adminDashboard', component: AdminDashboardComponent},
  {path: 'analysisDashboard', component: AnalysisDashboardComponent},
  {path: 'bussDashboard', component: BussDashboardComponent},
  {path: 'notebook/:noteId', component: NotebookComponent},
  {path: 'document', component: DocumentComponent},
  {path: 'catalog', component: CatalogComponent},
  {path: 'credential', component: CredentialComponent},
  {path: 'custom', component: CustomComponent},

  {path: 'home', component: DashboardDemoComponent},
  {path: 'sample', component: SampleDemoComponent},
  {path: 'forms', component: FormsDemoComponent},
  {path: 'data', component: DataDemoComponent},
  {path: 'panels', component: PanelsDemoComponent},
  {path: 'overlays', component: OverlaysDemoComponent},
  {path: 'menus', component: MenusDemoComponent},
  {path: 'messages', component: MessagesDemoComponent},
  {path: 'misc', component: MiscDemoComponent},
  {path: 'empty', component: EmptyDemoComponent},
  {path: 'charts', component: ChartsDemoComponent},
  {path: 'file', component: FileDemoComponent},
  {path: 'utils', component: UtilsDemoComponent},
  {path: 'documentation', component: DocumentationComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
