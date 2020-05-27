import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PdfService} from '../services/pdf.service';
import {Document} from '../models/document';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
declare var $: any;

@Component({
  selector: 'app-ajouter-document',
  templateUrl: './ajouter-document.component.html',
  styleUrls: ['./ajouter-document.component.css']
})
export class AjouterDocumentComponent implements OnInit {
  @ViewChild('File') InputFile;
  UploadFile: File;
  document: Document = {id: null, titre: null, description: null, categorie: null, url: null, dateCreation: null, utilisateursId: null};
  pdfForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileName: string;
  fileUploaded = false;
  message = '';
  categories = [];

  constructor(private pdfService: PdfService,
              private  authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router) {}
  ngOnInit() {
    this.pdfForm = this.formBuilder.group({
      titre: [null, Validators.required],
      description: [null, Validators.required],
      categorie: ['Inconnue'],
      pdf_document: ['', Validators.required]
    });
    this.categories = this.pdfService.pdfCategories;
    this.pdfService.changeEtatCtrlVisible(false);
  }

  onSavePdf() {
    const formData = new FormData();
    formData.append('pdf_document', this.pdfForm.get('pdf_document').value);
    this.pdfService.uploadFile(formData).subscribe(
      (res) => {
        if (!res.error) {
          this.fileUrl = res.url;
          this.fileName = res.name;
          this.fileIsUploading = false;
          this.fileUploaded = true;
          if (this.fileUrl && this.fileUrl !== '') {
            const titre = this.pdfForm.get('titre').value;
            const description = this.pdfForm.get('description').value;
            const categorie = this.pdfForm.get('categorie').value;
            const utilisateursId = this.authService.user.id;
            const url = this.fileUrl;
            this.document = {id: null, titre, description, categorie, url, dateCreation: null, utilisateursId};
            this.pdfService.createDocument(this.document);
            this.router.navigate(['/all-documents']);
          }
        } else {
          this.message = res.message;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    const formData = new FormData();
    formData.append('pdf_document', this.pdfForm.get('pdf_document').value);
    this.pdfService.uploadFile(formData).subscribe(
      (res) => {
        this.fileUrl = res.url;
        this.fileName = file.name;
        this.fileIsUploading = false;
        this.fileUploaded = true;
        console.log(res.message);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  detectFiles(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.pdfForm.get('pdf_document').setValue(file);
    }
  }
}
