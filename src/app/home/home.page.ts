import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Reparacion } from '../reparacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  reparacionEditando: Reparacion; 
  filtro: string = '';
  

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

  constructor(private firestoreService: FirestoreService, private router:Router) {
    // Crear una reparacion vacía
    this.obtenerListaReparaciones();
    this.reparacionEditando = {} as Reparacion;
    
  }

  clicBotonInsertar() {
    this.firestoreService.insertar("reparaciones", this.reparacionEditando).then(() => {
      console.log('Reparación creada correctamente!');
      this.reparacionEditando= {} as Reparacion;
    }, (error) => {
      console.error(error);
    });
  }



  idReparacionSelec: string;

  selecReparacion(reparacionSelec) {
    console.log("Reparacion seleccionada: ");
    console.log(reparacionSelec);
    this.idReparacionSelec = reparacionSelec.id;
    this.reparacionEditando.nombre = reparacionSelec.data.nombre;
    this.reparacionEditando.fecha = reparacionSelec.data.fecha;
    this.reparacionEditando.lugar = reparacionSelec.data.lugar;
    this.reparacionEditando.lugar = reparacionSelec.data.precio;
    this.reparacionEditando.imagen = reparacionSelec.data.imagen;
    this.router.navigate(['/detalle', this.idReparacionSelec]);
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("reparaciones", this.idReparacionSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaReparaciones();
      // Limpiar datos de pantalla
      this.reparacionEditando = {} as Reparacion;
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("reparaciones", this.idReparacionSelec, this.reparacionEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaReparaciones();
      // Limpiar datos de pantalla
      this.reparacionEditando = {} as Reparacion;
    })
  }

}
