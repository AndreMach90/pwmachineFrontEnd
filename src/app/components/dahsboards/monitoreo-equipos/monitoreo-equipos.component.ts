import { Component, OnInit } from '@angular/core';
import { Environments } from '../../environments/environments';
import { TiendaService } from '../tienda/services/tienda.service';

import Swal from 'sweetalert2'
import { EquipoService } from '../equipo/services/equipo.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalTransaccionesComponent } from './modal/modal-transacciones/modal-transacciones.component';
import { MonitoreoService } from './services/monitoreo.service';
import { waitForDebugger } from 'inspector';
import { ModalDetalleMaquinaTranComponent } from './modal-detalle-maquina-tran/modal-detalle-maquina-tran.component';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';



const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
})

@Component({
  selector: 'app-monitoreo-equipos',
  templateUrl: './monitoreo-equipos.component.html',
  styleUrls: ['./monitoreo-equipos.component.scss']
})
export class MonitoreoEquiposComponent implements OnInit {



  tiendalista: any = [];
  tiendaListaGhost:any = [];
  shop:any = this.env.apiUrlIcon()+'shop.png';
  delete:any = this.env.apiUrlIcon()+'delete.png';
  edit:any = this.env.apiUrlIcon()+'edit.png';
  crear:any = this.env.apiUrlIcon()+'accept.png';
  cancel:any = this.env.apiUrlIcon()+'cancel.png';
  _show_spinner: boolean = false;
  _edit_btn:                    boolean = false;
  _delete_show:                 boolean = true;
  _edit_show:                   boolean = true;
  _create_show:                 boolean = true;
  _form_create:                 boolean = true;
  _show_rol: boolean = false;
  _detalle_a: boolean = true;
  _detalle_b: boolean = true;
  private urlHub: any = this.env.apiUrlHub();
  
  // private connectionSendPingEquipo: HubConnection;
  constructor(  private env: Environments,  public dialog: MatDialog,
                private tiendaservs: TiendaService,
                private equiposerv: EquipoService,
                private monitoreo: MonitoreoService ) { 

                // this.connectionSendPingEquipo = new HubConnectionBuilder()
                //   .withUrl(this.urlHub+'PingHubEquipos')
                //   .build();
                // this.connectionSendPingEquipo.on("SendPingEquipo", message => {
                //   // ////////////// console.warn(message)  
                //   // this.PingHub(message)
                // });

                }


  ngOnInit(): void {
    this.obtenerTiendas();
    ////////////// console.warn(this.urlHub)
  //   this.connectionSendPingEquipo.start().then( ()=> {
  //     ////////////// console.warn('Conexion fue establecida con el canal de ping del equipo');
  //   }).catch( e => {
  //     //// console.error('ALGO HA PASADO');
  //     //// console.error(e);
  //   })
  // }
  }

  obtenerTiendas() {
    this.tiendaservs.obtenerTiendas().subscribe({
      next: (tienda) => {
        this.tiendaListaGhost = tienda;
        this.tiendalista = tienda;
        // ////////////// console.warn('TIENDA');
        ////////////// console.warn(this.tiendalista);
      }
    })
  }

  tiendaSeleccionada: string | null = null;


seleccionarTienda(codigoTienda: string) {
  this.tiendaSeleccionada = codigoTienda;
}

  listaEsquipo:any = [];
  listaEsquipoGhost:any = [];
  count: number = 1;


  private intervalId: any;
  porcentaje:number = 0;
  countPorcentajealert: number = 1;
  countPorcentajealertAs: number = 1;
  calcularPorcentaje( capacidadBilletes:number, capacidadMaximoBilletes:number ) {
    this.porcentaje = ( capacidadBilletes / capacidadMaximoBilletes ) * 100;

    if ( this.porcentaje <= 30 ) {

      this.colorBarProgressBilletes = 'progress-bar bg-sucess text-light';
    } else if ( this.porcentaje > 30 && this.porcentaje <= 49 ) {
      // //alertthis.porcentaje)
      this.colorBarProgressBilletes = 'progress-bar bg-success text-light';
      ////////////// console.warn(this.colorBarProgressBilletes)
    } else if ( this.porcentaje > 49 && this.porcentaje <= 90 ) {
      // //alertthis.porcentaje)
      this.colorBarProgressBilletes = 'progress-bar bg-warning text-dark';
      ////////////// console.warn(this.colorBarProgressBilletes)
    } else if ( this.porcentaje > 90 ) {
      // //alertthis.porcentaje)
      this.colorBarProgressBilletes = 'progress-bar bg-danger text-light';
      ////////////// console.warn(this.colorBarProgressBilletes);
      
      if( this.countPorcentajealert == 1) {
        this.countPorcentajealert = this.countPorcentajealert - 1;
        // Toast.fire({
        //   icon: 'error',
        //   title: 'Haz llegando al límite de la capacidad del equipo. '
        // })

        Swal.fire(
          'Advertencia:',
          'Haz llegando al límite de la capacidad del equipo.',
          'error'
        )

      } else if ( this.countPorcentajealert == 0 ) {
        this.countPorcentajealert = 0
      }

    }

  }

  porcentajeAs:number = 0;
  calcularPorcentajeAs( capacidadBilletes:number, capacidadMaximoBilletes:number ) {

    this.porcentajeAs = ( capacidadBilletes / capacidadMaximoBilletes ) * 100;
    if ( this.porcentajeAs <= 30 ) {
      // //alertthis.porcentajeAs)
      this.colorBarProgressBilletesAs = 'progress-bar bg-success text-light';
      ////////////// console.warn(this.colorBarProgressBilletesAs)
    } else if ( this.porcentajeAs > 30 && this.porcentajeAs <= 49 ) {
      // //alertthis.porcentajeAs)
      this.colorBarProgressBilletesAs = 'progress-bar bg-success text-light';
      ////////////// console.warn(this.colorBarProgressBilletesAs)
    } else if ( this.porcentajeAs > 49 && this.porcentajeAs <= 90 ) {
      // //alertthis.porcentajeAs)
      this.colorBarProgressBilletesAs = 'progress-bar bg-warning text-dark';
      ////////////// console.warn(this.colorBarProgressBilletesAs)
    } else if ( this.porcentajeAs > 90 ) {
      // //alertthis.porcentaje)
      this.colorBarProgressBilletesAs = 'progress-bar bg-danger text-light';
      ////////////// console.warn(this.colorBarProgressBilletesAs)
      
      if( this.countPorcentajealertAs == 1) {
        this.countPorcentajealertAs = this.countPorcentajealertAs - 1;
        // Toast.fire({
        //   icon: 'error',
        //   title: ' '
        // })

        Swal.fire(
          'Advertencia:',
          'Haz llegando al límite de la capacidad asegurada del equipo.',
          'error'
        )

      } else if ( this.countPorcentajealert == 0 ) {
        this.countPorcentajealert = 0
      }
    }

  }

  filterequip:any;
  filterEquipos() {
    this.listaEsquipo = this.listaEsquipoGhost.filter((item:any) =>
      item.nombreTienda.toLowerCase().includes(this.filterequip.toLowerCase())   ||
      item.nombremarca.toLowerCase().includes(this.filterequip.toLowerCase())    ||
      item.nombremodelo.toLowerCase().includes(this.filterequip.toLowerCase())   ||
      item.serieEquipo.toLowerCase().includes(this.filterequip.toLowerCase())    ||
      item.tipoMaquinaria.toLowerCase().includes(this.filterequip.toLowerCase())
    )
  }

  listaIndicadores:any = [];
  colorBarProgressBilletes:   string = 'progress-bar bg-success text-light';
  colorBarProgressBilletesAs: string = 'progress-bar bg-success text-light';
  textoCapacidadBilletes: string = 'Vacío...';
  obtenerIndicadores(ctienda:string) {
    this._show_spinner = true;
    this.listaEsquipo = [];
    this.listaEsquipoGhost = [];
      this.monitoreo.obtenerIndicadores(ctienda, 1).subscribe({
      next: (equipo) => {
        this.listaEsquipo = equipo;
        this.listaEsquipoGhost = equipo;
        this._show_spinner = false;
      }, error: (e) => {
        // console.error(e);
        this._show_spinner = false;
      }, complete: () => {
        this.listaEsquipo.filter((element:any) => {
          this.calcularPorcentaje( element.capacidadBilletes, element.capacidadMaximaBilletes );
          this.calcularPorcentajeAs( element.totalAsegurado, element.totalMaxAsegurado );
          if ( element.marca == 1 || element.modelo == 1 ) {
            element.imagen = 'http://192.168.100.12:5208/equipos/KD-20.png';
          }
          if ( element.totalAsegurado == null || element.totalAsegurado == undefined ) element.totalAsegurado = 0;
        })
      }
    })
  }



  openDialogTransacciones(data:any): void {


    const dialogRef = this.dialog.open( ModalTransaccionesComponent, {
      height: 'auto',
      width:  '96%',
      data: data,
    });


    dialogRef.afterClosed().subscribe( result => {

      // ////////////// console.warn( result );
      // this.obtenerCrono(result.anio, result.mes);

    });
  }

  openDialogMaquinasTransacciones(data:any): void {

    const dialogRef = this.dialog.open( ModalDetalleMaquinaTranComponent, {
      height: '90vh',
      width:  '96%',
      data: data,
    });


    dialogRef.afterClosed().subscribe( result => {

      // ////////////// console.warn( result );
      // this.obtenerCrono(result.anio, result.mes);

    });


  }

  modelError: any = [];
  guardarErroralerts(nombre:string, description:string) {

    let xuser: any = sessionStorage.getItem('usuario');
    this.modelError = {
      nombre: nombre,
      descripcion: description,
      fecrea: new Date(),
      codusercrea: xuser,
      active: 'A'
      
    }

    this.monitoreo.guardarErroralerts(this.modelError).subscribe({
      next: (x) => {
        ////////////// console.warn('alerta de erro gurdada con éxito')
      }, error: (e) => {
        //// console.error(e);
      }
    })

  }



}
