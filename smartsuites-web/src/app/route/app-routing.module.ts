import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from "../app.component";
import {HomeComponent} from "../components/home/home.component";
import {ConfigurationComponent} from "../components/configuration/configuration.component";
import {CredentialComponent} from "../components/credential/credential.component";
import {LoginComponent} from "../components/login/login.component";
import {NotebookRepositoryComponent} from "../components/notebook-repository/notebook-repository.component";
import {InterpreterComponent} from "../components/interpreter/interpreter.component";
import {HeliumComponent} from "../components/helium/helium.component";
import {JobmanagerComponent} from "../components/jobmanager/jobmanager.component";
import {SearchComponent} from "../components/search/search.component";
import {NotebookComponent} from "../components/notebook/notebook.component";


const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'movies/:id', component: AppComponent},
  {path: 'configuration', component: ConfigurationComponent},
  {path: 'credential', component: CredentialComponent},
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
  {path: 'notebook/:noteId/revision/:revisionId', component: NotebookComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
