import {Component, OnDestroy, OnInit} from '@angular/core';
import {PdfService} from '../services/pdf.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  categorie = '';
  ctrlBtnVisible = false;
  ctrlVisibleSubscription: Subscription;
  state = null;
  rencents = [];
  pdfDocsSubscription: Subscription;
  stateSubscription: Subscription;
  user = '';
  route = '';

  constructor(
    public pdfService: PdfService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.user = this.authService.user.username;
    this.route = this.router.url.split('/')[this.router.url.split('/').length - 1];
    this.ctrlVisibleSubscription = this.pdfService.ctrlBtnVisibleSubject.subscribe(
      (ctrlBtnVisible: boolean) => {
        if (this.ctrlBtnVisible !== ctrlBtnVisible) {
          this.ctrlBtnVisible = ctrlBtnVisible;
          this.state = this.pdfService.state;
        }
      }
    );
    this.stateSubscription = this.pdfService.stateSubject.subscribe(
      (state) => {
        this.state = (state.pdf !== null) ? state : false;
      }
    );
    this.takeRecent();
    this.pdfService.emitStatePdf();
    this.pdfService.emitCtrlVisibleEmit();
    this.categorie = this.authService.user.categorie;
    this.changerTextEntete('Tous les documents');
  }

  takeRecent() {
    this.pdfDocsSubscription = this.pdfService.pdfDocumentsSubscriber.subscribe(
      (data) => {
        let i = 0;
        this.rencents = [];
        for (const d of data) {
          if (i >= 5) {
            break;
          }
          this.rencents.push(d);
          i++;
        }
      }
    );

  }

  goToPageSuivante() {
    if (this.pdfService.state.pdf == null ||
      this.pdfService.state.currentPage >= this.pdfService.state.pdf
        ._pdfInfo.numPages) {
      return;
    }

    this.pdfService.state.currentPage += 1;
    window.document.scrollingElement.scrollTop = 0;
    this.pdfService.rendre();
  }

  goToPagePrecedent() {
    if (this.pdfService.state.pdf == null ||
      this.pdfService.state.currentPage === 1) { return; }
    this.pdfService.state.currentPage -= 1;
    window.document.scrollingElement.scrollTop = 0;
    this.pdfService.rendre();
  }

  goToPageX(valeur: string) {
    // tslint:disable-next-line:radix
    const value = parseInt(valeur.split('/')[0]);
    if (typeof value === 'number' && value >= 1) {
      if (this.pdfService.state.pdf == null ||
        value > this.pdfService.state.pdf
          ._pdfInfo.numPages) {
        return;
      }
      this.pdfService.state.currentPage = value;
      this.pdfService.rendre();
      window.document.scrollingElement.scrollTop = 0;
    }
  }

  rechercherPdf(text: string) {
    if (text !== '') {
      this.pdfService.rechercherDocument(text).subscribe(
        (response) => {
          this.pdfService.resultatRecherche = response;
          this.router.navigate(['/', 'resulatrecherche']);
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.ctrlVisibleSubscription.unsubscribe();
    this.pdfDocsSubscription.unsubscribe();
  }

  zoomPlus() {
    if (this.pdfService.state.pdf == null) { return; }
    this.pdfService.state.zoom += 0.5;
    this.pdfService.rendre();
    // console.log(this.pdfService.state.zoom);
  }

  zoomMoins() {
    if (this.pdfService.state.pdf == null) { return; }
    this.pdfService.state.zoom -= 0.5;
    this.pdfService.rendre();
    // console.log(this.pdfService.state.zoom);
  }

  onPdfClick(i: number) {
    this.pdfService.currentDoc = i;
    this.pdfService.emitCurrentDoc();
    this.router.navigate(['/pdf-view']);
  }

  logout() {
    this.authService.logout();
  }
  changerTextEntete(text: string) {
    this.route = text;
  }
}
