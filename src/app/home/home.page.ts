import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Reparacion } from '../reparacion';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userEmail: String = "";
  userUID: String = "";
  isLogged: boolean;

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

  constructor(private firestoreService: FirestoreService, 
    private router:Router,
    public loadingCtrl: LoadingController,
    private authService: AuthService,
    public afAuth: AngularFireAuth) {
    // Crear una reparacion vacía
    this.obtenerListaReparaciones();
    this.reparacionEditando = {} as Reparacion;
    
  }

  idReparacionSelec: string;

  pasarSegudaPantalla () {
    this.router.navigate(['detalle/:id'])
  }


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

  ionViewDidEnter() {
    this.isLogged = false;
    this.afAuth.user.subscribe(user => {
      if(user){
        this.userEmail = user.email;
        this.userUID = user.uid;
        this.isLogged = true;
      } else {
        this.router.navigate(["/home"]);
      }
    })
  }

  login() {
    this.router.navigate(["/login"]);
  }

  logout(){
    this.authService.doLogout()
    .then(res => {
      this.userEmail = "";
      this.userUID = "";
      this.isLogged = false;
      console.log(this.userEmail);
    }, err => console.log(err));
  }



}
