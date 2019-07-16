import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PdfService} from '../services/pdf.service';
import {Document} from '../models/document';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ajouter-document',
  templateUrl: './ajouter-document.component.html',
  styleUrls: ['./ajouter-document.component.css']
})
export class AjouterDocumentComponent implements OnInit {
  pdfForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileName: string;
  fileUploaded = false;

  constructor(private pdfService: PdfService,
              private formBuilder: FormBuilder,
              private router: Router) {}
  ngOnInit() {
    this.pdfForm = this.formBuilder.group({
      document: [null, [Validators.required]]
    });
  }

  onSavePdf() {
    if (this.fileUrl && this.fileUrl !== '') {
      const pdfDoc = {urlDocument : this.fileUrl, name: this.fileName};
      this.pdfService.ajouterDocumentPdf(pdfDoc);
      this.router.navigate(['/all-documents']);
    }
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.pdfService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileName = file.name;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );
  }

  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);
  }
}
