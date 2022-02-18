import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';

//import {Map, tileLayer} from 'leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  map: L.Map;
  constructor(private router:Router,private callNumber:CallNumber) { }

  llamada(){
    this.callNumber.callNumber('3521234567', true)
    .then(() => console.log('Llamada exitosa!'))
    .catch(() => console.log('Error al intentar llamar'));
 
}

  pasarPrimeraPantalla () {
    this.router.navigate(['home'])
  }

  ionViewDidEnter(){
    this.loadMap();
  }

  loadMap() {
    let latitud = 36.922349;
    let longitud = -5.541855;
    let zoom = 17;
    this.map = L.map("mapId").setView([latitud, longitud], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(this.map);
    L.marker([ 36.922349,-5.541855],{draggable: true}).addTo(this.map);
  }
  

  ngOnInit() {
    
  }

}
