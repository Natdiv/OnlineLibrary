import { Component, OnInit } from '@angular/core';
import {Utilisateur} from '../models/utilisateur';
import {PdfService} from '../services/pdf.service';
import {AuthService} from '../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-ajouter-categorie',
  templateUrl: './ajouter-categorie.component.html',
  styleUrls: ['./ajouter-categorie.component.css']
})
export class AjouterCategorieComponent implements OnInit {

  categories: any[] = [];
  categorieSub: Subscription;
  connectedUser: Utilisateur = null;
  message = '';
  categorieForm: FormGroup;
  constructor(private pdfService: PdfService,
              private authService: AuthService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.categorieSub = this.pdfService.pdfCategoriesSub.subscribe(
      (data: any []) => {
        this.categories = data;
      }
    );
    this.categorieForm = this.fb.group({
      designation: [null, Validators.required],
      description: [null]
    });
    this.pdfService.changeEtatCtrlVisible(false);
    this.pdfService.emitPdfCategorie();
    this.connectedUser = this.authService.user;
  }

  ajouterCategorie() {
    const designation = this.categorieForm.get('designation').value;
    const description = this.categorieForm.get('description').value;
    const utilisateursId = this.authService.user.id;
    const categorie = {id: null, designation, description, utilisateurs_id: utilisateursId};
    this.pdfService.createCategorie(categorie);
    // this.categories.push(categorie);
    this.categorieForm.reset();
  }

  supprimerCategorie(id: number) {
    this.pdfService.supprimerCategorie(id).subscribe(
      (res) => {
        this.pdfService.getAllCategories();
        this.categories = this.pdfService.pdfCategories;
      }, error => console.log(error)
    );
  }
}
