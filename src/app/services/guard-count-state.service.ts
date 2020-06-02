import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardCountStateService implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(
      (resolve, reject) => {
        if (this.authService.user.etat === 'active') {
          resolve(true);
        } else {
          this.router.navigate(['/', 'compte-inactif']);
          resolve(false);
        }
      });
  }
}
