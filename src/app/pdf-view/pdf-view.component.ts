import {Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PdfService} from '../services/pdf.service';
import {Document} from '../models/document';
declare var $: any;

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.css']
})
export class PdfViewComponent implements OnInit, AfterViewInit, OnDestroy {
  // tslint:disable-next-line:variable-name
  @ViewChild('pdf_renderer') pdf_renderer: ElementRef;
  private context: CanvasRenderingContext2D;
  state: any = {
    pdf: null,
    currentPage: 1,
    zoom: 5
  };
  pdfDoc = null;
  pdfError = false;
  messageError = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              public pdfService: PdfService) { }

  ngOnInit() {
    if (this.pdfService.currentDoc != null) {
      this.pdfDoc = this.pdfService.getDocumentById(this.pdfService.currentDoc);
      this.state = this.pdfService.state;
      this.pdfService.changeEtatCtrlVisible(true);
    } else {
      this.pdfDoc = null;
    }
  }

  ngAfterViewInit(): void {
      this.pdfService.rendre();
      this.blocquerEvenement();
  }
  blocquerEvenement() {
    (window.document).addEventListener(
      'beforeprint',
      (e) => {
        console.log('BEFORE PRINT ...');
        (this.pdf_renderer.nativeElement as HTMLCanvasElement)
          .style.filter = 'blur(15px)';
        e.preventDefault();
        return false;
      });
    (window.document).addEventListener(
      'keydown',
      (e) => {
        if (e.ctrlKey && e.keyCode === 'P'.charCodeAt(0)) {
          (this.pdf_renderer.nativeElement as HTMLCanvasElement)
            .style.filter = 'blur(15px)';
          e.preventDefault();
          return false;
        }
      });
    (this.pdf_renderer.nativeElement as HTMLCanvasElement).addEventListener(
      'contextmenu',
      (e) => {
        e.preventDefault();
        return false;
      });
    (this.pdf_renderer.nativeElement as HTMLCanvasElement).addEventListener(
      'copy',
      (e) => {
        e.preventDefault();
        return false;
      });
    (this.pdf_renderer.nativeElement as HTMLCanvasElement).addEventListener(
      'cut',
      (e) => {
        e.preventDefault();
        return false;
      });
    (this.pdf_renderer.nativeElement as HTMLCanvasElement).addEventListener(
      'drag',
      (e) => {
        e.preventDefault();
        return false;
      });
    (this.pdf_renderer.nativeElement as HTMLCanvasElement).addEventListener(
      'dblclick',
      (e) => {
        e.preventDefault();
        return false;
      });
    (this.pdf_renderer.nativeElement as HTMLCanvasElement).addEventListener(
      'dragstart',
      (e) => {
        e.preventDefault();
        return false;
      });
    (this.pdf_renderer.nativeElement as HTMLCanvasElement).addEventListener(
      'drop',
      (e) => {
        e.preventDefault();
        return false;
      });
    (this.pdf_renderer.nativeElement as HTMLCanvasElement).addEventListener(
      'select',
      (e) => {
        e.preventDefault();
        return false;
      });
    (this.pdf_renderer.nativeElement as HTMLCanvasElement).addEventListener(
      'mousedown',
      (e) => {
        e.preventDefault();
        return false;
      });
    (this.pdf_renderer.nativeElement as HTMLCanvasElement).addEventListener(
      'click',
      (e) => {
        e.preventDefault();
        (this.pdf_renderer.nativeElement as HTMLCanvasElement)
          .style.filter = 'blur(0px)';
        return false;
      });
    window.addEventListener('blur', (e) => {
      (this.pdf_renderer.nativeElement as HTMLCanvasElement)
        .style.filter = 'blur(15px)';
    });
    window.addEventListener('focus', (e) => {
      (this.pdf_renderer.nativeElement as HTMLCanvasElement)
        .style.filter = 'blur(0px)';
    });
    (this.pdf_renderer.nativeElement as HTMLCanvasElement)
      .style.filter = 'blur(15px)';
  }

  ngOnDestroy(): void {
    // this.pdfService.ctrlBtnVisible = false;
  }
}
