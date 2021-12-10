import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import { Reparacion } from '../reparacion';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})

export class DetallePage implements OnInit {

  id:string="";

  document: any = {
    id: "",
    data: {} as Reparacion
  };

  

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService) {
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
   };

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
  }

}
