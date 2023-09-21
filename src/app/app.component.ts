import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule]

})


export class AppComponent {


  ngOnInit() {
    firebase.initializeApp(environment.firebaseConfig);
  }



}

