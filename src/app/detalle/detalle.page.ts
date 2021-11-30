import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  id:string="";

  constructor(private activedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.activedRoute.snapshot.paramMap.get('id')
  }

}
