import { Component, Inject, OnInit } from '@angular/core';
import { ServicesSharedService } from '../services-shared/services-shared.service';
import { Environments } from '../../environments/environments';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MonitorearEquipoComponent } from '../../dahsboards/monitorear-equipo/monitorear-equipo.component';

@Component({
  selector: 'app-modal-ayuda',
  templateUrl: './modal-ayuda.component.html',
  styleUrls: ['./modal-ayuda.component.scss']
})
export class ModalAyudaComponent implements OnInit {

  /** Lista explicativa de colores de procesos en la tabla */
  listaColores: any = [{
    'color': ''
  }]

  constructor(public dialogRef: MatDialogRef<MonitorearEquipoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private env: Environments,
    private sharedservs: ServicesSharedService) { }


  ngOnInit(): void {



  }

  htmlEmbeved: any;
  mostrarAyuda(type: any) {
    const x: any = document.getElementById('box-interactive');
    if (type == 'color') {
      // x.innerHTML = '<div> Colores de la tabla y sus procesos: </div> <div class="" >';
    }

  }


}
