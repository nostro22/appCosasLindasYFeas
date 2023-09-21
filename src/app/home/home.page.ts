import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';
import { observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class HomePage {
  user?: any;
  nombre?:string ="";


  constructor(aut: FirebaseService, private router: Router, private auth:FirebaseService) { 
  }

  ngOnInit() {
   
    
  }

  getEmailPrefix(email: string): string {
    const parts = email.split("@");
    return parts[0];
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.router.navigate(['/log']);
    });
  }

  // @HostListener('ionViewWillLeave')
  // onLeave() {
  //   if (this.router.url==("/log") || this.router.url =="log") {
  //     this.router.navigateByUrl('/home',{replaceUrl:true}); // Navigate back to the same route
  //   }
  // }

  async tomarFotoLindas(){
    await this.router.navigateByUrl('cosasLindas',{replaceUrl:true}).then(() => this.auth.showLoading('Cargando fotos lindas'));
  }
  async tomarFotoFeas(){
    await this.router.navigateByUrl('cosasFeas',{replaceUrl:true}).then(() => this.auth.showLoading('Cargando fotos de cosas feas'));
  }
  
}


