import { Component, OnInit } from '@angular/core';
import {PdfService} from '../services/pdf.service';
import {AuthService} from '../services/auth.service';
import {Utilisateur} from '../models/utilisateur';

@Component({
  selector: 'app-all-utilisateurs',
  templateUrl: './all-utilisateurs.component.html',
  styleUrls: ['./all-utilisateurs.component.css']
})
export class AllUtilisateursComponent implements OnInit {

  users: Utilisateur[] = [];
  connectedUser: Utilisateur = null;
  message = '';
  constructor(private pdfService: PdfService,
              private authService: AuthService) { }

  ngOnInit() {
    this.pdfService.changeEtatCtrlVisible(false);
    this.getAllUsers();
    this.connectedUser = this.authService.user;
  }

  supprimerUtilisateur(i: number) {
    this.authService.supprimerUtilisateur(i).subscribe(
      (res) => {
        this.getAllUsers();
      }, error => console.log(error)
    );
  }

  private getAllUsers() {
    this.authService.getAllUtilisateurs().
    subscribe(
      (res) => {
        this.users = res;
      }, (error => {
        this.message = 'Une erreur est survenue!';
      })
    );
  }
}
