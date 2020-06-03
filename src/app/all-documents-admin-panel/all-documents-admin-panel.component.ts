import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {PdfService} from '../services/pdf.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-all-documents-admin-panel',
  templateUrl: './all-documents-admin-panel.component.html',
  styleUrls: ['./all-documents-admin-panel.component.css']
})
export class AllDocumentsAdminPanelComponent implements OnInit {

  pdfDocs: any[] = [];
  pdfDocsSubscription: Subscription;
  constructor(private pdfService: PdfService,
              private router: Router) { }

  ngOnInit() {
    this.pdfService.getAllDocuments();
    this.pdfDocsSubscription = this.pdfService.pdfDocumentsSubscriber
      .subscribe(
        (data) => {
          this.pdfDocs = data;
        }
      );
    this.pdfService.emitPdfDocument();
    this.pdfService.changeEtatCtrlVisible(false);
  }

  supprimerDocument(i: number, url: string) {
    this.pdfService.supprimerDocument(i, url).subscribe(
      (res) => {
        this.pdfService.getAllDocuments();
      }, error => console.log(error)
    );
  }

  modifierDocument(id: number) {
    this.router.navigate(['/', 'updatedocument', id]);
  }

  split(url: string) {
    return url.split('/')[url.split('/').length - 1];
  }

  setStatusDocument(id: number) {
    this.pdfService.changerEtatDocument(id).subscribe(
      (res) => {
        this.pdfService.getAllDocuments();
      }, error => console.log(error)
    );
  }
}
