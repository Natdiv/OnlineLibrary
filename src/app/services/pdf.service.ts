import { Injectable } from '@angular/core';
import { Document} from '../models/document';
import {Subject} from 'rxjs';
import * as firebase from 'firebase';
const db = firebase.firestore();

import * as pdfjsLib from 'src/script/pdfjs/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'src/script/pdfjs/build/pdf/pdf.worker.min.js';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  pdfDocuments: any[] = [];
  pdfDocumentsSubscriber = new Subject<any[]>();
  currentDoc = null;
  private ctrlBtnVisible = false;
  // @ts-ignore
  ctrlBtnVisibleSubject = new Subject<boolean>();
  state: any = {
    pdf: null,
    currentPage: 1,
    zoom: 5,
    nbPage: null
  };
  messageError = '';
  pdfError = false;
  constructor() {
    this.getAllDocuments();
  }

  /* FIRESTORE TRAITEMENTS */

  ajouterDocumentPdf(pdf: any) {
    db.collection('documents').add({
      pdf
    })
      .then((docRef) => {
        console.log('Document written with ID: ' + docRef.id);
      })
      .catch((error) => {
        console.log('Error adding document: ', error);
      });
  }
  getAllDocuments() {
    db.collection('documents').get().then(
      (querySnapshot) => {
        querySnapshot.forEach(
          (doc) => {
            // console.log(`${doc.id} => ${doc.data()}`);
            // @ts-ignore
            this.pdfDocuments.push(doc.data());
          }
        );
        this.emitPdfDocument();
      }
    );
  }
  /* FIN TRAITEMENT FIRESTORE */

  /* FIREBASE STORAGE */

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostIniqueFileName = firebase.firestore.Timestamp
          .now().
          toDate().
          toString();
        const upload = firebase.storage().ref()
          .child('pdf/' + almostIniqueFileName +  '-fs-' + file.name)
          .put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('chargement ...');
          },
          (error) => {
            console.log('Erreur de chargement! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          }

        );
      }
    );
  }
  /* FIN FIREBASE STORAGE */

  emitCtrlVisibleEmit() {
    this.ctrlBtnVisibleSubject.next(this.ctrlBtnVisible);
  }

  emitPdfDocument() {
    this.pdfDocumentsSubscriber.next(this.pdfDocuments);
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
