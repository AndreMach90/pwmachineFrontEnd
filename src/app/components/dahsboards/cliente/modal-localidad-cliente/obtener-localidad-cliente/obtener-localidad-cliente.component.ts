import { Component, Inject, OnInit } from '@angular/core';
import { ModalClienteService } from '../services/modal-cliente.service';
import { ClienteComponent } from '../../cliente.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Environments } from 'src/app/components/environments/environments';

@Component({
  selector: 'app-obtener-localidad-cliente',
  templateUrl: './obtener-localidad-cliente.component.html',
  styleUrls: ['./obtener-localidad-cliente.component.scss']
})
export class ObtenerLocalidadClienteComponent implements OnInit {

  ngOnInit(): void {
      
  }

  constructor( public dialogRef: MatDialogRef<ClienteComponent>,
    private loc: ModalClienteService,
    @Inject(MAT_DIALOG_DATA) public data: any, private env: Environments ) {}

  

}
