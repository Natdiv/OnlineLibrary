import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {PdfService} from '../services/pdf.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  msg = '';

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private pdfService: PdfService) {
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      delai_en_jour: [0, [Validators.required, Validators.pattern(/[0-9]/)]],
      categorie: ['lecteur']
    });
    this.pdfService.changeEtatCtrlVisible(false);
  }

  onUserSave() {
    const username = this.userForm.get('username').value;
    const password = this.userForm.get('password').value;
    const delaiEnJour = this.userForm.get('delai_en_jour').value;
    const categorie = this.userForm.get('categorie').value;
    const utilisateur = {id: null, username, password, categorie, delai_en_jour: delaiEnJour};
    this.authService.addUser(utilisateur).subscribe(
      (res) => {
        if (!res.erreur) {
          this.router.navigate(['/all-utilisateurs']);
        } else {
          this.msg = 'Une erreur est survenue';
        }
      }, (error) => this.msg = 'Une erreur inconnue est survenue'
    );
  }
}
