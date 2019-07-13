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
  pdfDocuments: Document[] = [
    new Document('assets/pdf/01-ChapouthierFormatLivret.pdf'),
    new Document('assets/pdf/109_osho_meditation.pdf'),
    new Document('assets/pdf/Andre_Levy_Sylvain_Delouvee.pdf'),
    new Document('assets/pdf/ADM.pdf'),
    new Document('assets/pdf/Comment devenir un genie.pdf'),
    new Document('assets/pdf/kotlin-for-android-developers-sample.pdf'),
    new Document('assets/pdf/Livre-152-blogueurs.pdf'),
    new Document('assets/pdf/reflechissez-et-devenez-riche.pdf'),
    new Document('assets/pdf/20XX-XX.exercices.exercices-et-problemes-d-algorithme.sujets-correction.liv.pdf'),
  ];
  documents: any[] = [];
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
  constructor() { }

  /* FIRESTORE TRAITEMENTS */

  ajouterDocumentPdf(pdf: Document) {
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
            console.log(`${doc.id} => ${doc.data()}`);
            this.documents.push(doc);
          }
        );
      }
    );
  }
  /* FIN TRAITEMENT FIRESTORE */

  emitCtrlVisibleEmit() {
    this.ctrlBtnVisibleSubject.next(this.ctrlBtnVisible);
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
    pdfjsLib.getDocument(this.pdfDocuments[this.currentDoc].urlDocument).then(
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
