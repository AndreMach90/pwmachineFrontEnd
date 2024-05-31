import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Environments } from '../../environments/environments';
import { TiendaService } from '../tienda/services/tienda.service';
import { MatDialog } from '@angular/material/dialog';
import { EquipoService } from '../equipo/services/equipo.service';
import { ClientesService } from '../cliente/services/clientes.service';
import { ServicesSharedService } from '../../shared/services-shared/services-shared.service';
import { MonitoreoService } from '../monitoreo-equipos/services/monitoreo.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { IndexedDbService } from '../../shared/services/indexeddb/indexed-db.service';
import Swal from 'sweetalert2'
import { FormControl, FormGroup } from '@angular/forms';
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

  EmitAutoTransHub: any = [];
  EmitAutomaticPiezasCantidadTransactionHub:any;

  /** Cantidad de la transaccion en monedas INICO */
  manualDepositoCoin1:   number = 0;
  manualDepositoCoin5:   number = 0;
  manualDepositoCoin10:  number = 0;
  manualDepositoCoin25:  number = 0;
  manualDepositoCoin50:  number = 0;
  manualDepositoCoin100: number = 0;
  /** Cantidad de la transaccion en monedas FIN */
  sumatoriasTotalCoinHub:      number = 0;
  sumatoriasTotalManualHub:    number = 0;
  sumatoriasTotalMontoCoinHub: number = 0;
  /** Cantidad de la transaccion INICIO */
  billete1:                number = 0;
  billete2:                number = 0;
  billete5:                number = 0;
  billete10:               number = 0;
  billete20:               number = 0;
  billete50:               number = 0;
  billete100:              number = 0;
  sumatoriasTotalHub:      number = 0;
  /** Cantidad de la transaccion FIN */
  /** Monto de dinero en la maquina INICIO */
  montoBillete1:           number = 0;
  montoBillete2:           number = 0;
  montoBillete5:           number = 0;
  montoBillete10:          number = 0;
  montoBillete20:          number = 0;
  montoBillete50:          number = 0;
  montoBillete100:         number = 0;
  montoSumatoriasTotalHub: number = 0;
  /** Monto de dinero en la maquina FIN*/
  numeroTransa: any;
  machSerie:    any;
  EmitManualTransHub: any = [];
  EmitManualPiezasCantidadTransactionHub: any = [];
  /*************************** */

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
  
  @Output() nserieEmit: EventEmitter<string> = new EventEmitter<string>();
  
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

  private urlHub: any = this.env.apiUrlHub();
  private connectionSendPingEquipo: HubConnection;
  private manualTransactionHub: HubConnection;
  private automaticTransactionHub: HubConnection;
  private recollectTransactionHub: HubConnection;

  public filterequipForm = new FormGroup({
    filterequip:   new FormControl('')
  })
  
  
  constructor( private env: Environments,
               private indexedDbService: IndexedDbService,
               private monitoreo: MonitoreoService,
               public  dialog: MatDialog,
               private equiposerv: EquipoService,
     ) {

      /** Ping Hub esta funcion establece la conexión con el Estado ping del equipo, mediante el canal 'PingHubEquipos' [#001] */
      this.connectionSendPingEquipo = new HubConnectionBuilder()
                  .withUrl(this.urlHub+'PingHubEquipos')
                  .build();
                  this.connectionSendPingEquipo.on("SendPingEquipo", message => {
                    this.PingHub(message);
                  });
      
      /** Transacción Manual esta función  */
      this.manualTransactionHub = new HubConnectionBuilder()
                  .withUrl(this.urlHub+'manualTransaction')
                  .build();
                  this.manualTransactionHub.on("SendTransaccionManual", message => {
                    this.MtransHub(message);
                  });

      this.automaticTransactionHub = new HubConnectionBuilder()
                  .withUrl(this.urlHub+'autoTransaccion')
                  .build();
                  this.automaticTransactionHub.on("SendTransaccionAuto", message => {
                    this.AuTransHub(message);
                  });

      this.recollectTransactionHub = new HubConnectionBuilder()
                  .withUrl(this.urlHub+'recoleccionTransaccion')
                  .build();
                  this.recollectTransactionHub.on("SendTransaccionRecoleccion", message => {
                    this.RecoTransHub(message);
                  });
     }

    @ViewChild('audioPlayer') audioPlayer!: ElementRef;
    playAudio() {
      this.audioPlayer.nativeElement.play();
    }

    ngOnInit(): void {
      this.obtenerEquipos(1,'void');
      this.inicializadorHubs();
    }

  inicializadorHubs() {
    this.connectionSendPingEquipo.start().then( ()=> {
      console.warn( 'PINGHUB CONECTADO!' )
    }).catch( e => {
      Swal.fire({
        title: "Error #MT-001",
        text: "Este error suele ocurrir debido a una interferencia entre el canal hub que transmite datos desde el servidor, específicamente Estado ping del equipo.",
        icon: "error"
      });
      console.error('ALGO HA PASADO CON PING:',e);
    })

    this.manualTransactionHub.start().then( ()=> {
    }).catch( e => {
      Swal.fire({
        title: "Error #MT-002",
        text:  "Este error suele ocurrir debido a una interferencia entre el canal hub que transmite datos desde el servidor, especifícamente Transacciones manuales.",
        icon:  "error"
      });
      console.error('ALGO HA PASADO CON MT:',e);
    })

    this.automaticTransactionHub.start().then( ()=> {
    }).catch( e => {
      Swal.fire({
        title: "Error #MT-003",
        text:  "Este error suele ocurrir debido a una interferencia entre el canal hub que transmite datos desde el servidor, especifícamente Transacciones automáticas.",
        icon:  "error"
      });
      console.error('ALGO HA PASADO CON AT:',e);
    })

    this.recollectTransactionHub.start().then( () => {
    }).catch( e => {
      Swal.fire({
        title: "Error #MT-004",
        text:  "Este error suele ocurrir debido a una interferencia entre el canal hub que transmite datos desde el servidor, especifícamente Transacciones de indoles de recolección.",
        icon:  "error"
      });
      console.error('ALGO HA PASADO CON RC:',e);
    })
  }

  public countmin: number = 5000;
  private PingHub(data:any) {
    data.filter( (element:any) => {
      this.listaEsquipo.filter( (equi:any) => {

        if( element.ip == equi.ipEquipo ) {
          
          if( element.estadoPing == 1 ) {
            equi.colorEsstado = '#DAEFE6';
            equi.colorTexto   = 'text-success';
            equi.colorBtn     = 'btn btn-success w-100';
            equi.estadoPing   = element.estadoPing;
          }
          
          else if ( element.estadoPing == 2 ) {
            equi.colorEsstado = '#FCB605';
            equi.colorTexto   = 'text-dark';
            equi.colorBtn     = 'btn btn-warning w-100';
            equi.estadoPing   = element.estadoPing;
          }
          
          else if ( element.estadoPing == 0 ) {
            equi.colorEsstado = '#FFDAD2';
            equi.colorTexto   = 'text-danger';
            equi.colorBtn     = 'btn btn-danger w-100';
            equi.estadoPing = element.estadoPing;
          }

        }

      })

    })

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

  private MtransHub(data:any) {

    //console.warn(' REPODASH MANUAL HUB ')
    //console.warn(data[0].machineSn);

    /** ============================================= */
    /**Actualizar variable de entorno INICIO */

    let vent:number = Number(localStorage.getItem('valor_validador'));
    let totalNormal: number = data[2][0].total;
    // //console.warn( vent + totalNormal )
    let xmachine:any = localStorage.getItem('equipoMonitoreando');
    if( xmachine === data[0].machineSn ) {
      let sumNormal: number = vent + totalNormal;
      localStorage.setItem('valor_validador', sumNormal.toFixed(2).toString());
    }
    /** FIN */
    /** ============================================= */

    this.EmitManualTransHub = data[2];
    this.EmitManualPiezasCantidadTransactionHub = data[3];

    this.billete1        = data[0].manualDepositoBill1;
    this.billete2        = data[0].manualDepositoBill2;
    this.billete5        = data[0].manualDepositoBill5;
    this.billete10       = data[0].manualDepositoBill10;
    this.billete20       = data[0].manualDepositoBill20;
    this.billete50       = data[0].manualDepositoBill50;
    this.billete100      = data[0].manualDepositoBill100;

    this.montoBillete1   = 1 * data[0].totalDepositoBill1;
    this.montoBillete2   = 2 * data[0].totalDepositoBill2;
    this.montoBillete5   = 5 * data[0].totalDepositoBill5;
    this.montoBillete10  = 10 * data[0].totalDepositoBill10;
    this.montoBillete20  = 20 * data[0].totalDepositoBill20;
    this.montoBillete50  = 50 * data[0].totalDepositoBill50;
    this.montoBillete100 = 100 * data[0].totalDepositoBill100;

    this.manualDepositoCoin1   = data[0].manualDepositoCoin1;
    this.manualDepositoCoin5   = data[0].manualDepositoCoin5;
    this.manualDepositoCoin10  = data[0].manualDepositoCoin10;
    this.manualDepositoCoin25  = data[0].manualDepositoCoin25;
    this.manualDepositoCoin50  = data[0].manualDepositoCoin50;
    this.manualDepositoCoin100 = data[0].manualDepositoCoin100;

    this.sumatoriasTotalHub           = this.billete1 + this.billete2 + this.billete5 + this.billete10 + this.billete20 + this.billete50 + this.billete100;
    this.sumatoriasTotalManualHub     = (1 * this.billete1) + (2 * this.billete2) + (5 * this.billete5) + (10 * this.billete10) + (20 * this.billete20) + (50 * this.billete50) + (100 * this.billete100);
    this.montoSumatoriasTotalHub      = this.montoBillete1 + this.montoBillete2 + this.montoBillete5 + this.montoBillete10 + this.montoBillete20 + this.montoBillete50 + this.montoBillete100;
    this.sumatoriasTotalCoinHub       = this.manualDepositoCoin1 + this.manualDepositoCoin5 + this.manualDepositoCoin10 + this.manualDepositoCoin25 + this.manualDepositoCoin50 + this.manualDepositoCoin100;
    this.sumatoriasTotalMontoCoinHub  = (0.01 * this.manualDepositoCoin1) + (0.05 * this.manualDepositoCoin5) + (0.10 * this.manualDepositoCoin10) + (0.25 * this.manualDepositoCoin25) + (0.50 * this.manualDepositoCoin50) + (1 * this.manualDepositoCoin100);
    this.numeroTransa = data[0].transaccionNo;
    this.machSerie    = data[0].machineSn;

    this.calculoPrimaryLista( this.EmitManualPiezasCantidadTransactionHub, 'T' );
    this.listaEsquipo.filter( (element: any) => {

      if( this.machSerie == element.serieEquipo ) {
        element.indicadorTotalAsegurado              = element.indicadorTotalAsegurado + (this.sumatoriasTotalManualHub + this.sumatoriasTotalMontoCoinHub);
        element.indicadorPorcentajeTotalMaxAsegurado = Number(((element.indicadorTotalAsegurado / element.indicadorTotalMaxAsegurado) * 100).toFixed(2));

        if( element.indicadorPorcentajeBilletes > 0 && element.indicadorPorcentajeBilletes < 80  ) {
          element.indicadorColorBarProgressBilletes = "bg-success text-light";
        }
        else if ( element.indicadorPorcentajeBilletes >= 80 && element.indicadorPorcentajeBilletes <= 90 ) {
          element.indicadorColorBarProgressBilletes = "bg-warning text-dark"; 
          this.controlAlerts( 'Capacidad de piezas del equipo', 'A punto de alcanzar límite de piezas del equipo, ' + element.serieEquipo, 'orange', 'black', element.serieEquipo );
        }
        else if ( element.indicadorPorcentajeBilletes > 90 ) {
          element.indicadorColorBarProgressBilletes = "bg-danger text-light";
          this.controlAlerts( 'Capacidad de piezas del equipo', 'Haz alcanzado el límite de piezas del equipo, ' + element.serieEquipo, 'orangered', 'white', element.serieEquipo );
        }
        if ( element.indicadorPorcentajeTotalMaxAsegurado > 0 && element.indicadorPorcentajeTotalMaxAsegurado < 80 ) {
          element.indicadorColorBarProgressAsegurado = "bg-success text-light";
        }
        else if ( element.indicadorPorcentajeTotalMaxAsegurado >= 80 && element.indicadorPorcentajeTotalMaxAsegurado <= 90 ) {
          element.indicadorColorBarProgressAsegurado = "bg-warning text-dark";
          this.controlAlerts( 'Monto asegurado del equipo', 'A punto de alcanzar el monto asegurado del equipo, ' + element.serieEquipo, 'orange', 'black', element.serieEquipo );
        }
        else if ( element.indicadorPorcentajeTotalMaxAsegurado >= 90 ) {
          element.indicadorColorBarProgressAsegurado = "bg-danger text-light";
          this.controlAlerts( 'Monto asegurado del equipo', 'Haz alcanzado el monto asegurado del equipo, ' + element.serieEquipo, 'orangered', 'whitesmoke', element.serieEquipo );
        }
      }
    })    
  // }
  }

  nuevoObjectAlerts: any[] = [];
  controlAlerts(tipo: string, msj: string, colorbg: string, colorfg: string, nserie: string) {

    let arr: any = {
      tipo:    tipo,
      msj:     msj,
      colorbg: colorbg,
      colorfg: colorfg,
      nserie:  nserie
    }
    
    this.listAlertas.push(arr);
    const uniqueData = new Map();
    for (const item of this.listAlertas) {
      // Crear una cadena que representa el objeto para verificar duplicados
      const key = JSON.stringify({
        tipo: item.tipo,
        msj: item.msj,
        colorbg: item.colorbg,
        colorfg: item.colorfg,
        nserie: item.nserie
      });
      if (!uniqueData.has(key)) {
        uniqueData.set(key, item);
      }
    }
    
    this.nuevoObjectAlerts = Array.from(uniqueData.values());

  }
  
  readTextAloud(text: string) {

    let synth = window.speechSynthesis;
    let voices = synth.getVoices();
    let spanishVoice = voices.find(voice => voice.lang.startsWith('es-'));
    if (spanishVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = spanishVoice;
      utterance.lang = 'es-LA';
      synth.speak(utterance);
    } else {
      console.error('No se encontró una voz en español disponible.');
    }

  }  

  eliminarAlerta( i:number ) {
    this.listAlertas.splice(i, 1);
  }

  EmitRecolTransHub: any = [];
  private RecoTransHub(data:any) {

    //console.warn('RECOL DATA TRANS HUB');
    //console.warn(data);
    const zero = 0;

    let xmachine:any = localStorage.getItem('equipoMonitoreando');
    if( xmachine === data[0].machineSn ) {
      localStorage.setItem('valor_validador', zero.toString());
      if ( this.nserie == data[0].machineSn ) {
        this.totalBilletesCantidadT   = 0;
        this.totalBilletesMontoT      = 0;
        this.totalBilletesCantidadM   = 0;
        this.totalBilletesMontoM      = 0;
      }
    }


    this.EmitRecolTransHub        = data[1];
    this.machSerie                = data[0].machineSn;
    this.listaDetalleequipoTransa = [];
    this.listaDetalleequipoManual = [];
    this.listaEsquipo.filter( ( element: any ) => {

        if( element.serieEquipo == this.machSerie  ) {
          
          element.indicadorCapacidadBilletes           = 0;
          element.indicadorTotalAsegurado              = 0;
          element.indicadorPorcentajeBilletes          = 0;
          element.indicadorPorcentajeTotalMaxAsegurado = 0;

          this.totalBilletesCantidadT = this.totalBilletesCantidadT * 0;
          this.totalBilletesMontoT    = this.totalBilletesMontoT    * 0;
          this.totalBilletesCantidadM = this.totalBilletesCantidadM * 0;
          this.totalBilletesMontoM    = this.totalBilletesMontoM    * 0;
          this.totalMonedasMontoM     = this.totalMonedasMontoM     * 0;

          if ('speechSynthesis' in window) {
            this.readTextAloud('Se ha realizado un set collection, del equipo ' + this.machSerie );
          } else {
            console.error('La API de Web Speech no está disponible en este navegador.');
          }

        }
      }
    )

    this.primaryLista = [];
    this.listAlertas  = [];
    // setTimeout(() => {
      this.nserie = xmachine;
      // alert('Obteniendo datos nuevamente de: ' + this.nserie);
      // this.obtenerEquipos(1,'void');
      this.monitoreo.obtenerDetalleEquipos(this.nserie).subscribe(
        {
        next:(x) => {
          this.primaryLista = x;
  
          //console.warn('ESTO PASA EN MONITOREAR')
          //console.warn(this.primaryLista)
  
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

    // }, 1000)

  }
  
  private AuTransHub(data:any) {

    //console.warn('data');
    //console.table(data);



    /** ============================================= */
    /** INICIO */

    let vent:number = Number(localStorage.getItem('valor_validador'));
    let totalNormal: number = data[1][0].total;
    //console.warn( vent + totalNormal )
    let xmachine:any = localStorage.getItem('equipoMonitoreando');
    if( xmachine === data[0].machineSn ) {
      let sumNormal: number = vent + totalNormal;
      localStorage.setItem('valor_validador', sumNormal.toFixed(2).toString());
    }

    // let sumNormal: number = vent + totalNormal;
    // localStorage.setItem('valor_validador', sumNormal.toFixed(2).toString());

    /** FIN */
    /** ============================================= */

    this.EmitAutoTransHub = data[1];
    this.billete1        = data[0].depositoBill1;
    this.billete2        = data[0].depositoBill2;
    this.billete5        = data[0].depositoBill5;
    this.billete10       = data[0].depositoBill10;
    this.billete20       = data[0].depositoBill20;
    this.billete50       = data[0].depositoBill50;
    this.billete100      = data[0].depositoBill100;
    
    this.montoBillete1   = 1 * data[0].totalDepositoBill1;
    this.montoBillete2   = 2 * data[0].totalDepositoBill2;
    this.montoBillete5   = 5 * data[0].totalDepositoBill5;
    this.montoBillete10  = 10 * data[0].totalDepositoBill10;
    this.montoBillete20  = 20 * data[0].totalDepositoBill20;
    this.montoBillete50  = 50 * data[0].totalDepositoBill50;
    this.montoBillete100 = 100 * data[0].totalDepositoBill100;

    this.sumatoriasTotalHub      = this.billete1      + this.billete2      + this.billete5      + this.billete10      + this.billete20      + this.billete50      + this.billete100;
    this.montoSumatoriasTotalHub = this.montoBillete1 + this.montoBillete2 + this.montoBillete5 + this.montoBillete10 + this.montoBillete20 + this.montoBillete50 + this.montoBillete100;
    this.numeroTransa            = data[0].transaccionNo;
    this.machSerie               = data[0].machineSn;

    this.EmitAutomaticPiezasCantidadTransactionHub = data[2];

    this.calculoPrimaryLista(this.EmitAutomaticPiezasCantidadTransactionHub, 'T');
    this.listaEsquipo.filter( (element: any) => {
      if ( element.serieEquipo == this.machSerie  ) {
        element.indicadorCapacidadBilletes          += this.sumatoriasTotalHub;
        element.indicadorTotalAsegurado = data[1][0].totalRecoleccion;
        element.indicadorPorcentajeBilletes          = Number(((element.indicadorCapacidadBilletes / element.indicadorCapacidadBilletesMax) * 100).toFixed(2));
        element.indicadorPorcentajeTotalMaxAsegurado = Number(((element.indicadorTotalAsegurado / element.indicadorTotalMaxAsegurado) * 100).toFixed(2));
        if( element.indicadorPorcentajeBilletes > 0 && element.indicadorPorcentajeBilletes < 80  ) {
          element.indicadorColorBarProgressBilletes = "bg-success text-light";
        }
        else if ( element.indicadorPorcentajeBilletes >= 80 && element.indicadorPorcentajeBilletes <= 90 ) {
          element.indicadorColorBarProgressBilletes = "bg-warning text-dark";
        }
        else if ( element.indicadorPorcentajeBilletes > 90 ) {
          element.indicadorColorBarProgressBilletes = "bg-danger text-light";
        }
        if ( element.indicadorPorcentajeTotalMaxAsegurado > 0 && element.indicadorPorcentajeTotalMaxAsegurado < 80 ) {
          element.indicadorColorBarProgressAsegurado = "bg-success text-light";
        }
        else if ( element.indicadorPorcentajeTotalMaxAsegurado >= 80 && element.indicadorPorcentajeTotalMaxAsegurado <= 90 ) {
          element.indicadorColorBarProgressAsegurado = "bg-warning text-dark";
        }
        else if ( element.indicadorPorcentajeTotalMaxAsegurado >= 90 ) {
          element.indicadorColorBarProgressAsegurado = "bg-danger text-light";
        }
      }
      }
      )
    // }
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
    //console.log('Transmitiendo tipo filtro: ' + this.tipoFiltro);
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

    this.equiposerv.obtenerEquipo(tp, ctienda).subscribe(
      {
        next: (equipo) => {
          this.listaEsquipo = equipo;
          this.listaEsquipoGhost = equipo;

          console.log(' ========================================= ');
          console.log(' EQUIPOS MOSTRADOS AL INICIO DE HOME ');
          console.log(this.listaEsquipo);
          console.log(' ========================================= ');

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
      // item.nombreTienda.toLowerCase().includes(this.filterequip.toLowerCase()) ||
      // item.nombremarca .toLowerCase().includes(this.filterequip.toLowerCase()) ||
      // item.nombremodelo.toLowerCase().includes(this.filterequip.toLowerCase()) ||
      // item.tipoMaquinaria.toLowerCase().includes(this.filterequip.toLowerCase())
      // //console.log(item)
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
            // //////console.warn(elementEq.indicadorPorcentajeBilletes );
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
              //////console.warn(elementEq.indicadorPorcentajeBilletes)
              // this.controlAlerts( 'Capacidad de Piezas del equipo', 'A punto de alcanzar el límite de piezas del equipo, ' + elementEq.serieEquipo, 'orange', 'dark', elementEq.serieEquipo );
            }
            else if ( elementEq.indicadorPorcentajeBilletes > 90 ) {
              elementEq.indicadorColorBarProgressBilletes = "bg-danger text-light";
              //////console.warn(elementEq.indicadorPorcentajeBilletes)
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
    
    // alert("MONITORANDO");
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

        //console.warn('ESTO PASA EN MONITOREAR')
        //console.warn(this.primaryLista)

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

}



