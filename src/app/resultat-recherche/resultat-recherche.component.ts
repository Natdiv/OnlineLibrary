import { Component, OnInit } from '@angular/core';
import {PdfService} from '../services/pdf.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-resultat-recherche',
  templateUrl: './resultat-recherche.component.html',
  styleUrls: ['./resultat-recherche.component.css']
})
export class ResultatRechercheComponent implements OnInit {

  constructor(public pdfService: PdfService,
              private router: Router) { }

  ngOnInit() {
  }

  onDocumentClick(id: number) {
    this.pdfService.currentDoc = id;
    this.router.navigate(['/pdf-view']);
  }
}
