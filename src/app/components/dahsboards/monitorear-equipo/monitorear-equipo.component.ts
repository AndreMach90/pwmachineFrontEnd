import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClientesService } from '../cliente/services/clientes.service';
import { MonitoreoIndividualService } from './services/monitoreo-individual.service';
import { MonitoreoService } from '../monitoreo-equipos/services/monitoreo.service';
import { Environments } from '../../environments/environments';

@Component({
  selector: 'app-monitorear-equipo',
  templateUrl: './monitorear-equipo.component.html',
  styleUrls: ['./monitorear-equipo.component.scss']
})
export class MonitorearEquipoComponent implements OnInit {

  @Output() listaTransaccionesEmitGrafica:  EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() listaTransaccionesEmitTabla:    EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() typeFilter:                     EventEmitter<any>   = new EventEmitter<any>();
  @Output() modBusqueda:                    EventEmitter<any>   = new EventEmitter<any>();
  @Input() listenNserie!:                   any;

  show_trans: boolean = false;
  trans_detail: boolean = false;
  _show_spinner: boolean = false;
  clientelista: any = [];
  clienteListaGhost: any = [];
  listaEquipo: any = [];
  listaEquipoGhost: any = [];
  showEquipos: boolean = false;
  height_box: string = '82vh';
  height: string ='86.5vh';  
  min_box_A: boolean = true;
  width_box: any = '50%'
  delete: any = this.env.apiUrlIcon()+'delete.png';
  edit:   any = this.env.apiUrlIcon()+'edit.png';
  crear:  any = this.env.apiUrlIcon()+'accept.png';
  cancel: any = this.env.apiUrlIcon()+'cancel.png';
  search: any = this.env.apiUrlIcon()+'search.png';
  bill:   any = this.env.apiUrlIcon()+'dollar.png';
  coin:   any = this.env.apiUrlIcon()+'monedas.png';

  public tiendaForm = new FormGroup({
    codigoClienteidFk: new FormControl(''),
    codigoEquipo: new FormControl(''),
    filterEquipo: new FormControl('')
  });

  ngOnInit(): void {
    this.obtenerCliente()    
  }

  constructor( private env: Environments, private clienteserv: ClientesService, private mequipo: MonitoreoIndividualService, private monitoreo:  MonitoreoService ) {}


  obtenerEquipos() {

    let cli = this.tiendaForm.controls['codigoClienteidFk'].value;

    if (cli) {
      this.mequipo.obtenerEquiposCliente(cli).subscribe({
        next: (x:any) => {
          this.listaEquipo      = x;
          this.listaEquipoGhost = x;
          console.warn(this.listaEquipo);
        }, error: (e) => {
          console.error(e);
        }, complete: () => {
          this.showEquipos = true;
        }
      })
    }

  }

  obtenerCliente() {
    this.clientelista = [];
    this._show_spinner = true;

    this.clienteserv.ObtenerClienteSelect().subscribe({
      next: (cliente) => {
        this.clienteListaGhost = cliente;
        this._show_spinner = false;
      },
      error: (e) => {
        this._show_spinner = false;
        console.error(e);
      },
      complete: () => {
        this.clienteListaGhost.filter((element: any) => {
          let arr: any = {
            id: element.id,
            codigoCliente: element.codigoCliente,
            nombreCliente: element.nombreCliente,
            ruc: element.ruc,
            direccion: element.direccion,
            telefcontacto: element.telefcontacto,
            emailcontacto: element.emailcontacto,
            nombrecontacto: element.nombrecontacto,
          };
          this.clientelista.unshift(arr);
        });
      },
    });
  }

  filterEquipos () {

    let filter: any = this.tiendaForm.controls['filterEquipo'].value;

    console.warn(filter)

    this.listaEquipo = this.listaEquipoGhost.filter( (item:any) =>
      item.serieEquipo.toLowerCase().includes(filter.toLowerCase()) ||
      item.nombreTienda.toLowerCase().includes(filter.toLowerCase())
    );
    
  }

  listaDetalleequipoManual: any = [];
  listaDetalleequipoTransa: any = [];
  nserie: any;
  showCuadre: boolean = false;
  colorValidateCuadre: any;
  primaryLista: any = [];
  totalBilletesCantidadM: number = 0;
  totalBilletesMontoM: number = 0;
  totalMonedasCantidadM: number = 0;
  totalMonedasMontoM: number = 0;
  totalBilletesCantidadT: number = 0;
  totalBilletesMontoT: number = 0;
  totalMonedasCantidadT: number = 0;
  totalMonedasMontoT: number = 0;
  arrtransacproblemas: any = [];
  xloader: boolean = false;
  error: boolean = false;
  obtenerDetalleEquipos( data:any ) {
    console.log('<<<<<<<<data>>>>>>>>')
    console.log(data)
    this._show_spinner = true;
    this.nserie = data.serieEquipo;
    localStorage.setItem('equipoMonitoreando', this.nserie);
    this.listaDetalleequipoManual = [];
    this.listaDetalleequipoTransa = [];
    this.showCuadre = true;
    this.colorValidateCuadre = 'steelblue';
    this.monitoreo.obtenerDetalleEquipos(this.nserie).subscribe(
      {
      next:(x) => {
        this.primaryLista = x;
        console.warn('ESTO PASA EN MONITOREAR')
        console.warn(this.primaryLista)
        if ( this.nserie == this.primaryLista[0].machine_Sn ) 
        { 
          this.primaryLista.filter((element:any) => {
            if(element.tipo == 'Manual') {
              this.listaDetalleequipoManual.push(element);
            }
            else if ( element.tipo == 'Deposito' ) {
              this.listaDetalleequipoTransa.push(element);
            }
          })
        }
        this._show_spinner = false;
      }, error: (e) => {
         console.error(e);
         this._show_spinner = false;
      }, complete: () => {
        // Inicializar las variables
        this.totalBilletesCantidadM = 0;
        this.totalBilletesMontoM    = 0;
        this.totalMonedasCantidadM  = 0;
        this.totalMonedasMontoM     = 0;

        this.totalBilletesCantidadT = 0;
        this.totalBilletesMontoT    = 0;
        this.totalMonedasCantidadT  = 0;
        this.totalMonedasMontoT     = 0;

        // Recorrer la lista y realizar las sumatorias
        this.listaDetalleequipoManual.forEach((detalle:any) => {
            if( detalle.tipo == 'Manual') {
              this.totalBilletesCantidadM += detalle.depositoCant100 + detalle.depositoCant50 + detalle.depositoCant20 +
                                             detalle.depositoCant10  + detalle.depositoCant5  + detalle.depositoCant2  + detalle.depositoCant1;
              this.totalBilletesMontoM    += detalle.depositoMont100 + detalle.depositoMont50 + detalle.depositoMont20 +
                                             detalle.depositoMont10  + detalle.depositoMont5  + detalle.depositoMont2  + detalle.depositoMont1;
              this.totalMonedasCantidadM  += detalle.depositoCantCoin100 + detalle.depositoCantCoin50 + detalle.depositoCantCoin25 +
                                             detalle.depositoCantCoin10  + detalle.depositoCantCoin5  + detalle.depositoCantCoin1;
              this.totalMonedasMontoM     += detalle.depositoMontCoin100 + detalle.depositoMontCoin50 + detalle.depositoMontCoin25 +
                                             detalle.depositoMontCoin10  + detalle.depositoMontCoin5  + detalle.depositoMontCoin1;
            }
        });

        this.listaDetalleequipoTransa.forEach((detalle:any) => {
          if ( detalle.tipo == 'Deposito' ) {
            this.totalBilletesCantidadT += detalle.depositoCant100 + detalle.depositoCant50 + detalle.depositoCant20 +
                                           detalle.depositoCant10  + detalle.depositoCant5  + detalle.depositoCant2  + detalle.depositoCant1;  
            this.totalBilletesMontoT    += detalle.depositoMont100 + detalle.depositoMont50 + detalle.depositoMont20 +
                                           detalle.depositoMont10  + detalle.depositoMont5  + detalle.depositoMont2  + 
                                           detalle.depositoMont1;  
            this.totalMonedasCantidadT  += detalle.depositoCantCoin100 + detalle.depositoCantCoin50 + detalle.depositoCantCoin25 +
                                           detalle.depositoCantCoin10  + detalle.depositoCantCoin5  + detalle.depositoCantCoin1;  
            this.totalMonedasMontoT     += detalle.depositoMontCoin100 + detalle.depositoMontCoin50 + detalle.depositoMontCoin25 +
                                           detalle.depositoMontCoin10  + detalle.depositoMontCoin5  + detalle.depositoMontCoin1;
          }
        }
      )
      this._show_spinner = false;
      }
    })
  }

  transaccionesDataGrafica: any = [];
  arr:any = [];
  recibirTransaccionesGrafica(transaccionesGrafica: any) {
    this.transaccionesDataGrafica = transaccionesGrafica;
  }

  transaccionesDataTabla: any = [];
  recibirTransaccionesTabla(transacciones: any) {
    this.transaccionesDataTabla = transacciones;
    this.arrtransacproblemas = [];
    this.transaccionesDataTabla.filter((element:any)=>{
      if( element.repetido > 1 ) {
        this.error = true;
        element.colorRepetido = '#F7C1C1 !important';
        this.arrtransacproblemas.push(element.transaccion_No);
      }
    })
  }

  tipoFiltro:any;
  recibirTipoFiltro(tipo: any) {
    this.tipoFiltro = tipo;
  }

  typeFilterTrasact: boolean = false;
  recibirTypeFilterDates(event:any) {
    this.typeFilterTrasact = event;
  }

}
