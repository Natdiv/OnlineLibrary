import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'consultation-pdf';
  constructor() {
    const firebaseConfig = {
      apiKey: `AIzaSyCZRegvC6_gBxgMQI-sLMlzPxnfrQTpEjY`,
      authDomain: 'all-iot-pdf-reader.firebaseapp.com',
      databaseURL: 'https://all-iot-pdf-reader.firebaseio.com',
      projectId: 'all-iot-pdf-reader',
      storageBucket: '',
      messagingSenderId: '944787693856',
      appId: '1:944787693856:web:bce34abdb703290c'
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

  }
}
