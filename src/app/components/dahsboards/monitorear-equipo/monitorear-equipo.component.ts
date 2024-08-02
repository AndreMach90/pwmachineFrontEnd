import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClientesService } from '../cliente/services/clientes.service';
import { MonitoreoIndividualService } from './services/monitoreo-individual.service';
import { MonitoreoService } from '../monitoreo-equipos/services/monitoreo.service';
import { Environments } from '../../environments/environments';
import { TransaccionesTiendaService } from '../monitoreo-equipos/modal/services/transacciones-tienda.service';

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

  listaTransacciones: any = [];
  listaTransaccionesGhost: any = [];
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

  dias_estimados:     string = '';
  dis_execel_export:  boolean = true;
  disButton:          boolean = true;

  nserie: any = '';
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
  
  diasEncontrar:            number  = 31;
  listaTrsansaccionesTablaGhost: any = [];
  listaTrsansaccionesTabla: any = [];
  sumatoriaNoRecollect: number = 0;

  public filterTransaccForm = new FormGroup({
    filterTransacc: new FormControl('')
  })

  public filterDateForm = new FormGroup({
    startDate: new FormControl(),
    endDate:   new FormControl()
  })

  public tiendaForm = new FormGroup({
    codigoClienteidFk: new FormControl(''),
    codigoEquipo: new FormControl(''),
    filterEquipo: new FormControl('')
  });

  ngOnInit(): void {
    this.obtenerCliente()    
  }

  constructor( private transacciones: TransaccionesTiendaService, 
               private env: Environments, 
               private clienteserv: ClientesService,
               private mequipo: MonitoreoIndividualService,
               private monitoreo:  MonitoreoService ) {}


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
    this.listaEquipo = this.listaEquipoGhost.filter( (item:any) =>
      item.serieEquipo.toLowerCase().includes(filter.toLowerCase()) ||
      item.nombreTienda.toLowerCase().includes(filter.toLowerCase())
    );    
  }

  /** Filtro de transacciones tanto para la gráfica como para la tabla de transacciones */
  filterTransaccos() {
    let filtertTrans: any = this.filterTransaccForm.controls['filterTransacc'].value;
    this.listaTrsansaccionesTabla = this.listaTrsansaccionesTablaGhost.filter((item:any) =>
      item.transaccion_No       .toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.acreditada           .toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.establecimiento      .toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.nombreCliente        .toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.nombreTienda         .toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.numerocuenta         .toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.observacion          .toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.tipoCuenta           .toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.tipoTransaccion      .toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.nombanco             .toString().toLowerCase().includes(filtertTrans.toLowerCase()) 
    )
    // this.sumatoriaTotal();
  }

  // #region [VARIABLES PARA EL CUEADRO DE VALORES]
  public machineSn: number = 0;
  public ipEquipo: number = 0;
  public depositoCant100: number = 0;
  public depositoCant50: number = 0;
  public depositoCant20: number = 0;
  public depositoCant10: number = 0;
  public depositoCant5: number = 0;
  public depositoCant2: number = 0;
  public depositoCant1: number = 0;
  public depositoMont100: number = 0;
  public depositoMont50: number = 0;
  public depositoMont20: number = 0;
  public depositoMont10: number = 0;
  public depositoMont5: number = 0;
  public depositoMont2: number = 0;
  public depositoMont1: number = 0;
  public manualCant100: number = 0;
  public manualCant50: number = 0;
  public manualCant20: number = 0;
  public manualCant10: number = 0;
  public manualCant5: number = 0;
  public manualCant2: number = 0;
  public manualCant1: number = 0;
  public manualMont100: number = 0;
  public manualMont50: number = 0;
  public manualMont20: number = 0;
  public manualMont10: number = 0;
  public manualMont5: number = 0;
  public manualMont2: number = 0;
  public manualMont1: number = 0;
  public manualCantCoin100: number = 0;
  public manualCantCoin50: number = 0;
  public manualCantCoin25: number = 0;
  public manualCantCoin10: number = 0;
  public manualCantCoin5: number = 0;
  public manualCantCoin1: number = 0;
  public manualMontCoin100: number = 0;
  public manualMontCoin50: number = 0;
  public manualMontCoin25: number = 0;
  public manualMontCoin10: number = 0;
  public manualMontCoin5: number = 0;
  public manualMontCoin1: number = 0;
  public totalDepositoCant: number = 0;
  public totalDepositoMont: number = 0;
  public totalManualBillCant: number = 0;
  public totalManualBillMont: number = 0;
  public totalManualCoinCant: number = 0;
  public totalManualCoinMont: number = 0;
  // #endregion

  // #region [ASIGNACION A VARIABLES PARA EL CUEADRO DE VALORES]
  asignacionDeDatosTablaCuadre(model: any[]) {
    if ( model[0].status != 0 ) {
      model.forEach((x: any) => {
        this.machineSn           = x.machineSn           || 0;
        this.ipEquipo            = x.ipEquipo            || 0;
        this.depositoCant100     = x.depositoCant100     || 0;
        this.depositoCant50      = x.depositoCant50      || 0;
        this.depositoCant20      = x.depositoCant20      || 0;
        this.depositoCant10      = x.depositoCant10      || 0;
        this.depositoCant5       = x.depositoCant5       || 0;
        this.depositoCant2       = x.depositoCant2       || 0;
        this.depositoCant1       = x.depositoCant1       || 0;
        this.depositoMont100     = x.depositoMont100     || 0;
        this.depositoMont50      = x.depositoMont50      || 0;
        this.depositoMont20      = x.depositoMont20      || 0;
        this.depositoMont10      = x.depositoMont10      || 0;
        this.depositoMont5       = x.depositoMont5       || 0;
        this.depositoMont2       = x.depositoMont2       || 0;
        this.depositoMont1       = x.depositoMont1       || 0;
        this.manualCant100       = x.manualCant100       || 0;
        this.manualCant50        = x.manualCant50        || 0;
        this.manualCant20        = x.manualCant20        || 0;
        this.manualCant10        = x.manualCant10        || 0;
        this.manualCant5         = x.manualCant5         || 0;
        this.manualCant2         = x.manualCant2         || 0;
        this.manualCant1         = x.manualCant1         || 0;
        this.manualMont100       = x.manualMont100       || 0;
        this.manualMont50        = x.manualMont50        || 0;
        this.manualMont20        = x.manualMont20        || 0;
        this.manualMont10        = x.manualMont10        || 0;
        this.manualMont5         = x.manualMont5         || 0;
        this.manualMont2         = x.manualMont2         || 0;
        this.manualMont1         = x.manualMont1         || 0;
        this.manualCantCoin100   = x.manualCantCoin100   || 0;
        this.manualCantCoin50    = x.manualCantCoin50    || 0;
        this.manualCantCoin25    = x.manualCantCoin25    || 0;
        this.manualCantCoin10    = x.manualCantCoin10    || 0;
        this.manualCantCoin5     = x.manualCantCoin5     || 0;
        this.manualCantCoin1     = x.manualCantCoin1     || 0;
        this.manualMontCoin100   = x.manualMontCoin100   || 0;
        this.manualMontCoin50    = x.manualMontCoin50    || 0;
        this.manualMontCoin25    = x.manualMontCoin25    || 0;
        this.manualMontCoin10    = x.manualMontCoin10    || 0;
        this.manualMontCoin5     = x.manualMontCoin5     || 0;
        this.manualMontCoin1     = x.manualMontCoin1     || 0;
        this.totalDepositoCant   = x.totalDepositoCant   || 0;
        this.totalDepositoMont   = x.totalDepositoMont   || 0;
        this.totalManualBillCant = x.totalManualBillCant || 0;
        this.totalManualBillMont = x.totalManualBillMont || 0;
        this.totalManualCoinCant = x.totalManualCoinCant || 0;
        this.totalManualCoinMont = x.totalManualCoinMont || 0;
      }); 
    }
  }
  // #endregion
  
  obtenerDetalleEquipos( data:any ) {
    this._show_spinner = true;
    this.nserie = data.serieEquipo;
    localStorage.setItem('equipoMonitoreando', this.nserie);
    this.showCuadre = true;
    this.colorValidateCuadre = 'steelblue';
    this.monitoreo.obtenerDetalleEquipos(this.nserie).subscribe({
      next:(x) => {
        this.primaryLista = x;
        this._show_spinner = false;
      }, error: (e) => {
         console.error(e);
         this._show_spinner = false;
      }, complete: () => {     
        this.obtenerTransacTabla(this.nserie);
        this.asignacionDeDatosTablaCuadre(this.primaryLista);
      }
    })
  }

  validarRangoDeFechas() {
    let startDate: any = this.filterDateForm.controls['startDate'].value;
    let endDate: any = this.filterDateForm.controls['endDate'].value;
    const fechaInicio = new Date(startDate);
    const fechaFin = new Date(endDate);
    if (fechaFin < fechaInicio) {
      this.dias_estimados = 'La fecha final no puede ser menor a la fecha inicial';
      this.disButton = true;
      setInterval( ()=>this.dias_estimados='', 2000 );
    } else {
      const diferenciaEnDias = Math.abs( (fechaFin.getTime() - fechaInicio.getTime() ) / (1000 * 60 * 60 * 24));
      if ( diferenciaEnDias > this.diasEncontrar ) {
        this.dias_estimados = 'El rango de fechas no puede ser mayor a un mes';
        this.disButton = true;
      } else {
        this.dias_estimados = `Diferencia: ${diferenciaEnDias} días`;
        this.disButton = false;
      }
    }
  }

  filterByDateRange() {
    console.log('Filtrando por fecha')
    this._show_spinner = true;
    const fechaFin = new Date(this.filterDateForm.controls['endDate'].value);
    fechaFin.setDate(fechaFin.getDate() + 1);
    let modelRange:any = {
      "tipo":        "1",
      "Machine_Sn":  this.nserie,
      "FechaInicio": this.filterDateForm.controls['startDate'].value,
      "FechaFin":    fechaFin
    }
    console.log('modelando de datos enviado')
    console.log(modelRange)
    this.transacciones.filtroTransaccionesRango(modelRange).subscribe({
      next: (x) => {
        this.listaTransacciones = x;
        this.listaTrsansaccionesTabla = x;
        // console.warn('this.listaTrsansaccionesTabla');
        // console.warn(this.listaTrsansaccionesTabla);
        this.listaTrsansaccionesTablaGhost = x;
      }, error: (e) => { console.error(e); }
      , complete: () => { this._show_spinner = false; }
    })
    // this.sumatoriaTotal();
  }

  transaccionesDataTabla: any = [];
  recibirTransaccionesTabla(transacciones: any) {
    this.transaccionesDataTabla = transacciones;
    console.warn('Estas son las transacciones enviadas a la tabla');
    console.warn(this.transaccionesDataTabla);
    this.arrtransacproblemas = [];
    this.transaccionesDataTabla.filter((element:any)=>{
      if( element.repetido > 1 ) {
        this.error = true;
        element.colorRepetido = '#F7C1C1 !important';
        this.arrtransacproblemas.push(element.transaccion_No);
      }
    })
  }

    /** Obtiene la data de las Transacciones para la Tabla transaccional */
    obtenerTransacTabla(id:any) {
      this.listaTrsansaccionesTablaGhost= [];
      this.listaTrsansaccionesTabla = [];
      this.transacciones.obtenerTransaccionesTienda(id, 2).subscribe({
          next: (transactab:any) => {
            this.listaTrsansaccionesTablaGhost = transactab;
          },
          error: (e) => { console.error(e); },
          complete: () => {
            this.sumatoriaNoRecollect = 0;
            this.listaTrsansaccionesTablaGhost.filter((element:any) => {
              let xdate = element.fechaTransaccion.toString().split('T');
              element.hora = xdate[1].slice(0,8);
              if( element.fechaRecoleccion == null && element.tipoTransaccion !== 'Recolección' ) {
                this.sumatoriaNoRecollect += element.total;
              }
              if( element.acreditada == 'A' ) element.colorRow = '#D8F1EC';
              if( element.acreditada == 'E' ) element.colorRow = '#F1F090';
              if( element.acreditada == 'N' ) element.colorRow = '#F1E3D8';
              if( element.acreditada == 'R' ) element.colorRow = '#F1C590';
              this.listaTrsansaccionesTabla.push(element);
            })
            // this.monitoreoServs.obtenerValorUnico(id).subscribe( (x:any) => {
            //   if ( x[0].total == null || x[0].total == undefined ) localStorage.setItem('valor_validador', (0).toString());
            //     localStorage.setItem('valor_validador', x[0].total.toFixed(2).toString());
            //   }
            // );
            // this.sumatoriaTotal();
          }
        }
      );
    }



}
