import {Component, OnInit, AfterViewInit} from '@angular/core';
import * as pdfjsLib from 'src/script/pdfjs/build/pdf';
import {PdfService} from '../services/pdf.service';
import {Document} from '../models/document';
import {Router} from '@angular/router';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'src/script/pdfjs/build/pdf/pdf.worker.min.js';
declare var $: any;
@Component({
  selector: 'app-all-documents',
  templateUrl: './all-documents.component.html',
  styleUrls: ['./all-documents.component.css']
})
export class AllDocumentsComponent implements OnInit, AfterViewInit {
  state: any = {
    pdf: null,
    currentPage: 1,
    zoom: 1
  };
  pdfDocs: Document[] = [];
  constructor(private pdfService: PdfService,
              private router: Router) { }

  ngOnInit() {
    this.pdfDocs = this.pdfService.pdfDocuments;
    this.pdfService.changeEtatCtrlVisible(false);
  }

  ngAfterViewInit(): void {
    for (let i = 0; i < this.pdfDocs.length; i++) {
      pdfjsLib.getDocument(this.pdfDocs[i].urlDocument).then(
        (pdf) => {
          this.state.pdf = pdf;
          this.state.pdf.getPage(1).then(
            (page) => {
              const canvas = document.getElementById(i + '');
              const ctx = (canvas as HTMLCanvasElement).getContext('2d');
              const viewport = page.getViewport(1);
              (canvas as HTMLCanvasElement).width = viewport.width;
              (canvas as HTMLCanvasElement).height = viewport.height;
              page.render({
                canvasContext: ctx,
                viewport
              });
            }
          );
        }
      );
    }
  }

  onPdfSelection(index: number) {
    this.pdfService.currentDoc = index;
    this.router.navigate(['/pdf-view']);
  }
}
