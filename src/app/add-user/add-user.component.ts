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
      categorie: [null, [Validators.required]]
    });
    this.pdfService.changeEtatCtrlVisible(false);
  }

  onUserSave() {
    const username = this.userForm.get('username').value;
    const password = this.userForm.get('password').value;
    const categorie = this.userForm.get('categorie').value;
    const utilisateur = {id: null, username, password, categorie};
    this.authService.addUser(utilisateur).subscribe(
      (res) => {
        if (!res.erreur) {
          this.router.navigate(['/all-utilisateurs']);
        } else {
          this.msg = res.message;
        }
      }
    );
  }
}
