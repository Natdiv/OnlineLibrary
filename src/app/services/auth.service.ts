import { Injectable } from '@angular/core';
import {Utilisateur} from '../models/utilisateur';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  connected = false;
  user: Utilisateur = null;
  SERVER_URL = 'http://localhost/bibliotheque/api';
  allUsers: Utilisateur[] = [];
  allUserSubject = new Subject<Utilisateur[]>();

  constructor(private httpClient: HttpClient) {
    this.emitUtilisateur();
  }

  auth(user: Utilisateur) {
    const url = `${this.SERVER_URL}/authentification.php`;
    return this.httpClient.post<any>(url, user);
  }

  addUser(user: any) {
    return this.httpClient.post<any>(`${this.SERVER_URL}/ajouter-utilisateur.php`, user);
  }

  updateStatusUtilisateur(id: number, etat: string) {
    return this.httpClient.post<any>(`${this.SERVER_URL}/update-etat-utilisateur.php`, {id, etat});
  }

  getAllUtilisateurs() {
    this.httpClient.get<Utilisateur[]>(`${this.SERVER_URL}/read-utilisateur.php`)
      .subscribe((data: Utilisateur[]) => {
        this.allUsers = data;
        this.emitUtilisateur();
      });
  }

  logout() {
    this.user = null;
    this.connected = false;
  }

  supprimerUtilisateur(id: number) {
    return this.httpClient.delete<any>(`${this.SERVER_URL}/delete-utilisateur.php/?id=${id}`);
  }

  private emitUtilisateur() {
    this.allUserSubject.next(this.allUsers);
  }

  getUtilisateurById(idUtilisateur: any) {
    for (const user of this.allUsers) {
      if (user.id === idUtilisateur) {
        return user;
      }
    }
    return null;
  }

  updateUtilisateur(utilisateur: any) {
    return this.httpClient.post<any>(`${this.SERVER_URL}/update-utilisateur.php`, utilisateur);
  }
}
