import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RessourceNotFoundComponent} from './ressource-not-found/ressource-not-found.component';
import {LoginComponent} from './login/login.component';
import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', loadChildren: './home/home.module#HomeModule', canActivate: [AuthGuardService]},
  {path: 'ressource-introuvable', component: RessourceNotFoundComponent},
  {path: '**', redirectTo: 'ressource-introuvable'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
