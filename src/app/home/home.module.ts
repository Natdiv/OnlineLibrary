import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AllDocumentsComponent} from '../all-documents/all-documents.component';
import {PdfViewComponent} from '../pdf-view/pdf-view.component';
import {HomeComponent} from './home.component';
import {DocumentIntrouvableComponent} from '../document-introuvable/document-introuvable.component';
import {AjouterDocumentComponent} from '../ajouter-document/ajouter-document.component';
import {ReactiveFormsModule} from "@angular/forms";

const routes: Routes = [
  {path: '', component: HomeComponent, children: [
      {path: 'all-documents', component: AllDocumentsComponent},
      {path: 'pdf-view', component: PdfViewComponent},
      {path: 'ajouter-document', component: AjouterDocumentComponent},
      {path: '', redirectTo: 'all-documents', pathMatch: 'prefix'},
      {path: 'pdf-view/erreur-doc-introuvable', component: DocumentIntrouvableComponent}
    ]}
];

@NgModule({
declarations: [
  AllDocumentsComponent,
  PdfViewComponent,
  DocumentIntrouvableComponent,
  HomeComponent,
  AjouterDocumentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ],
  exports: []
})
export class HomeModule { }
