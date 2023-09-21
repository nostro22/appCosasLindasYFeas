import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import Swal from 'sweetalert2';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  public photos: any[] = [];

  constructor(private auth: FirebaseService) { }

  async takePhoto(routa: string): Promise<any[]> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        saveToGallery: true,
      });

      this.photos.push(image);

      const confirm = await Swal.fire({
        title: 'Camara',
        text: '¿Desea usted tomar fotos adicionales?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        heightAuto: false
      });

      if (confirm.value) {
        return this.takePhoto(routa);
      } else {
        await this.auth.uploadPhotosRef(this.photos, routa);
        this.photos=[];
        return this.photos;
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      // Return an empty array if an error occurred
      return [];
    }
  }

}
