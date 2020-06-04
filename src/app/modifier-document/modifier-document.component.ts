import { Component, OnInit } from '@angular/core';
import {PdfService} from '../services/pdf.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Document} from '../models/document';

@Component({
  selector: 'app-modifier-document',
  templateUrl: './modifier-document.component.html',
  styleUrls: ['./modifier-document.component.css']
})
export class ModifierDocumentComponent implements OnInit {

  document: Document;
  documentForm: FormGroup;
  categories: any[] = [];
  message = '';
  constructor(private  pdfService: PdfService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder) { }

  ngOnInit() {
    const idDocument = this.route.snapshot.params.document;
    this.document = this.pdfService.getDocumentById(idDocument);
    this.categories = this.pdfService.pdfCategories;
    if (this.document != null) {
      this.documentForm = this.fb.group({
        titre: this.document.titre,
        description: this.document.description,
        categorie: this.document.categorie
      });
    } else {
      this.router.navigate(['/', 'all-documents-admin-panel']);
    }
  }

  onDocumentUpdate() {
    const titre = this.documentForm.get('titre').value;
    const description = this.documentForm.get('description').value;
    const categorie = this.documentForm.get('categorie').value;
    const document = {
      id: this.document.id,
      titre,
      description,
      categorie
    };
    this.pdfService.updateDocument(document).subscribe(
      (response) => {
        this.router.navigate(['/all-documents-admin-panel']);
      }, (error) => this.message = 'Une erreur est survenue'
    );
  }
}
