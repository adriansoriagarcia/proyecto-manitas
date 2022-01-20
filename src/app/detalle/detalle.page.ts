import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import { Reparacion } from '../reparacion';
import { FirestoreService } from '../firestore.service';
import { AlertController } from '@ionic/angular';

import { Router } from '@angular/router';

import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})

export class DetallePage implements OnInit {

  reparacionEditando: Reparacion; 

  id:string="";
  imageURL: String;


  document: any = {
    id: "",
    data: {} as Reparacion,
  };

  arrayColeccionReparaciones: any = [{
    id: "",
    data: {} as Reparacion
   }];

   obtenerListaReparaciones(){
    this.firestoreService.consultar("reparaciones").subscribe((resultadoConsultaReparaciones) => {
      this.arrayColeccionReparaciones = [];
      resultadoConsultaReparaciones.forEach((datosReparacion: any) => {
        this.arrayColeccionReparaciones.push({
          id: datosReparacion.payload.doc.id,
          data: datosReparacion.payload.doc.data()
        });
      })
    });
  }

  constructor(private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    public alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker,
    private router:Router
    ) {
    console.log(this.id)
    this.reparacionEditando = {} as Reparacion;
    this.obtenerListaReparaciones();
    
   };

   pasarPrimeraPantalla () {
    this.router.navigate(['home'])
  }

   clicBotonInsertar() {
    this.firestoreService.insertar("reparaciones", this.document.data).then(() => {
      console.log('Reparación creada correctamente!');
      this.reparacionEditando= {} as Reparacion;
      this.pasarPrimeraPantalla();
    }, (error) => {
      console.error(error);
    });
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
    this.firestoreService.consultarPorId("reparaciones", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el nombre del cliente en consola
        console.log(this.document.data.nombre + this.document.data.imagen);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Reparacion;
        console.log(this.document.data.imagen)
      } 
    });
  }

  clicBotonBorrar() {
    this.alertController.create({
      header: 'ALERTA',
      subHeader: '¡Estas a punto de borrar una reparación!',
      message: 'Si deseas borrar una reparacion pulse si, en caso contrario pulse no',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('nunca');
          }
        },
        {
          text: 'Si',
          handler: () => {
            console.log('si');
            this.firestoreService.borrar("reparaciones", this.document.id).then(() => {
              // Actualizar la lista completa
              this.obtenerListaReparaciones();
              this.borrarImagen();
              console.log('Reparación borrada correctamente!');
              // Limpiar datos de pantalla
              this.reparacionEditando = {} as Reparacion;
              this.pasarPrimeraPantalla();
          })
        }
        }
      ]
    }).then(res => {
      res.present();
    });
    
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("reparaciones", this.document.id, this.document.data).then(() => {
      // Actualizar la lista completa
      this.obtenerListaReparaciones();
      console.log('Reparación modificada correctamente!');
      // Limpiar datos de pantalla
      this.reparacionEditando = {} as Reparacion;
      this.pasarPrimeraPantalla();
    })
  }

  async uploadImagePicker() {
    //Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please waiut...'
    })
    //Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'Image was update successfully',
      duration: 3000
    })
    //Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        //Si no tiene permiso de lectura se solicita al usuario
        if(result == false) {
          this.imagePicker.requestReadPermission();
        }
        else {
          //Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures ({
            maximumImagesCount: 1, //Permitir solo 1 imágen
            outputType: 1 //1 = base64
          }).then (
            (results) => { //En la variable results se tienen las imágenes seleccionadas
              //Carpera del Storage donde se almacenará la imágen
              let nombreCarpeta = "imagenes";
              //recorrer todas las imágenes que haya seleccionado el usuario
              //Aunque realmente sólo será 1 como se ha indicado en las opciones
              for(var i = 0; i< results.length; i++) {
                //Mostrar el mensaje de espera
                loading.present();
                //Asignar el nombre de la imágen en función de la hora actual para 
                // evitar duplicidades de nombres
                let nombreImagen = `${new Date().getTime()}`;
                //Llamar al método que sube la imágen al Storage
                this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, results[i]
                  ).then(snapshot => {
                    snapshot.ref.getDownloadURL()
                    .then(downloadUrl => {
                      //En la variable downloadUrl se tiene la direccion de descarga de la imágen
                      console.log("downloadURL:" + downloadUrl);
                      this.document.data.imagen=downloadUrl;
                      this.imageURL = downloadUrl;
                      //Mostrar el mensaje de finalización de la subida
                      toast.present();
                      //ocultar mensaje de espera
                      loading.dismiss();
                    })
                  })
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  private borrarImagen() {
    this.deleteFile(this.imageURL);
    this.imageURL = null;
  }

  async deleteFile(fileURL) {
    console.log("entra en delete")
    const toast = await this.toastController.create({
      message: 'File was deleted successfully',
      duration: 3000
    });
    this.firestoreService.deleteFileFromURL(fileURL)
      .then(() => {
        this.document.data.imagen = "";
        toast.present();
      }, (err) => {
        console.log(err);
      });
  }
}
