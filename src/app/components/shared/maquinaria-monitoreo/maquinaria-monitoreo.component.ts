import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Environments } from '../../environments/environments';
import { IndexedDbService } from '../services/indexeddb/indexed-db.service';
import { MonitoreoService } from '../../dahsboards/monitoreo-equipos/services/monitoreo.service';
import { MatDialog } from '@angular/material/dialog';
import { EquipoService } from '../../dahsboards/equipo/services/equipo.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { EncryptService } from '../services/encrypt.service';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-maquinaria-monitoreo',
  templateUrl: './maquinaria-monitoreo.component.html',
  styleUrls: ['./maquinaria-monitoreo.component.scss']
})

export class MaquinariaMonitoreoComponent implements OnInit {
  view_filter: boolean = false;
  nameidentifier:any;
  sub:any;
  name:any;
  role:any;
  authorizationdecision:any;
  exp:any;
  iss:any;
  aud:any;
  usuario:any;
  search: any = this.env.apiUrlIcon()+'search.png';
  listalertas: any = [];
  _show_spinner: boolean = false;
  private urlHub: any = this.env.apiUrlHub();
  private connectionSendPingEquipo: HubConnection;
  private manualTransactionHub: HubConnection;
  private automaticTransactionHub: HubConnection;
  private recollectTransactionHub: HubConnection;
  
  constructor( private env: Environments,
    private indexedDbService: IndexedDbService,
    private ncrypt: EncryptService,
    private router: Router,
    private monitoreo: MonitoreoService,
    public  dialog: MatDialog,
    private equiposerv: EquipoService ) {
    this.connectionSendPingEquipo = new HubConnectionBuilder()
                  .withUrl(this.urlHub+'PingHubEquipos')
                  .build();
    this.connectionSendPingEquipo.on("SendPingEquipo", message => { this.PingHub(message); });
    this.manualTransactionHub = new HubConnectionBuilder()
                  .withUrl(this.urlHub+'manualTransaction')
                  .build();
    this.manualTransactionHub.on("SendTransaccionManual", message => { this.MtransHub(message); });
    this.automaticTransactionHub = new HubConnectionBuilder()
                  .withUrl(this.urlHub+'autoTransaccion')
                  .build();
    this.automaticTransactionHub.on("SendTransaccionAuto", message => { this.AuTransHub(message); });
    this.recollectTransactionHub = new HubConnectionBuilder()
                  .withUrl(this.urlHub+'recoleccionTransaccion')
                  .build();
    this.recollectTransactionHub.on("SendTransaccionRecoleccion", message => { this.RecoTransHub(message); });
  }

  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  playAudio() {
    this.audioPlayer.nativeElement.play();
  }

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
  numeroTransa:            any;
  machSerie:               any;
  EmitManualTransHub:      any = [];
  EmitManualPiezasCantidadTransactionHub: any = [];
  mensajeTran:             string = '';

  private MtransHub(data:any) {
    this.EmitManualTransHub = data[2];
    this.EmitManualPiezasCantidadTransactionHub = data[3];
    this.mensajeTran = '. Transacción manual.';
    this.trannserie = this.EmitManualTransHub[0].machine_Sn;

    this.calculoPrimaryLista( this.EmitManualPiezasCantidadTransactionHub, 'T' );

    this.billete1        = data[0].manualDepositoBill1;
    this.billete2        = data[0].manualDepositoBill2;
    this.billete5        = data[0].manualDepositoBill5;
    this.billete10       = data[0].manualDepositoBill10;
    this.billete20       = data[0].manualDepositoBill20;
    this.billete50       = data[0].manualDepositoBill50;
    this.billete100      = data[0].manualDepositoBill100;

    this.montoBillete1   = 1   * data[0].totalDepositoBill1;
    this.montoBillete2   = 2   * data[0].totalDepositoBill2;
    this.montoBillete5   = 5   * data[0].totalDepositoBill5;
    this.montoBillete10  = 10  * data[0].totalDepositoBill10;
    this.montoBillete20  = 20  * data[0].totalDepositoBill20;
    this.montoBillete50  = 50  * data[0].totalDepositoBill50;
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
    this.numeroTransa                 = data[0].transaccionNo;
    this.machSerie                    = data[0].machineSn;

    let tipo    : any = 'hola';
    let msj     : any = '';
    let colorbg : any = '';
    let colorfg : any = '';

    this.listaEsquipo.filter( (element: any) => {
      if( element.serieEquipo == this.machSerie  ) {
        element.indicadorTotalAsegurado              = element.indicadorTotalAsegurado + (this.sumatoriasTotalManualHub + this.sumatoriasTotalMontoCoinHub);
        element.indicadorPorcentajeTotalMaxAsegurado = Number(((element.indicadorTotalAsegurado / element.indicadorTotalMaxAsegurado) * 100).toFixed(2));
        if( element.indicadorPorcentajeBilletes > 0 && element.indicadorPorcentajeBilletes < 80  ) {
          element.indicadorColorBarProgressBilletes = "bg-success text-light";
        }
        else if ( element.indicadorPorcentajeBilletes >= 80 && element.indicadorPorcentajeBilletes <= 90 ) {
          element.indicadorColorBarProgressBilletes = "bg-warning text-dark";
          tipo = 'Capacidad de piezas del equipo';
          msj = 'A punto de alcanzar límite de piezas del equipo, ' + element.serieEquipo;
          colorbg = 'orange';
          colorfg = 'black';
          this.playAudio();
        }
        else if ( element.indicadorPorcentajeBilletes > 90 ) {
          element.indicadorColorBarProgressBilletes = "bg-danger text-light";
          tipo = 'Capacidad de piezas del equipo';
          msj  = 'Haz alcanzado el límite de piezas del equipo, ' + element.serieEquipo;
          colorbg = 'orangered';
          colorfg = 'whitesmoke';
          this.playAudio();
        }
        if ( element.indicadorPorcentajeTotalMaxAsegurado > 0 && element.indicadorPorcentajeTotalMaxAsegurado < 80 ) {
          element.indicadorColorBarProgressAsegurado = "bg-success text-light";
        }
        else if ( element.indicadorPorcentajeTotalMaxAsegurado >= 80 && element.indicadorPorcentajeTotalMaxAsegurado <= 90 ) {
          element.indicadorColorBarProgressAsegurado = "bg-warning text-dark";
          tipo = 'Capacidad de Monto Asegurado';
          msj  = 'A punto de alcanzar el límite del monto asegurado del equipo, ' + element.serieEquipo;
          colorbg = 'orange';
          colorfg = 'black';
          this.playAudio();
        }
        else if ( element.indicadorPorcentajeTotalMaxAsegurado >= 90 ) {
          element.indicadorColorBarProgressAsegurado = "bg-danger text-light";
          tipo = 'Capacidad de Monto Asegurado';
          msj  = 'Haz alcanzado el límite del monto asegurado del equipo, ' + element.serieEquipo;
          colorbg = 'orangered';
          colorfg = 'whitesmoke'
          this.playAudio();
        }
      }
    })
    this.controlalerts( tipo, msj, colorbg, colorfg, this.machSerie );
  }

  nuevoObjectalerts: any[] = [];
  controlalerts(tipo: string, msj: string, colorbg: string, colorfg: string, nserie: string) {
    let xmsj = msj;
    if (xmsj == '') {
      xmsj = 'void';
    }
    let arr: any = {
      msj:     msj,
      colorbg: colorbg,
      colorfg: colorfg,
      nserie:  nserie
    }
    if( xmsj != 'void' ) {
      this.listalertas.push(arr);
    }
    // // ////console.warn(this.listalertas);
    const uniqueData = new Map();
    for (const item of this.listalertas) {
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
    this.nuevoObjectalerts = Array.from(uniqueData.values());
    this.nuevoObjectalerts.filter((elementalerta:any) => {
      if( elementalerta.nserie == this.trannserie ) {
        for( let i = 0; i <= 1; i++ ) {
          this.readTextAloud( elementalerta.msj );
        }
      }
    })
  }

  validateSesion() {
    let xtoken:any = sessionStorage.getItem('token');
    if (xtoken == null || xtoken == undefined || xtoken == '') {
      this.router.navigate(['login'])
    }
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

  eliminaralerta( i:number ) {
    this.listalertas.splice(i, 1);
  }

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

  EmitRecolTransHub: any = [];
  private RecoTransHub(data:any) {
    this.EmitRecolTransHub        = data[1];
    this.machSerie                = data[0].machineSn;

    this.listaDetalleequipoTransa = [];
    this.listaDetalleequipoManual = [];

    this.listaEsquipo.filter( ( element: any ) => {
        if( element.serieEquipo == this.machSerie  ) {
          element.ultimaRecoleccion                    = data[1][0].fechaTransaccion,
          element.indicadorCapacidadBilletes           = 0;
          element.indicadorTotalAsegurado              = 0;
          element.indicadorPorcentajeBilletes          = 0;
          element.indicadorPorcentajeTotalMaxAsegurado = 0;
          if ('speechSynthesis' in window) {
            this.readTextAloud('Se ha realizado un set collection, del equipo ' + this.machSerie );
          } else {
            console.error('La API de Web Speech no está disponible en este navegador.');
          }
          this.totalBilletesCantidadT   = 0;
          this.totalBilletesMontoT      = 0;
          this.totalBilletesCantidadM   = 0;
          this.totalBilletesMontoM      = 0;
        }
      }
    )
    this.primaryLista = [];
    this.listalertas  = [];
  }

  primaryLista:any =[];
  EmitAutoTransHub: any = [];
  trannserie: string = ''
  EmitAutomaticPiezasCantidadTransactionHub:any;
  private AuTransHub(data:any) {
    this.EmitAutoTransHub = data[1];
    this.trannserie = this.EmitAutoTransHub[0].machine_Sn;

    this.mensajeTran = '. Transacción automático.';
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
    let tipo:any = 'hola';
    let msj:any = '';
    let colorbg : any = '';
    let colorfg : any = '';
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
          tipo = 'Capacidad de piezas del equipo';
          msj = 'A punto de alcanzar límite de piezas del equipo, ' + element.serieEquipo;
          colorbg = 'orange';
          colorfg = 'black';
          // this.readTextAloud(this.nuevoObjectalerts[this.nuevoObjectalerts.length-1].msj);
        }
        else if ( element.indicadorPorcentajeBilletes > 90 ) {
          element.indicadorColorBarProgressBilletes = "bg-danger text-light";
          tipo = 'Capacidad de piezas del equipo';
          msj  = 'Haz alcanzado el límite de piezas del equipo, ' + element.serieEquipo;
          colorbg = 'orangered';
          colorfg = 'whitesmoke';
          // this.controlalerts( tipo, msj, 'orangered', 'whitesmoke', element.serieEquipo );
          this.playAudio();
          // this.readTextAloud(this.nuevoObjectalerts[this.nuevoObjectalerts.length-1].msj);
        }
        if ( element.indicadorPorcentajeTotalMaxAsegurado > 0 && element.indicadorPorcentajeTotalMaxAsegurado < 80 ) {
          element.indicadorColorBarProgressAsegurado = "bg-success text-light";
        }
        else if ( element.indicadorPorcentajeTotalMaxAsegurado >= 80 && element.indicadorPorcentajeTotalMaxAsegurado <= 90 ) {
          element.indicadorColorBarProgressAsegurado = "bg-warning text-dark";
          tipo = 'Capacidad de Monto Asegurado';
          msj  = 'A punto de alcanzar el límite del monto asegurado del equipo, ' + element.serieEquipo;
          colorbg = 'orange';
          colorfg = 'black';
          // this.controlalerts( tipo, msj, 'orange', 'black', element.serieEquipo );
          this.playAudio();
          // this.readTextAloud(this.nuevoObjectalerts[this.nuevoObjectalerts.length-1].msj);
        }
        else if ( element.indicadorPorcentajeTotalMaxAsegurado >= 90 ) {
          element.indicadorColorBarProgressAsegurado = "bg-danger text-light";
          tipo = 'Capacidad de Monto Asegurado';
          msj  = 'Haz alcanzado el límite del monto asegurado del equipo, ' + element.serieEquipo;
          colorbg = 'orangered';
          colorfg = 'whitesmoke'
          // this.controlalerts( tipo, msj, 'orangered', 'whitesmoke', element.serieEquipo );
          this.playAudio();
          // this.readTextAloud(this.nuevoObjectalerts[this.nuevoObjectalerts.length-1].msj);
        }
      }
    })
    this.controlalerts( tipo, msj, colorbg, colorfg, this.machSerie );
  }

  calculoPrimaryLista( objectArray:any, type:string ) {
    this.primaryLista = objectArray;
    switch(type) {
    case 'T':
    this.listaDetalleequipoManual = [];
    this.listaDetalleequipoTransa = [];

    this.totalBilletesCantidadM = 0;
    this.totalBilletesMontoM    = 0;
    this.totalMonedasCantidadM  = 0;
    this.totalMonedasMontoM     = 0;
    this.totalBilletesCantidadT = 0;
    this.totalBilletesMontoT    = 0;
    this.totalMonedasCantidadT  = 0;
    this.totalMonedasMontoT     = 0;

    this.primaryLista.filter((element:any) => {
      if(element.tipo == 'Manual') {
        this.listaDetalleequipoManual.push(element);
      }
      else if ( element.tipo == 'Deposito' ) {
        this.listaDetalleequipoTransa.push(element);
      }
    })

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
    });
    break;
    case 'R':
      break;
    }
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
            equi.tiempoSincronizacion = element.tiempoSincronizacion;
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

  ngOnInit(): void {
    this.validateSesion();
    let xuser: any = sessionStorage.getItem('usuario');
    this.usuario = xuser;
    let xtoken:any = sessionStorage.getItem('token');
    const xtokenDecript: any = this.ncrypt.decryptWithAsciiSeed(xtoken, this.env.es, this.env.hash);
    if (xtokenDecript != null || xtokenDecript != undefined) {
      var decoded:any = jwt_decode(xtokenDecript);
      this.sub                   = decoded["sub"];
      this.nameidentifier        = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      this.name                  = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      this.role                  = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      this.authorizationdecision = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision"];
      this.exp                   = decoded["exp"];
      this.iss                   = decoded["iss"];
      this.aud                   = decoded["aud"];
      const rolEncrypt: any = this.ncrypt.encryptWithAsciiSeed(this.role, this.env.es, this.env.hash);
      sessionStorage.setItem('PR', rolEncrypt);
      if(this.role == 'R003') {
        this.router.navigate(['moneq']);
      }
    } else if (xtokenDecript == null || xtokenDecript == undefined) {
      this.router.navigate(['login'])
    }

    this.obtenerEquipos(1,'void');
    this.connectionSendPingEquipo.start().then( ()=> {
    }).catch( e => {
      console.error('ALGO HA PASADO CON PING');
      console.error(e);
    })
    this.manualTransactionHub.start().then( ()=> {
    }).catch( e => {
      console.error('ALGO HA PASADO CON MT');
      console.error(e);
    })
    this.automaticTransactionHub.start().then( ()=> {
    }).catch( e => {
      console.error('ALGO HA PASADO CON AT');
      console.error(e);
    })
    this.recollectTransactionHub.start().then( ()=> {
    }).catch( e => {
      console.error('ALGO HA PASADO CON RT');
      console.error(e);
    })
  }

  listaEsquipo:any = [];
  listaEsquipoGhost:any = [];
  obtenerEquipos( tp:number, ctienda:string ) {
    this.equiposerv.obtenerEquipo(tp, ctienda).subscribe(
      {
        next: (equipo) => {
          this.listaEsquipo = equipo;
          this.listaEsquipoGhost = equipo;
        },
        error:    (e) => { },
        complete: ()  => {
          this.listaEsquipoGhost.filter( (element:any) => {
            this.obtenerIndicadores(element.serieEquipo);
          })
        }
      }
    )
  }

  count: number = 0;
  colorBarProgressBilletesAs: string = "bg-primary text-light";
  listaEsquipoIndicadores: any = [];
  listaEsquipoGhostIndicadores: any = [];
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
              //// // ////console.warn(elementEq.indicadorPorcentajeBilletes)
              // this.playAudio();
              // this.controlalerts( 'Capacidad de Piezas del equipo', 'A punto de alcanzar el límite de piezas del equipo, ' + elementEq.serieEquipo, 'orange', 'dark', elementEq.serieEquipo );
            }
            else if ( elementEq.indicadorPorcentajeBilletes > 90 ) {
              elementEq.indicadorColorBarProgressBilletes = "bg-danger text-light";
              // //// // ////console.warn(elementEq.indicadorPorcentajeBilletes)
              // this.playAudio();
              // this.controlalerts( 'Capacidad de Piezas del equipo', 'Haz alcanzado el límite de piezas del equipo, ' + elementEq.serieEquipo, 'orangered', 'whitesmoke', elementEq.serieEquipo );
            }
            if ( elementEq.indicadorPorcentajeTotalMaxAsegurado < 80 ) {
              elementEq.indicadorColorBarProgressAsegurado = "bg-success text-light";
            }
            else if ( elementEq.indicadorPorcentajeTotalMaxAsegurado >= 80 && elementEq.indicadorPorcentajeTotalMaxAsegurado < 90 ) {
              elementEq.indicadorColorBarProgressAsegurado = "bg-warning text-dark";
              // this.playAudio();
              // this.controlalerts( 'Capacidad de Monto Asegurado', 'A punto de alcanzar el límite de monto asegurado del equipo, ' + elementEq.serieEquipo, 'orange', 'dark', elementEq.serieEquipo );
            }
            else if ( elementEq.indicadorPorcentajeTotalMaxAsegurado >= 90 ) {
              elementEq.indicadorColorBarProgressAsegurado = "bg-danger text-light";
              // this.playAudio();
              // this.controlalerts( 'Capacidad de Monto Asegurado', 'Haz alcanzado el límite del monto asegurado del equipo, ' + elementEq.serieEquipo, 'orangered', 'whitesmoke', elementEq.serieEquipo );
            }
          }
        })
      })
    }})
  }

  filterequip:any;
  filterEquipos(): void {
    this.listaEsquipo = this.listaEsquipoGhost.filter((item:any) => 
    item.serieEquipo.toString().toLowerCase().includes(this.filterequip.toLowerCase()) ||   
    item.provincia.toString().toLowerCase().includes(this.filterequip.toLowerCase())   ||
    item.nombreTienda.toLowerCase().includes(this.filterequip.toLowerCase())
    )
  }

  /**
      item.nombreTienda.toLowerCase().includes(this.filterequip.toLowerCase()) ||
      item.nombremarca .toLowerCase().includes(this.filterequip.toLowerCase()) ||
      item.nombremodelo.toLowerCase().includes(this.filterequip.toLowerCase()) ||
      item.serieEquipo .toLowerCase().includes(this.filterequip.toLowerCase()) ||
      item.tipoMaquinaria.toLowerCase().includes(this.filterequip.toLowerCase())
   */
}