import { Injectable } from '@angular/core';
import { Document} from '../models/document';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType} from '@angular/common/http';
import { Subject} from 'rxjs';
import { map } from 'rxjs/operators';

import * as pdfjsLib from 'src/script/pdfjs/build/pdf';
import {Router} from '@angular/router';
import {AuthService} from "./auth.service";
pdfjsLib.GlobalWorkerOptions.workerSrc = 'src/script/pdfjs/build/pdf/pdf.worker.min.js';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  pdfDocuments: any[] = [];
  pdfDocumentsSubscriber = new Subject<any[]>();
  currentDoc = null;
  pdfCategories: any[] = [];
  pdfCategoriesSub = new Subject<any[]>();
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
  SERVER_URL = 'http://localhost/bibliotheque/api';

  constructor(private router: Router,
              private httpClient: HttpClient,
              private authService: AuthService) {
    this.getAllDocuments();
    this.getAllCategories();
  }

  /* BACKEND TRAITEMENTS */
  createDocument(document: Document) {
    this.httpClient.post<Document>(`${this.SERVER_URL}/create-document.php`, document)
      .subscribe(
        (doc: Document) => {
          // this.pdfDocuments.push(doc);
          this.getAllDocuments();
        });
  }
  updateDocument(document: Document) {
    this.httpClient.post<Document>(`${this.SERVER_URL}/update-document.php`, document)
      .subscribe(
        (doc: Document) => {
          this.getAllDocuments();
        });
  }
  changerEtatDocument(id: number) {
    // return this.httpClient.post<Document>(`${this.SERVER_URL}/create-document.php`, document)
    return this.httpClient.get<any>(`${this.SERVER_URL}/changer-etat-document.php/?id=${id}`);
  }
  createCategorie(categorie: any) {
    this.httpClient.post<any>(`${this.SERVER_URL}/ajouter-categorie.php`, categorie)
      .subscribe(
        (cat: any) => {
          this.getAllCategories();
        });
  }
  getAllDocuments() {
    const droit = this.authService.user.categorie;
    this.httpClient.get<Document[]>(`${this.SERVER_URL}/read-document.php/?droit=${droit}`)
      .subscribe(
        (document: any[]) => {
          this.pdfDocuments = document;
          this.emitPdfDocument();
        }
      );
  }
  getAllCategories() {
    this.httpClient.get<Document[]>(`${this.SERVER_URL}/read-categorie.php`)
      .subscribe(
        (categories: any[]) => {
          this.pdfCategories = categories;
          this.emitPdfCategorie();
        }
      );
  }

  supprimerCategorie(id: number) {
    return this.httpClient.delete<any>(`${this.SERVER_URL}/delete-categorie.php/?id=${id}`);
  }

  supprimerDocument(id: number, url: string) {
    const data = id + '-sep-' + url.split('/')[url.split('/').length - 1];
    return this.httpClient.delete<any>(`${this.SERVER_URL}/delete-document.php/?data=${data}`);
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
    // this.pdfCategoriesSub.next(this.pdfCategories);
  }
  emitPdfCategorie() {
    this.pdfCategoriesSub.next(this.pdfCategories);
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
