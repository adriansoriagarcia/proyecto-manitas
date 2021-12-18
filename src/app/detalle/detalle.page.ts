import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import { Reparacion } from '../reparacion';
import { FirestoreService } from '../firestore.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})

export class DetallePage implements OnInit {

  reparacionEditando: Reparacion; 

  id:string="";

  document: any = {
    id: "",
    data: {} as Reparacion
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

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, public alertController: AlertController) {
    console.log(this.id)
    this.reparacionEditando = {} as Reparacion;
    this.obtenerListaReparaciones();
    
   };

   clicBotonInsertar() {
    this.firestoreService.insertar("reparaciones", this.document.data).then(() => {
      console.log('Reparación creada correctamente!');
      this.reparacionEditando= {} as Reparacion;
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
        console.log(this.document.data.nombre);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Reparacion;
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
              console.log('Reparación borrada correctamente!');
              // Limpiar datos de pantalla
              this.reparacionEditando = {} as Reparacion;
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
    })
  }

}
