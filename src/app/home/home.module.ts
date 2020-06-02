import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AllDocumentsComponent} from '../all-documents/all-documents.component';
import {PdfViewComponent} from '../pdf-view/pdf-view.component';
import {HomeComponent} from './home.component';
import {DocumentIntrouvableComponent} from '../document-introuvable/document-introuvable.component';
import {AjouterDocumentComponent} from '../ajouter-document/ajouter-document.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AddUserComponent} from '../add-user/add-user.component';
import {AllUtilisateursComponent} from '../all-utilisateurs/all-utilisateurs.component';
import {AjouterCategorieComponent} from '../ajouter-categorie/ajouter-categorie.component';
import { AllDocumentsAdminPanelComponent } from '../all-documents-admin-panel/all-documents-admin-panel.component';
import {GuardDroitService} from '../services/guard-droit.service';
import { CompteInactifComponent } from '../compte-inactif/compte-inactif.component';
import {GuardCountStateService} from '../services/guard-count-state.service';
const routes: Routes = [
  {path: '', component: HomeComponent, children: [
      {path: 'all-documents', component: AllDocumentsComponent, canActivate: [GuardCountStateService]},
      {path: 'all-documents-admin-panel', component: AllDocumentsAdminPanelComponent, canActivate: [GuardDroitService, GuardCountStateService]},
      {path: 'pdf-view', component: PdfViewComponent, canActivate: [GuardCountStateService]},
      {path: 'ajouter-document', component: AjouterDocumentComponent, canActivate: [GuardDroitService, GuardCountStateService]},
      {path: 'ajouter-lecteur', component: AddUserComponent, canActivate: [GuardDroitService, GuardCountStateService]},
      {path: 'ajouter-categorie', component: AjouterCategorieComponent, canActivate: [GuardDroitService, GuardCountStateService]},
      {path: 'all-utilisateurs', component: AllUtilisateursComponent, canActivate: [GuardDroitService, GuardCountStateService]},
      {path: 'compte-inactif', component: CompteInactifComponent},
      {path: '', redirectTo: 'all-documents', pathMatch: 'prefix'},
      {path: 'pdf-view/erreur-doc-introuvable', component: DocumentIntrouvableComponent, canActivate: [GuardCountStateService]}
    ]},
];

@NgModule({
declarations: [
  AllDocumentsComponent,
  PdfViewComponent,
  DocumentIntrouvableComponent,
  HomeComponent,
  AjouterDocumentComponent,
  AddUserComponent,
  AllUtilisateursComponent,
  AjouterCategorieComponent,
  AllDocumentsAdminPanelComponent,
  CompteInactifComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  exports: []
})
export class HomeModule { }
