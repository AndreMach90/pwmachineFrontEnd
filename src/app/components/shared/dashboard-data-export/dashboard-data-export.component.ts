import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-data-export',
  templateUrl: './dashboard-data-export.component.html',
  styleUrls: ['./dashboard-data-export.component.scss']
})
export class DashboardDataExportComponent implements OnInit {

  modulo:string = '';
  hAcred: boolean = false;
  expDatos: boolean = true;

  constructor() {}

  ngOnInit(): void { }

  recibirModulos(event:any) {
    this.modulo = event;
    switch( this.modulo ) {
      case 'Historial de Acreditación':
        this.hAcred   = true;
        this.expDatos = false;
        break;
      case 'Exportar datos':
        this.hAcred   = false;
        this.expDatos = true;
        break;
    }
  }

  recibirCambios(event:any) {
    if ( event ) {
      this.expDatos = false;
      this.hAcred   = true;
    }
  }

}
