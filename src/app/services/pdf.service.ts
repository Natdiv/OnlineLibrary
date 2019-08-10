import { Injectable } from '@angular/core';
import { Document} from '../models/document';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType} from '@angular/common/http';
import { Subject} from 'rxjs';
import { map } from 'rxjs/operators';

import * as pdfjsLib from 'src/script/pdfjs/build/pdf';
import {Router} from '@angular/router';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'src/script/pdfjs/build/pdf/pdf.worker.min.js';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  pdfDocuments: any[] = [];
  pdfDocumentsSubscriber = new Subject<any[]>();
  currentDoc = null;
  ctrlBtnVisible = false;
  // @ts-ignore
  ctrlBtnVisibleSubject = new Subject<boolean>();
  state: any = {
    pdf: null,
    currentPage: 1,
    zoom: 5,
    nbPage: null
  };
  stateSubject = new Subject<any>();
  messageError = '';
  pdfError = false;
  SERVER_URL = '..';

  constructor(private router: Router,
              private httpClient: HttpClient) {
    this.getAllDocuments();
  }

  /* BACKEND TRAITEMENTS */
  createDocument(document: Document) {
    this.httpClient.post<Document>(`${this.SERVER_URL}/create-document.php`, document)
      .subscribe(
        (doc: Document) => {
          this.emitPdfDocument();
        });
  }
  getAllDocuments() {
    this.httpClient.get<Document[]>(`${this.SERVER_URL}/read-document.php`)
      .subscribe(
        (document: any[]) => {
          this.pdfDocuments = document;
          this.emitPdfDocument();
        }
      );
  }
  /* FIN TRAITEMENT */

  /* BACKEND STORAGE */

  uploadFile(data) {
    const uploadURL = `${this.SERVER_URL}/upload-document.php`;
    return this.httpClient.post<any>(uploadURL, data);
  }
  /* FIN STORAGE */

  emitCtrlVisibleEmit() {
    this.ctrlBtnVisibleSubject.next(this.ctrlBtnVisible);
  }

  emitPdfDocument() {
    this.pdfDocumentsSubscriber.next(this.pdfDocuments);
  }

  emitStatePdf() {
    this.stateSubject.next(this.state);
  }

  getDocumentById(pdfId: number) {
   for (let index = 0; index < this.pdfDocuments.length; index++) {
     if (index === pdfId) {
       return this.pdfDocuments[pdfId];
     }
   }
   return null;
  }

  changeEtatCtrlVisible(ctrlBtnVisible: boolean) {
    this.ctrlBtnVisible = ctrlBtnVisible;
    this.state.currentPage = 1;
    this.emitCtrlVisibleEmit();
  }

  rendre() {
      if (this.currentDoc !== null || this.pdfDocuments.length !== 0) {
        const loadingTask = pdfjsLib.getDocument(`${this.pdfDocuments[this.currentDoc].url}`);
        loadingTask.promise.then((pdf) => {
          this.state.pdf = pdf;
          this.state.pdf.getPage(this.state.currentPage).then(
            (page) => {
              const canvas = document.getElementById('pdf_renderer');
              const ctx = (canvas as HTMLCanvasElement).getContext('2d');
              const viewport = page.getViewport({scale: 1.5});
              (canvas as HTMLCanvasElement).width = viewport.width;
              (canvas as HTMLCanvasElement).height = viewport.height;
              const renderContext = {
                canvasContext: ctx,
                viewport
              };
              const renderTask = page.render(renderContext);
              renderTask.promise.then(() => {
                this.pdfError = false;
              });
            }
          );
        }, (reason) => {
          console.error(reason);
        });
      } else {
        this.messageError = 'Erreur dans les données, impossible de trouver le document';
        this.pdfError = true;
        // this.router.navigate(['/']);
      }
  }
  rendreOld() {
    pdfjsLib.getDocument(this.pdfDocuments[this.currentDoc].pdf.urlDocument).then(
      (pdf) => {
        this.state.pdf = pdf;
        this.state.nbPage = this.state.pdf._pdfInfo.numPages;
        this.state.pdf.getPage(this.state.currentPage).then(
          (page) => {
            const canvas = document.getElementById('pdf_renderer');
            const ctx = (canvas as HTMLCanvasElement).getContext('2d');
            const viewport = page.getViewport(this.state.zoom);
            (canvas as HTMLCanvasElement).width = viewport.width;
            (canvas as HTMLCanvasElement).height = viewport.height;
            page.render({
              canvasContext: ctx,
              viewport
            });
          });
        this.emitCtrlVisibleEmit();
      }
    ).catch(
      (error) => {
        this.messageError = 'Erreur dans les données, impossible de trouver le document';
        this.pdfError = false;
        console.log('ERREUR: ' + error);
      }
    );
  }
}
