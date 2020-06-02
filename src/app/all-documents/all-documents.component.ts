import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import * as pdfjsLib from 'src/script/pdfjs/build/pdf';
import {PdfService} from '../services/pdf.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthService} from '../services/auth.service';
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
  userCategorie = '';
  constructor(private pdfService: PdfService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.userCategorie = this.authService.user.categorie;
    this.pdfService.getAllDocuments();
    this.pdfDocsSubscription = this.pdfService.pdfDocumentsSubscriber
      .subscribe(
        (data) => {
          this.pdfDocs = data;
          if (this.pdfDocs.length > 0) {
            // this.script_rendu();
            // this.onload();
          }
        }
      );
    this.pdfService.emitPdfDocument();
    this.pdfService.changeEtatCtrlVisible(false);
  }

  ngAfterViewInit(): void {
    // this.script_rendu();
  }

  script_rendu() {
    const passed = [];
    for (let i = 0; i < this.pdfDocs.length; i++) {
      const loadingTask = pdfjsLib.getDocument(`${this.pdfDocs[i].url}`);
      loadingTask.promise.then((pdf) => {
          this.state.pdf = pdf;
          const canvas = document.getElementById('canva-' + i);
          if (true) {
            this.state.pdf.getPage(1).then(
              (page) => {
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
              }
            );
          }
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

  onload(i = 0) {
    const url = this.pdfDocs[i].url;
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then((pdf) => {
      const pageNumber = 1;
      pdf.getPage(pageNumber).then((page) => {
        const scale = 1.5;
        const viewport = page.getViewport({scale});
        const canvas = document.getElementById('canva-' + i);
        this.bloquerEvenement(canvas as HTMLCanvasElement);
        const context = (canvas as HTMLCanvasElement).getContext('2d');
        (canvas as HTMLCanvasElement).width = viewport.width;
        (canvas as HTMLCanvasElement).height = viewport.height;
        const renderContext = {
          canvasContext: context,
          viewport
        };
        const renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
          i++;
          if (i < this.pdfDocs.length) {
            this.onload(i);
          }
        });
      });
    }, (reason) => {
      console.error(reason);
    });
  }
}
