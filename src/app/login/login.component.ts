import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Utilisateur} from '../models/utilisateur';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private utilisateur: Utilisateur = { id: null, username: null, password: null, categorie: null, etat: null,  date_expiration: null};
  msg = '';

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.pattern(/[0-9a-zA-Z]/)]],
      password: [null, [Validators.required]]
    });
  }

  onLogin() {
    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;
    this.utilisateur = {id: null, username, password, categorie: null, etat: null, date_expiration: null};
    this.authService.auth(this.utilisateur).subscribe(
      (res) => {
        if (res.status === 'success') {
          this.authService.connected = true;
          this.authService.user = {id: res.data.id,
            username: res.data.username, password: null, categorie: res.data.categorie, etat: res.data.etat, date_expiration: null};
          this.router.navigate(['/']);
        } else {
          this.msg = 'Erreur d\'authentification';
        }
      },
      (error) => {
        this.msg = 'Une erreur inconnue est survenue';
      });
  }
}
