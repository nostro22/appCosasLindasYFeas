import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule, NgForOf } from '@angular/common';
import { FirebaseService } from '../firebase.service';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { PhotosService } from '../photos.service';
import { Observable, Subject } from 'rxjs';
import { MenuComponent } from '../menu/menu.component';
import { ArcElement, Chart, ChartDataset, registerables, ChartItem, ChartEvent } from 'chart.js/auto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cosas-lindas',
  templateUrl: './cosas-lindas.component.html',
  styleUrls: ['./cosas-lindas.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    IonicModule,
    MenuComponent
  ]
})
export class CosasLindasComponent implements OnInit {
  @ViewChild('pieCanvas', { static: true }) pieCanvas!: ElementRef;

  pieChart?: any;
  data = [15, 20, 25, 10, 30];
  colors?: string[];

  private photosSubject = new Subject<any>();
  public photos: any;
  photos$ = this.photosSubject.asObservable();
  public sanitizedPhotoUris: any;
  public fechaString?: string;
  public usuarioActual?: string;


  constructor(private sanitizer: DomSanitizer, private auth: FirebaseService, private router: Router, private photosService: PhotosService,
    private ref: ChangeDetectorRef
  ) {

  }
  getFecha(fecha: Date) {
    return fecha.toDateString();
  }

  async ngOnInit() {
    this.ref.detectChanges();
    this.usuarioActual = this.auth.usuarioAutenticado;
    const photoRefs: any[] = await this.auth.getPhotoRefs();
    const photos = await Promise.all(photoRefs.map(async (photoRef) => ({
      ...photoRef,
      imagen: await this.auth.getPhotos(photoRef.photoRef),
      liked: await this.auth.getLikes(photoRef.photoRef),
      likes: await this.auth.countLikes(photoRef.photoRef)
    })));
    this.photos = photos.filter((photo: { tipo: string; }) => photo.tipo === "cosasLindas");
    this.photos.sort((a: any, b: any) => {
      const dateA =a.fecha; // Convierte la cadena de fecha en objeto Date
      const dateB = b.fecha; // Convierte la cadena de fecha en objeto Date
      if (dateA < dateB) {
        return 1; // date1 is greater
      } else if (dateA > dateB) {
        return -1; // date2 is greater
      } else {
        return 0; // dates are equal
      }
    });
    
    this.photosSubject.next(this.photos); // emit the new value
    const fotosConLikes = this.photos.filter((photo: { likes: number; }) => photo.likes > 0);
    const data = {
      labels: fotosConLikes.map((photo: any) => photo.photoRef),
      datasets: [{
        data: fotosConLikes.map((photo: any) => photo.likes),
        backgroundColor: this.colors
      }]
    };
    this.generateRandomColors();
       if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: data,
      options: {
        
        plugins: {

        },
        onClick: async (e: ChartEvent, activeEls: any) => {
          let datasetLabel = fotosConLikes[activeEls[0].index];
          console.log(datasetLabel);
          this.mostrarUnaFoto(datasetLabel.imagen);

        }
      }
    });
    this.pieChart.update();

  }

  mostrarUnaFoto(ulr :string){
    Swal.fire({
      imageUrl: ulr,
      imageWidth: 640,
      heightAuto: false,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        image: 'center-image'
      },
      backdrop: `
        rgba(0,0,123,0.4)
        center top
        no-repeat
      `
    });
  }

  tomarFotos() {
    this.photosService.takePhoto("cosasLindas").then((photos) => {
      console.log('Photos taken:', photos);
      this.photos = [...this.photos, ...photos]; // update the photos array
      this.photosSubject.next(this.photos); // emit the new value
    }).then(
      respuesta => {
        this.auth.showLoading("Subiendo");
        this.reload();
      });
  }



  votar(photo: any) {
    this.auth.uploadLikes(photo.photoRef).then(
      respuesta => {

        this.reload();
      });
  }
  quitarVoto(photo: any) {
    this.auth.quitarLikes(photo.photoRef).then(
      respuesta => {

        this.reload();
      });
  }

  async liked(idFoto: string) {
    return this.auth.getLikes(idFoto);
  }

  reload() {
    this.ngOnInit();
  }


  generateRandomColors() {
    this.colors = [];
    for (let i = 0; i < this.data.length; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      this.colors.push(`rgb(${r}, ${g}, ${b})`);
    }


  }

}

