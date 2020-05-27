import { Injectable } from '@angular/core';
import {Utilisateur} from '../models/utilisateur';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  connected = false;
  user: Utilisateur = null;
  SERVER_URL = 'http://localhost/pdf-reader/api';

  constructor(private httpClient: HttpClient) { }

  auth(user: Utilisateur) {
    const url = `${this.SERVER_URL}/authentification.php`;
    return this.httpClient.post<any>(url, user);
  }

  addUser(user: Utilisateur) {
    return this.httpClient.post<any>(`${this.SERVER_URL}/ajouter-utilisateur.php`, user);
  }

  getAllUtilisateurs() {
    return this.httpClient.get<any[]>(`${this.SERVER_URL}/read-utilisateur.php`);
  }

  logout() {
    this.user = null;
    this.connected = false;
  }

  supprimerUtilisateur(id: number) {
    return this.httpClient.delete<any>(`${this.SERVER_URL}/delete-utilisateur.php/?id=${id}`);
  }
}
