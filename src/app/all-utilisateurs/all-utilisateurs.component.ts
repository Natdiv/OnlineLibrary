import {Component, OnDestroy, OnInit} from '@angular/core';
import {PdfService} from '../services/pdf.service';
import {AuthService} from '../services/auth.service';
import {Utilisateur} from '../models/utilisateur';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-all-utilisateurs',
  templateUrl: './all-utilisateurs.component.html',
  styleUrls: ['./all-utilisateurs.component.css']
})
export class AllUtilisateursComponent implements OnInit, OnDestroy {
  users: Utilisateur[] = [];
  userSubscription: Subscription;
  connectedUser: Utilisateur = null;
  message = '';
  constructor(private pdfService: PdfService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.pdfService.changeEtatCtrlVisible(false);
    this.authService.getAllUtilisateurs();
    this.userSubscription = this.authService.allUserSubject.subscribe(
      (data: Utilisateur[]) => {
        this.users = data;
      }
    );
    this.connectedUser = this.authService.user;
  }

  supprimerUtilisateur(i: number) {
    this.authService.supprimerUtilisateur(i).subscribe(
      (res) => {
        this.authService.getAllUtilisateurs();
      }, error => console.log(error)
    );
  }

  modifierUtilisateur(id: number) {

  }

  setStatusCompte(id: number, etat: HTMLInputElement) {
    if (etat.checked === true) {
      this.authService.updateStatusUtilisateur(id, 'active').subscribe(
        () => this.authService.getAllUtilisateurs()
      );
    } else {
      this.authService.updateStatusUtilisateur(id, 'inactive').subscribe(
        () => this.authService.getAllUtilisateurs()
      );
    }
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
