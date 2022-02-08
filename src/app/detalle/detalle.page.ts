import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import { Reparacion } from '../reparacion';
import { FirestoreService } from '../firestore.service';
import { AlertController } from '@ionic/angular';

import { Router } from '@angular/router';

import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
//import { SocialSharing } from '@ionic-native/social-sharing/ngx';



@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})

export class DetallePage implements OnInit {

   // Imagen que se va a mostrar en la página
   imagenTempSrc: String;

   subirArchivoImagen: boolean = false;
   borrarArchivoImagen: boolean = false;

   // Nombre de la colección en Firestore Database
  reparacciones: String = "EjemploImagenes";

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
    private router:Router,
    private socialSharing: SocialSharing
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
        this.imagenTempSrc = this.document.data.imagen;
        // Como ejemplo, mostrar el nombre del cliente en consola
        console.log(this.document.data.imagen);
        //console.log(this.imageURL)
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Reparacion;
        //console.log(this.document.data.imagen)
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
            this.borrarImagen();
            this.guardarDatos();
            this.firestoreService.borrar("reparaciones", this.document.id).then(() => {
              // Actualizar la lista completa
              this.obtenerListaReparaciones(); 
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

  async seleccionarImagen() {
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        // Si no tiene permiso de lectura se solicita al usuario
        if(result == false){
          this.imagePicker.requestReadPermission();
        }
        else {
          // Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1,  // Permitir sólo 1 imagen
            outputType: 1           // 1 = Base64
          }).then(
            (results) => {  // En la variable results se tienen las imágenes seleccionadas
              if(results.length > 0) { // Si el usuario ha elegido alguna imagen
                this.imagenTempSrc = "data:image/jpeg;base64,"+results[0];
                //this.document.data.imagen=this.imagenTempSrc;
                console.log("Imagen que se ha seleccionado (en Base64): " + this.imagenTempSrc);
                // Se informa que se ha cambiado para que se suba la imagen cuando se actualice la BD
                this.subirArchivoImagen = true;
                this.borrarArchivoImagen = false;
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

  public guardarDatos() {
    if(this.subirArchivoImagen) {
      // Borrar el archivo de la imagen antigua si la hubiera
      if(this.document.data.imagen != null) {
        this.eliminarArchivo(this.document.data.imagen);        
      }
      // Si la imagen es nueva se sube como archivo y se actualiza la BD
      this.subirImagenActualizandoBD();
    } else {
      if(this.borrarArchivoImagen) {
        this.eliminarArchivo(this.document.data.imagen);        
        this.document.data.imagen = null;
      }
      // Si no ha cambiado la imagen no se sube como archivo, sólo se actualiza la BD
      this.actualizarBaseDatos();
    }
  }

  async subirImagenActualizandoBD(){
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    // Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'Image was updated successfully',
      duration: 3000
    });

    // Carpeta del Storage donde se almacenará la imagen
    let nombreCarpeta = "imagenes";

    // Mostrar el mensaje de espera
    loading.present();
    // Asignar el nombre de la imagen en función de la hora actual para
    //  evitar duplicidades de nombres         
    let nombreImagen = `${new Date().getTime()}`;
    // Llamar al método que sube la imagen al Storage
    this.firestoreService.subirImagenBase64(nombreCarpeta, nombreImagen, this.imagenTempSrc)
      .then(snapshot => {
        snapshot.ref.getDownloadURL()
          .then(downloadURL => {
            // En la variable downloadURL se tiene la dirección de descarga de la imagen
            console.log("downloadURL:" + downloadURL);
            //this.document.data.imagenURL = downloadURL;            
            // Mostrar el mensaje de finalización de la subida
            toast.present();
            // Ocultar mensaje de espera
            loading.dismiss();

            // Una vez que se ha termninado la subida de la imagen 
            //    se actualizan los datos en la BD
            this.document.data.imagen = downloadURL;
            this.actualizarBaseDatos();
          })
      })    
  } 

  public borrarImagen() {
    // No mostrar ninguna imagen en la página
    this.imagenTempSrc = null;
    // Se informa que no se debe subir ninguna imagen cuando se actualice la BD
    this.subirArchivoImagen = false;
    this.borrarArchivoImagen = true;
  }

  async eliminarArchivo(fileURL) {
    const toast = await this.toastController.create({
      message: 'File was deleted successfully',
      duration: 3000
    });
    this.firestoreService.borrarArchivoPorURL(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err);
      });
  }

  private actualizarBaseDatos() {    
    console.log("Guardando en la BD: ");
    console.log(this.document.data);
    this.firestoreService.actualizar(this.reparacciones, this.document.id, this.document.data);
  }

  text: string='Precio'
  link: string='https://ionicframework.com/'

  ShareGeneric(parameter){
    const url = this.link
    const text = this.text  + this.document.data.precio
    this.socialSharing.share(this.document.data.nombre, 'REPARACIÓN', null,  this.document.data.imagen)
  }

 
}
