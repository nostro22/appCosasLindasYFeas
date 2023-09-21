import { CommonModule, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    IonicModule
  ]
})
export class MenuComponent  implements OnInit {

  constructor(private router:Router, private auth:FirebaseService) { }
  async toHome(){
    await this.auth.showLoading('Cargando menú').then(() => this.router.navigateByUrl('home',{replaceUrl:true}));
  }
  async toMyPhotos(){
    await this.auth.showLoading('Cargando fotos de usuario').then(() => this.router.navigateByUrl('mis/fotos',{replaceUrl:true}));
  }
  ngOnInit() {}

  isRoute(route :string): boolean {
    return this.router.url === route;
  }
  async toMyLog() {
    await this.auth.showLoading('Cerrando sesión').then(() => this.router.navigateByUrl('log',{replaceUrl:true}));
  }
  

}
