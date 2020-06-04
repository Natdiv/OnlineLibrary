import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Utilisateur} from '../models/utilisateur';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-modifier-utilisateur',
  templateUrl: './modifier-utilisateur.component.html',
  styleUrls: ['./modifier-utilisateur.component.css']
})
export class ModifierUtilisateurComponent implements OnInit {

  utilisateur: Utilisateur;
  utilisateurForm: FormGroup;
  message = '';
  nouvelAbonnementState = false;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private authService: AuthService) { }

  ngOnInit() {
    const idUtilisateur = this.route.snapshot.params.utilisateur;
    this.utilisateur = this.authService.getUtilisateurById(idUtilisateur);
    if (this.utilisateur != null) {
      this.utilisateurForm = this.fb.group({
        username: [this.utilisateur.username],
        password: ['', Validators.minLength(8)],
        delai_en_jour: this.utilisateur.delai_en_jour ?
          (+this.utilisateur.delai_en_jour <= 0 ? 'Déjà expiré' : this.utilisateur.delai_en_jour) :
          'Valeur inconnue',
        categorie: this.utilisateur.categorie
      });
    } else {
      this.router.navigate(['/', 'all-utilisateurs']);
    }
  }



  onUtilisateurUpdate() {
    const username = this.utilisateurForm.get('username').value;
    const password = this.utilisateurForm.get('password').value;
    const categorie = this.utilisateurForm.get('categorie').value;
    const delai_en_jour = this.utilisateurForm.get('delai_en_jour').value;
    let utilisateur;
    if (this.nouvelAbonnementState) {
      utilisateur = {
        id: this.utilisateur.id,
        username,
        password,
        categorie,
        delai_en_jour: this.utilisateur.delai_en_jour,
        new_delai_en_jour: this.utilisateurForm.get('new_delai_en_jour').value
      };
    } else {
      utilisateur = {
        id: this.utilisateur.id,
        username,
        password,
        categorie,
        delai_en_jour: this.utilisateur.delai_en_jour,
        new_delai_en_jour: 0
      };
    }
    this.authService.updateUtilisateur(utilisateur).subscribe(
      (response) => {
        this.router.navigate(['/all-utilisateurs']);
      }, (error) => {
        this.message = 'Une erreur est survenue';
        console.log(error);
      }
    );
  }

  nouvelAbonnement() {
    this.nouvelAbonnementState = !this.nouvelAbonnementState;
    if (this.nouvelAbonnementState) {
      this.utilisateurForm.addControl('new_delai_en_jour',
        this.fb.control(null, [Validators.min(1), Validators.required]));
    } else {
      this.utilisateurForm.removeControl('new_delai_en_jour');
    }
  }

  parseItn(delaiEnJour: string) {
    return parseInt(delaiEnJour);
  }
}
