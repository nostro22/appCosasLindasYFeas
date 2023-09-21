import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage'
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage'
import 'firebase/compat/firestore';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private router: Router,private toastCtrl: ToastController, private loadingCtrl: LoadingController,) { 
    this.token="";
  }
  private user: any;
  private nombre: any;
  private email: any;
  public token: string;

  public usuarioAutenticado: any;

  async login(email: string, password: string) {
    try {
      const validado = await firebase.auth().signInWithEmailAndPassword(email,password );
       this.showLoading('Ingresando');
      if (validado) {
        // Validation successful
        this.usuarioAutenticado=firebase.auth().currentUser;
        this.email=firebase.auth().currentUser?.email;
        this.router.navigateByUrl('home', { replaceUrl: true });
      } else {
        // Validation failed
        this.toastNotification('Llene ambos campos correo electrónico y clave');
      }
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
          this.toastNotification('El usuario no se encuentra registrado.');
          break;
        case 'auth/wrong-password':
          this.toastNotification('Combinación de clave y correo electrónico errónea.');
          break;
        default:
          this.toastNotification('Ocurrió un error durante el inicio de sesión.');
          break;
      }
    }
  }
  
  async toastNotification(mensaje: any) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'middle',
      icon: 'camera-reverse-outline',
      color: 'danger'
    });
    (await toast).present();
  }

  getIdToken(){
    return this.token;
  }

  estaLogeado(){
    if(this.usuarioAutenticado){
      return true;
    }
    else{
      return false;
    }
  }
  logout(){
    firebase.auth().signOut().then(()=>{
      this.token="";
      this.router.navigateByUrl('log',{replaceUrl:true});
    });
  }
  async showLoading(mensaje:string) {
    const loading = await this.loadingCtrl.create({
      message: mensaje,
      duration: 3000,
      translucent:true,
      cssClass: 'custom-loading'
      
    });
    loading.present();
    return new Promise<void>((resolve) => setTimeout(() => resolve(), 3000));
  }
  async getEmail() {
    return firebase.auth().currentUser?.email;
  }
  async getUser() {
    return firebase.auth().currentUser
  }
  getEmailPrefix(email: string): string {
    const parts = email.split("@");
    return parts[0];
  }
  async uploadPhotosRef(photos: any[], tipo: string) {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        throw new Error("Usuario no ingreso");
      }

      const photoRefCollection = firebase.firestore().collection('photoRef');

      for (const photo of photos) {
        const id = Math.random().toString(36).substring(2);
        const filePath = `photos/${id}`;
        const storageRef = firebase.storage().ref().child(filePath);

        const photoData = await fetch(photo.webPath);
        const blob = await photoData.blob();
        const task = storageRef.put(blob);
        await task;
        const photoRefDoc = {
          currentUser: user.email,
          photoRef: id,
          fecha: new Date().toLocaleString('es-AR'),
          likes: 0,
          tipo: tipo
        };

        await photoRefCollection.add(photoRefDoc);
      }
    } catch (error) {
      console.log("Error uploading photos:", error);
      throw error;
    }
  }
  async getPhotoRefs(): Promise<any[]> {
    const photoRefCollection = firebase.firestore().collection('photoRef');
    const querySnapshot = await photoRefCollection.get();
    const photoRefs: any[] | PromiseLike<any[]> = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      photoRefs.push(data);
    });
    return photoRefs;
  }
  async getPhotos(photoRefs: string) {
    const photos = "";
    const storageRef = firebase.storage().ref().child(`photos/${photoRefs}`);
    const photoUrl = await storageRef.getDownloadURL();
    return photoUrl;
  }

  async uploadLikes(idFoto: string) {
    try {
      const user = this.usuarioAutenticado;
      if (!user) {
        throw new Error("Usuario no ingreso");
      }

      const photoRefCollection = firebase.firestore().collection('likes');

      const photoRefDoc = {
        usuario: user.email,
        photoRef: idFoto,
      };

      await photoRefCollection.add(photoRefDoc);
    }
    catch (error) {
      console.log("Error subiendo el me gusta ", error);
      throw error;
    }
  }

  async getLikes(idFoto: string) {
    const user = firebase.auth().currentUser;
    if (!user) {
      return false;
    }
    const photoRefCollection = firebase.firestore().collection('likes');

    const photoRefQuery = photoRefCollection
      .where('usuario', '==', user.email)
      .where('photoRef', '==', idFoto)
      .limit(1);

    const snapshot = await photoRefQuery.get();
    if (snapshot.empty) {
      console.log("El usuario no dio like a esta foto");
      return false;
    } else {

      return true;
    }
  }
  async getIsAutor(idFoto: string) {
    const user = firebase.auth().currentUser;
    if (!user) {
      return false;
    }
    const photoRefCollection = firebase.firestore().collection('photoRef');

    const photoRefQuery = photoRefCollection
      .where('usuario', '==', user.email)
      .where('photoRef', '==', idFoto)
      .limit(1);

    const snapshot = await photoRefQuery.get();
    if (snapshot.empty) {
      console.log("El usuario no es autor de esta foto");
      return false;
    } else {

      return true;
    }
  }
  async countLikes(idFoto: string) {
    const user = firebase.auth().currentUser;
    if (!user) {
      return 0;
    }
    const photoRefCollection = firebase.firestore().collection('likes');

    const photoRefQuery = photoRefCollection
      .where('photoRef', '==', idFoto);

    const snapshot = await photoRefQuery.get();
    if (snapshot.empty) {
      console.log("No likes for this photo");
      return 0;
    } else {
      return snapshot.size;
    }
  }



  async quitarLikes(idFoto: string) {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        throw new Error("Usuario no ingreso");
      }

      const photoRefCollection = firebase.firestore().collection('likes');

      const photoRefQuery = photoRefCollection
        .where('usuario', '==', user.email)
        .where('photoRef', '==', idFoto)
        .limit(1);

      const snapshot = await photoRefQuery.get();

      if (snapshot.empty) {
        console.log("El usuario no dio like a esta foto");
        return;
      }

      const photoRefDoc = snapshot.docs[0].ref;
      await photoRefDoc.delete();
    }
    catch (error) {
      console.log("Error quitando el me gusta ", error);
      throw error;
    }
  }

}


