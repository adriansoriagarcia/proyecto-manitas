import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
//import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  constructor(private router:Router,private callNumber:CallNumber) { }

  llamada(){
    this.callNumber.callNumber('3521234567', true)
    .then(() => console.log('Llamada exitosa!'))
    .catch(() => console.log('Error al intentar llamar'));
 
}

  pasarPrimeraPantalla () {
    this.router.navigate(['home'])
  }

  llamar(){
    this.callNumber.callNumber("18001010101", true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));

  }
  

  ngOnInit() {
    
  }

}
