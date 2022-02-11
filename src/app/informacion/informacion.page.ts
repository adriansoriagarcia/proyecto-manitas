import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  constructor(private router:Router) { }

  pasarPrimeraPantalla () {
    this.router.navigate(['home'])
  }

  ngOnInit() {
  }

}