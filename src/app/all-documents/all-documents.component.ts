import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import * as pdfjsLib from 'src/script/pdfjs/build/pdf';
import {PdfService} from '../services/pdf.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'src/script/pdfjs/build/pdf/pdf.worker.js';

@Component({
  selector: 'app-all-documents',
  templateUrl: './all-documents.component.html',
  styleUrls: ['./all-documents.component.css']
})
export class AllDocumentsComponent implements OnInit, AfterViewInit, OnDestroy {
  state: any = {
    pdf: null,
    currentPage: 1,
    zoom: 1
  };
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
          if (this.pdfDocs.length > 0) {
            this.script_rendu();
          }
        }
      );
    this.pdfService.emitPdfDocument();
    this.pdfService.changeEtatCtrlVisible(false);
  }

  ngAfterViewInit(): void {
  }

  script_rendu() {
    for (let i = 0; i < this.pdfDocs.length; i++) {
      const loadingTask = pdfjsLib.getDocument(`${this.pdfDocs[i].url}`);
      loadingTask.promise.then((pdf) => {
        this.state.pdf = pdf;
        this.state.pdf.getPage(1).then(
          (page) => {
            const canvas = document.getElementById(i + '');
            this.bloquerEvenement(canvas as HTMLCanvasElement);
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
            });
          }
        );
      }, (reason) => {
        // PDF loading error
        console.error(reason);
      });
    }
  }

  onPdfSelection(index: number) {
    this.pdfService.currentDoc = index;
    this.router.navigate(['/pdf-view']);
  }

  ngOnDestroy(): void {
    this.pdfDocsSubscription.unsubscribe();
  }

  bloquerEvenement(canvas: HTMLCanvasElement) {
    canvas.addEventListener(
      'contextmenu',
      (e) => {
        e.preventDefault();
        return false;
      });
  }
}
