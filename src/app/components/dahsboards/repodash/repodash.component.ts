import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Environments } from '../../environments/environments';
import { MatDialog } from '@angular/material/dialog';
import { EquipoService } from '../equipo/services/equipo.service';
import { MonitoreoService } from '../monitoreo-equipos/services/monitoreo.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import Swal from 'sweetalert2'
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '../../shared/services/shared.service';
import { Router } from '@angular/router';
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

@Component({
  selector: 'app-repodash',
  templateUrl: './repodash.component.html',
  styleUrls: ['./repodash.component.scss']
})

export class RepodashComponent implements OnInit, AfterViewInit, OnChanges {

  @Output() estadointerfaz: EventEmitter<any> = new EventEmitter();
  
  nuevoObjectAlerts: any[] = [];
  EmitAutoTransHub: any = [];
  EmitAutomaticPiezasCantidadTransactionHub:any;
  // Cantidad de la transaccion en monedas INICO
  manualDepositoCoin1:          number = 0;
  manualDepositoCoin5:          number = 0;
  manualDepositoCoin10:         number = 0;
  manualDepositoCoin25:         number = 0;
  manualDepositoCoin50:         number = 0;
  manualDepositoCoin100:        number = 0;
  
  // Cantidad de la transaccion en monedas FIN
  sumatoriasTotalCoinHub:       number = 0;
  sumatoriasTotalManualHub:     number = 0;
  sumatoriasTotalMontoCoinHub:  number = 0;

  // Cantidad de la transaccion INICIO
  billete1:                     number = 0;
  billete2:                     number = 0;
  billete5:                     number = 0;
  billete10:                    number = 0;
  billete20:                    number = 0;
  billete50:                    number = 0;
  billete100:                   number = 0;
  sumatoriasTotalHub:           number = 0;
  
  // Cantidad de la transaccion FIN
  // Monto de dinero en la maquina INICIO
  montoBillete1:                number = 0;
  montoBillete2:                number = 0;
  montoBillete5:                number = 0;
  montoBillete10:               number = 0;
  montoBillete20:               number = 0;
  montoBillete50:               number = 0;
  montoBillete100:              number = 0;
  montoSumatoriasTotalHub:      number = 0;
  
  // Monto de dinero en la maquina FIN
  numeroTransa: any;
  machSerie:    any;
  EmitManualTransHub: any = [];
  EmitManualPiezasCantidadTransactionHub: any = [];
  /****************************/
  count: number = 0;
  colorBarProgressBilletesAs: string = "bg-primary text-light";
  listaEsquipoIndicadores: any = [];
  listaEsquipoGhostIndicadores: any = [];

  min_box_A: boolean = true;
  width_box: any = '50%'

  datosgen:any     = [];
  listAlertas: any = [];
  
  listaDetalleequipoManual: any = [];
  listaDetalleequipoTransa: any = [];

  totalBilletesCantidadM: number = 0;
  totalBilletesMontoM:    number = 0;
  totalMonedasCantidadM:  number = 0;
  totalMonedasMontoM:     number = 0;

  totalBilletesCantidadT: number = 0;
  totalBilletesMontoT:    number = 0;
  totalMonedasCantidadT:  number = 0;
  totalMonedasMontoT:     number = 0;

  @Input() estadow!: boolean;
  
  nserie:any;
  primaryLista:any =[];
  
  
  height_box: string = '82vh';
  height: string ='86.5vh';  
  
  _show_spinner:      boolean = false;
  maquinaCompleta:    boolean = false;
  porTienda:          boolean = false;
  datosSeleccionados: string  = '';

  delete: any = this.env.apiUrlIcon()+'delete.png';
  edit:   any = this.env.apiUrlIcon()+'edit.png';
  crear:  any = this.env.apiUrlIcon()+'accept.png';
  cancel: any = this.env.apiUrlIcon()+'cancel.png';
  search: any = this.env.apiUrlIcon()+'search.png';
  bill:   any = this.env.apiUrlIcon()+'dollar.png';
  coin:   any = this.env.apiUrlIcon()+'monedas.png';



  public filterequipForm = new FormGroup({
    filterequip:   new FormControl('')
  })
  
  constructor( private env:        Environments,
               private monitoreo:  MonitoreoService,
               public  dialog:     MatDialog,
               private equiposerv: EquipoService,
               private shar:       SharedService,
               private router:     Router
  ) {
  }

  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
    playAudio() {
    this.audioPlayer.nativeElement.play();
  }

  ngOnInit(): void {
    // this.obtenerEquipos(1,'void');
    // this.inicializadorHubs();
    this.obtenerIndicadoresHomeMenu();
  }

  
  estadointerfazEmit(tipo:string) {
    var x = tipo.trim();
    this.estadointerfaz.emit(x);
  }

  calculoPrimaryLista( objectArray:any, type:string ) {
    this.primaryLista = objectArray;    
    switch(type) {
    case 'T':
    this.primaryLista.filter((element:any) => {
      if(element.tipo == 'Manual') {
        if( this.nserie == element.machine_Sn ) {
          this.listaDetalleequipoManual = [];
          this.listaDetalleequipoManual.push(element);
        }
      }
      else if ( element.tipo == 'Deposito' ) {
        if( this.nserie == element.machine_Sn ) {
          this.listaDetalleequipoTransa = [];
          this.listaDetalleequipoTransa.push(element);
        }
      }
    })



    this.listaDetalleequipoManual.forEach((detalle:any) => {
      if( detalle.tipo == 'Manual') {
        if( this.nserie == detalle.machine_Sn ) {
          this.totalBilletesCantidadM = detalle.depositoCant100 + detalle.depositoCant50 + detalle.depositoCant20 +
          detalle.depositoCant10  + detalle.depositoCant5  + detalle.depositoCant2  + detalle.depositoCant1;
          this.totalBilletesMontoM    = detalle.depositoMont100 + detalle.depositoMont50 + detalle.depositoMont20 +
          detalle.depositoMont10  + detalle.depositoMont5  + detalle.depositoMont2  + detalle.depositoMont1;  
          this.totalMonedasCantidadM  = detalle.depositoCantCoin100 + detalle.depositoCantCoin50 + detalle.depositoCantCoin25 +
          detalle.depositoCantCoin10  + detalle.depositoCantCoin5  + detalle.depositoCantCoin1;  
          this.totalMonedasMontoM     = detalle.depositoMontCoin100 + detalle.depositoMontCoin50 + detalle.depositoMontCoin25 +
          detalle.depositoMontCoin10  + detalle.depositoMontCoin5  + detalle.depositoMontCoin1;           
        }
      }
    });

    this.listaDetalleequipoTransa.forEach((detalle:any) => {
      if ( detalle.tipo == 'Deposito' ) {
        if( this.nserie == detalle.machine_Sn ) {
          this.totalBilletesCantidadT = detalle.depositoCant100 + detalle.depositoCant50 + detalle.depositoCant20 +
          detalle.depositoCant10  + detalle.depositoCant5  + detalle.depositoCant2  + detalle.depositoCant1;  
          this.totalBilletesMontoT    = detalle.depositoMont100 + detalle.depositoMont50 + detalle.depositoMont20 +
          detalle.depositoMont10  + detalle.depositoMont5  + detalle.depositoMont2  + 
          detalle.depositoMont1;  
          this.totalMonedasCantidadT  = detalle.depositoCantCoin100 + detalle.depositoCantCoin50 + detalle.depositoCantCoin25 +
          detalle.depositoCantCoin10  + detalle.depositoCantCoin5  + detalle.depositoCantCoin1;  
          this.totalMonedasMontoT     = detalle.depositoMontCoin100 + detalle.depositoMontCoin50 + detalle.depositoMontCoin25 +
          detalle.depositoMontCoin10  + detalle.depositoMontCoin5  + detalle.depositoMontCoin1;
        }
      }
    });
    break;
    case 'R':
      break;
    }
  }



  listaHomeMenu: any = [];
  obtenerIndicadoresHomeMenu() {
    this.shar.getIndicadoresHome().subscribe({
      next: (x) => {
        console.log('BOTONES HOME');
        console.log(x);
        this.listaHomeMenu = x;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        const arr: any = [
          { 'tipo': 'Monitorear transaccional', 'icon': 'timeline', 'width': '480px !important' },
          { 'tipo': 'Monitoreo de equipos', 'icon': 'precision_manufacturing', 'width': '550px !important' },
          { 'tipo': 'Reporte de datos', 'icon': 'article', 'width': '450px !important' },
          { 'tipo': 'Cerrar Sesión', 'icon': 'power_settings_new', 'width': '350px !important' }
        ];

        const iconMap: any = {
          'clientes': 'face',
          'tiendas': 'storefront',
          'equipos': 'point_of_sale',
          'usuarios': 'supervised_user_circle'
        };

        this.listaHomeMenu.forEach((x: any) => {
          if (iconMap[x.tipo]) {
            x.icon = iconMap[x.tipo];
            x.width = '300px'
          }
        });

        this.listaHomeMenu = this.listaHomeMenu.concat(arr);
      }
    });
  }

  eliminarAlerta( i:number ) {
    this.listAlertas.splice(i, 1);
  }

  closeSession() {
    sessionStorage.removeItem('token');
    let xtoken: any = sessionStorage.getItem('token');
    if (xtoken == undefined || xtoken == null || xtoken == '') {
      this.router.navigate(['login']);
    }
  }


  ngAfterViewInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if(changes) {
      this.cambiarHeight();
    }
  }
  
  transaccionesDataGrafica: any = [];
  arr:any = [];
  recibirTransaccionesGrafica(transaccionesGrafica: any) {
    this.transaccionesDataGrafica = transaccionesGrafica;
  }

  transaccionesDataTabla: any = [];
  arrtransacproblemas: any = [];
  error: boolean = false;
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

  minimizebox() {
    switch( this.min_box_A ) {
      case true:
        this.width_box = '50%'
        break;
      case false:
        this.width_box = '100%'
        break;
    }
  }

  typeFilterTrasact: boolean = false;
  recibirTypeFilterDates(event:any) {
    this.typeFilterTrasact = event;
  }

  cambiarHeight() {
    switch( this.estadow ) {
      case true:
        this.height     = '86.5vh';
        this.height_box = '82vh';
        break;
      case false:
        this.height     = '96.5vh';
        this.height_box = '92vh';
        break;
    }
  }
  
  seleccion: string = 'maquinaCompleta';
  obtenerDatos() {
    this.datosSeleccionados = '';
    if (this.seleccion === 'maquinaCompleta') {
      this.datosSeleccionados = 'Máquina Completa';
    } else if (this.seleccion === 'porTienda') {
      this.datosSeleccionados = 'Por Tienda';
    }
  } 

  listaEsquipo:any = [];
  listaEsquipoGhost:any = [];
  obtenerEquipos( tp:number, ctienda:string ) {
    console.log('***********************');
    console.log(tp);
    console.log(ctienda);
    console.log('***********************');
    this.equiposerv.obtenerEquipo().subscribe(
      {
        next: (equipo) => {
          this.listaEsquipo = equipo;
          if(this.isActive){
            this.listaEsquipoGhost = equipo;
          }else{
            this.listaEsquipo = this.listaEsquipo.filter((element: any) => {
              return element.active === "A";
            });
            this.listaEsquipoGhost = this.listaEsquipo;
          }
        },
        error:    (e) => {
          Swal.fire({
            title: "Error #MT-005",
            text: "Este error suele ocurrir debido a que el servidor no esta respondiendo adecuadamente, entonces no puedrás visualizar los datos de los equipos.",
            icon: "error"
          });
        },
        complete: ()  => {
          this.listaEsquipoGhost.filter( (element:any) => {
              this.obtenerIndicadores(element.serieEquipo);
          })
        }
      }
    )
  }

  filterEquipos() {
    let filterequip: any = this.filterequipForm.controls['filterequip'].value;
    this.listaEsquipo = this.listaEsquipoGhost.filter((item:any) =>
    item.serieEquipo .toLowerCase().includes(filterequip.toLowerCase())
    )
  }

  obtenerIndicadores(nserie:string) {
    this._show_spinner                = true;
    this.listaEsquipoIndicadores      = [];
    this.listaEsquipoGhostIndicadores = [];
    this.monitoreo.obtenerIndicadores(nserie, 2).subscribe({
    next: (equipo) => {
      this.listaEsquipoIndicadores = equipo;
      this.listaEsquipoGhostIndicadores = equipo;
      this._show_spinner = false;
    }, error: (e) => {
      Swal.fire({
        title: "Error #MT-006",
        text: "Este error suele ocurrir debido a que el servidor no esta respondiendo adecuadamente, entonces no puedrás visualizar los datos indicadores a las transacciones del equipo " + nserie + " que ha decidido monitorear.",
        icon: "error"
      });
      console.error(e);
      this._show_spinner = false;
    }, complete: () => {
      this.listaEsquipoIndicadores.filter((element:any) => {
        if( element.totalAsegurado == null || element.totalAsegurado == undefined )                   element.totalAsegurado          = 0;
        if( element.capacidadPesos == null || element.capacidadPesos == undefined )                   element.capacidadPesos          = 0;
        if( element.capacidadBilletes == null || element.capacidadBilletes == undefined )             element.capacidadBilletes       = 0;
        if( element.capacidadMaximaBilletes == null || element.capacidadMaximaBilletes == undefined ) element.capacidadMaximaBilletes = 0;
        this.listaEsquipo.filter( (elementEq:any) => {
          if( element.ipEquipo == elementEq.ipEquipo ) {
            elementEq.indicadorCapacidadBilletes           = element.capacidadBilletes;
            elementEq.indicadorCapacidadBilletesMax        = element.capacidadMaximaBilletes;
            elementEq.indicadorTotalAsegurado              = element.totalAsegurado;
            elementEq.indicadorTotalMaxAsegurado           = element.totalMaxAsegurado;
            elementEq.indicadorPorcentajeBilletes          = Number(((elementEq.indicadorCapacidadBilletes / elementEq.indicadorCapacidadBilletesMax ) * 100).toFixed(2));
            elementEq.indicadorPorcentajeTotalMaxAsegurado = Number(((elementEq.indicadorTotalAsegurado / elementEq.indicadorTotalMaxAsegurado) * 100).toFixed(2));
            elementEq.indicadorColorBarProgressBilletes    = "bg-success text-light";
            if( element.estadoPing == 1 ) {
              elementEq.colorEsstado = '#DAEFE6';
              elementEq.colorTexto = 'text-success';
              elementEq.colorBtn = 'btn btn-success w-100';                
            }       
            else if ( element.estadoPing == 2 ) {
              elementEq.colorEsstado = '#FCB605';
              elementEq.colorTexto = 'text-dark';
              elementEq.colorBtn = 'btn btn-warning w-100';
            }
            else if ( element.estadoPing == 0 ) {
              elementEq.colorEsstado = '#FFDAD2';
              elementEq.colorTexto = 'text-danger';
              elementEq.colorBtn = 'btn btn-danger w-100';
            }
            if( elementEq.indicadorPorcentajeBilletes >= 0 && elementEq.indicadorPorcentajeBilletes < 80  ) {
              elementEq.indicadorColorBarProgressBilletes = "bg-success text-light";              
            }
            else if ( elementEq.indicadorPorcentajeBilletes >= 80 && elementEq.indicadorPorcentajeBilletes <= 90 ) {
              elementEq.indicadorColorBarProgressBilletes = "bg-warning text-dark";
              // this.controlAlerts( 'Capacidad de Piezas del equipo', 'A punto de alcanzar el límite de piezas del equipo, ' + elementEq.serieEquipo, 'orange', 'dark', elementEq.serieEquipo );
            }
            else if ( elementEq.indicadorPorcentajeBilletes > 90 ) {
              elementEq.indicadorColorBarProgressBilletes = "bg-danger text-light";
              // this.controlAlerts( 'Capacidad de Piezas del equipo', 'Haz alcanzado el límite de piezas del equipo, ' + elementEq.serieEquipo, 'orangered', 'whitesmoke', elementEq.serieEquipo );
            }
            if ( elementEq.indicadorPorcentajeTotalMaxAsegurado < 80 ) {
                    elementEq.indicadorColorBarProgressAsegurado = "bg-success text-light";
            }
            else if ( elementEq.indicadorPorcentajeTotalMaxAsegurado >= 80 && elementEq.indicadorPorcentajeTotalMaxAsegurado < 90 ) {
              elementEq.indicadorColorBarProgressAsegurado = "bg-warning text-dark";
              // this.controlAlerts( 'Capacidad de Monto Asegurado', 'A punto de alcanzar el límite de monto asegurado del equipo, ' + elementEq.serieEquipo, 'orange', 'dark', elementEq.serieEquipo );
            }
            else if ( elementEq.indicadorPorcentajeTotalMaxAsegurado >= 90 ) {
              elementEq.indicadorColorBarProgressAsegurado = "bg-danger text-light";
              // this.controlAlerts( 'Capacidad de Monto Asegurado', 'Haz alcanzado el límite del monto asegurado del equipo, ' + elementEq.serieEquipo, 'orangered', 'whitesmoke', elementEq.serieEquipo );
            }
          }
        })
      })
    }
    })
  }

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

  xloader: boolean = false;
  showCuadre: boolean = false;
  colorValidateCuadre: string = 'steelblue';
  validarCuadre() {
    this.xloader = true;
    this.showCuadre = false;
    let sumatoriaValidate:any = Number( this.totalMonedasMontoM.toFixed(2) )  + 
                                Number( this.totalBilletesMontoM.toFixed(2) ) +
                                Number( this.totalMonedasMontoT.toFixed(2) )  + 
                                Number( this.totalBilletesMontoT.toFixed(2) );
    console.log(10)
    setTimeout(() => {    
      console.log(11)
      let xvalue: any = localStorage.getItem('valor_validador');     
      console.log('Estos son los valores que deben coincidir')
      console.log( 'Variable local enviada desde el server: ' + xvalue)
      console.log('Sumatoria de valores: ' + sumatoriaValidate)
      if( Number(xvalue) !== Number(sumatoriaValidate.toFixed(2)) ) {
        this.colorValidateCuadre = 'red';
      }
      else {
        this.colorValidateCuadre = 'green';
      }
      this.xloader = false;
      this.showCuadre = true;
    }, 2000);
  }
  
  isActive: boolean = false;
  machineDesactive(){
    this.isActive = !this.isActive;
    this.obtenerEquipos(1,'void');
  }
}