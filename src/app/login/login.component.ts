import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2'
import { CommonModule } from '@angular/common';
import * as firebase from 'firebase/compat';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
  providers: [SweetAlert2Module]

})
export class LoginComponent {
  constructor(private auth: FirebaseService, private router: Router, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private fb: FormBuilder) { }

  get email() {
    return this.formUser.get('email') as FormControl;
  }
  get password() {
    return this.formUser.get('password') as FormControl;
  }

  formUser = this.fb.group({
    'email':
      ["",
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')
        ]
      ],
    'password':
      ["",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12)
        ]
      ]
  })


  accounts = [{ id: '1', label: 'Cuenta 1' }, { id: '2', label: 'Cuenta 2' }, { id: '3', label: 'Cuenta 3' }];
  emailValue: string = "";
  passwordValue: string = "";
  Swal = require('sweetalert2');

  // @HostListener('ionViewWillLeave')
  // onLeave() {
  //   if (this.router.url==("/splash") || this.router.url =="splash") {
  //     this.router.navigateByUrl('/log', {replaceUrl:true}); // Navigate back to the same route
  //   }
  // }
  async login() {
    this.auth.login(this.email.value,this.password.value);
   }
 
 
  async signup() {
    this.toastNotification("Llene ambos campos correo electronico y clave");
  }
  async toastNotification(mensaje: any) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'middle',
      icon: 'alert-outline',
      color: 'tertiary'
    });
    (await toast).present();
  }
  clear() {
    this.formUser.reset();
  }
  async llenarUsuario(usuario: any) {
    switch (usuario) {
      case '1':
        this.email.setValue("eduardo@gmail.com");
        this.password.setValue("123456");
        break;
      case '2':
        this.email.setValue("admin@gmail.com");
        this.password.setValue("123456");
        break;
      case '3':
        this.email.setValue("cliente@gmail.com");
        this.password.setValue("123456");
        break;
    }
  }

}
