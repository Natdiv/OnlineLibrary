import { Component, OnInit } from '@angular/core';
import {PdfService} from '../services/pdf.service';

@Component({
  selector: 'app-document-introuvable',
  templateUrl: './document-introuvable.component.html',
  styleUrls: ['./document-introuvable.component.css']
})
export class DocumentIntrouvableComponent implements OnInit {

  constructor(private pdfService: PdfService) { }

  ngOnInit() {
    this.pdfService.changeEtatCtrlVisible(false);
  }

}
