import { Injectable } from '@angular/core';
import {Utilisateur} from '../models/utilisateur';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  connected = false;
  user: Utilisateur = null;
  SERVER_URL = '..';

  constructor(private httpClient: HttpClient) { }

  // @ts-ignore
  auth(user: Utilisateur) {
    return this.httpClient.post<any>(`${this.SERVER_URL}/login.php`, user);
  }

  logout() {
    this.user = null;
    this.connected = false;
  }
}
