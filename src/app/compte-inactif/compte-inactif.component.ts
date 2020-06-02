import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compte-inactif',
  templateUrl: './compte-inactif.component.html',
  styleUrls: ['./compte-inactif.component.css']
})
export class CompteInactifComponent implements OnInit {

  stateDemande = false;
  constructor() { }

  ngOnInit() {
  }

  demanderActivation() {
    this.stateDemande = true;
    setTimeout(() => this.stateDemande = false, 5000);
  }
}
