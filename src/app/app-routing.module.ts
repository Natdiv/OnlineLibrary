import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RessourceNotFoundComponent} from './ressource-not-found/ressource-not-found.component';

const routes: Routes = [
  {path: '', loadChildren: './home/home.module#HomeModule'},
  {path: 'ressource-introuvable', component: RessourceNotFoundComponent},
  {path: '**', redirectTo: 'ressource-introuvable'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
