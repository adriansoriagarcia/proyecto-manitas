import { Component, ViewChild  } from '@angular/core';
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

  usuario: String = "";//variable para almacenar el usuario.
  userEmail: String = "";//variable para almacenar el email del usuario.
  userUID: String = "";//variable para almacenar el uid del usuario.
  isLogged: boolean;//variable que indica si esta logueado o no.

  reparacionEditando: Reparacion; 
  filtro: string = '';//variable utilizada en el filtro de busqueda.
  
  arrayColeccionReparaciones: any = [{
    id: "",
    data: {} as Reparacion
   }];

   
   //método que obtiene las reparaciones de la base de datos
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
  //método que redirecciona a la página detalle.
  pasarSegudaPantalla () {
    this.router.navigate(['detalle/:id'])
  }

  //método que selecciona la reparacion y te redirecciona a detalle con la información correspondiente.
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
  //método encargado del inicio de sesión del usuario.
  ionViewDidEnter() {
    this.isLogged = false;
    this.afAuth.user.subscribe(user => {
      if(user){
        this.userEmail = user.email;
        var email_analizado = /^([^]+)@(\w+).(\w+)$/.exec(user.email);
        this.usuario=email_analizado[1];
        console.log(this.usuario)
        this.userUID = user.uid;
        this.isLogged = true;
      } else {
        this.router.navigate(["/home"]);
      }
    })
  }
  //método que redirecciona a la página de login
  login() {
    this.router.navigate(["/login"]);
  }
  //método que cierra sesion del usuario.
  logout(){
    this.authService.doLogout()
    .then(res => {
      this.userEmail = "";
      this.userUID = "";
      this.usuario="";
      this.isLogged = false;
      console.log(this.userEmail);
    }, err => console.log(err));
  }



}
