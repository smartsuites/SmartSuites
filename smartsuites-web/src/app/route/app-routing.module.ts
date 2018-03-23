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
import {ScreenComponent} from "../components/screen/screen.component";
import {HubComponent} from "../components/hub/hub.component";
import {AdminDashboardComponent} from "../components/admin-dashboard/admin-dashboard.component";
import {AnalysisDashboardComponent} from "../components/analysis-dashboard/analysis-dashboard.component";
import {BussDashboardComponent} from "../components/buss-dashboard/buss-dashboard.component";
import {DocumentComponent} from "../components/document/document.component";
import {CatalogComponent} from "../components/catalog/catalog.component";
import {CustomComponent} from "../components/custom/custom.component";
import {NotifyComponent} from "../components/notify/notify.component";


const routes: Routes = [
  /*{path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'movies/:id', component: AppComponent},


  {path: 'login', component: LoginComponent},




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
  {path: 'jobmanager', component: JobmanagerComponent},
  {path: 'interpreter', component: InterpreterComponent},
  {path: 'notebookRepos', component: NotebookRepositoryComponent},
  {path: 'helium', component: HeliumComponent},
  {path: 'notify', component: NotifyComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
