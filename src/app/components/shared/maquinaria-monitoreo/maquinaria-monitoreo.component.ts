import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Environments } from '../../environments/environments';
import { EquipoService } from '../../dahsboards/equipo/services/equipo.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { EncryptService } from '../services/encrypt.service';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import EasySpeech from 'easy-speech'
import { ClientesService } from '../../dahsboards/cliente/services/clientes.service';

@Component({
  selector: 'app-maquinaria-monitoreo',
  templateUrl: './maquinaria-monitoreo.component.html',
  styleUrls: ['./maquinaria-monitoreo.component.scss']
})

export class MaquinariaMonitoreoComponent implements OnInit {
  listaCliente:                 any;
  nameidentifier:               any;
  sub:                          any;
  name:                         any;
  role:                         any;
  exp:                          any;
  iss:                          any;
  aud:                          any;
  usuario:                      any;
  authorizationdecision:        any;
  filterequip:                  any;
  fechaNotif:                   any;
  fechaActual:                  any;
  listalertas:                  any = [];
  nuevoObjectalerts:            any[] = [];
  listaEsquipo:                 any = [];
  listaEsquipoGhost:            any = [];
  listaEsquipoIndicadores:      any = [];
  numHorasAlertTrans:           any = 24;
  numHorasAlertTimeSincro:      any = 1;
  selectedCliente:              any = 'Todos los clientes';
  selectedClienteId:            any = 'todoCliente';
  selectedMonitoreo:            any = 'Mostrar todo';
  selectedMonitoreoColor:       any = 'White';
  flagVoice                     = false;
  contadorPing:                 number = 0;
  selectedCount:                number = 0;
  theme: any = {
    bgTheme: '#11264a',
    bgSelectColor: '#F6FAFD',
    ftColor: '#2F4656',
    bgTable: '#F6FAFD',
    hoverTable: '#DFECFF'
  }
  estadosMonitoreo: any = [
    { estado: 'Online', color: 'green', count: 0 },
    { estado: 'Offline', color: 'red', count: 0 }
  ];
  private urlHub: any = this.env.apiUrlHub();
  private connectionSendPingEquipo: HubConnection;
  private manualTransactionHub: HubConnection;
  
  constructor( private env: Environments,
    private ncrypt: EncryptService,
    private router: Router,
    private equiposerv: EquipoService,
    private clienteService: ClientesService){
    this.connectionSendPingEquipo = new HubConnectionBuilder().withUrl(this.urlHub+'PingHubEquipos').build();
    this.connectionSendPingEquipo.on("SendPingEquipo", message => {
      this.alertHub(message);});
    this.manualTransactionHub = new HubConnectionBuilder().withUrl(this.urlHub+'manualTransaction').build();
    this.manualTransactionHub.on("SendTransaccionManual", message => {
      console.log("Esto es transaccion", message);
      this.updateTransHub(message)});
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
      if(this.role == 'R003') this.router.navigate(['moneq']);
    } else if (xtokenDecript == null || xtokenDecript == undefined) {
      this.router.navigate(['login'])
    }
    this.obtenerFechaActual();
    this.getClientes();
    this.connectionSendPingEquipo.start().then( ()=> {})
      .catch( e => console.error('Algo ha pasado con el ping...', e));
    this.manualTransactionHub.start().then( ()=> {})
      .catch( e => console.error('Algo ha pasado con th...', e));
  }

  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  playAudio() {
    this.audioPlayer.nativeElement.play();
  }

  controlalerts(tipo: string, msj: string, colorbg: string, nserie: string) {
    let xmsj = msj;
    if (xmsj == '') xmsj = 'void';
    let arr: any = {
      tipo:    tipo,
      msj:     msj,
      colorbg: colorbg,
      nserie:  nserie
    }
    if( xmsj != 'void' ) this.listalertas.push(arr);
    const uniqueData = new Map();
    let key = JSON.stringify({});
    for (const item of this.listalertas) {
      if(item.tipo == "Monitoreo Trans TimeSincro"){        
        key = JSON.stringify({
          tipo: item.tipo,
          nserie: item.nserie
        });
      } else {
        //Crear una cadena que representa el objeto para verificar duplicados
        key = JSON.stringify({
          tipo: item.tipo,
          msj: item.msj,
          colorbg: item.colorbg,
          nserie: item.nserie
        });
      }
      if (!uniqueData.has(key)) uniqueData.set(key, item);
    }
    this.listalertas = Array.from(uniqueData.values());
    this.nuevoObjectalerts = Array.from(uniqueData.values());
  }

  validateSesion() {
    let xtoken:any = sessionStorage.getItem('token');
    if (xtoken == null || xtoken == undefined || xtoken == '') this.router.navigate(['login']);
  }

  async readTextAloud(textData: string) {
    let voiceSelect;
    try {
      if (this.flagVoice == false) this.flagVoice = await EasySpeech.init({ maxTimeout: 5000, interval: 250 });
      if(this.flagVoice == true){
        voiceSelect = EasySpeech.voices().find(voice => 
          voice.name === 'Microsoft Laura - Spanish (Spain)' && 
          voice.lang === 'es-ES'
        );
        if (!voiceSelect) {
          voiceSelect = EasySpeech.voices().find(voice => 
            voice.name === 'Microsoft Andrea Online (Natural) - Spanish (Ecuador)' && 
            voice.lang === 'es-EC'
          );
        }
        (voiceSelect) ? voiceSelect : EasySpeech.voices()[1];
        await EasySpeech.speak({ 
          text: textData,
          voice: voiceSelect,
        })
      }
    } catch (error) {
      console.log('Hubo un error en el speaker: ', error);
    }
  }

  async obtenerEquiposMoneq() {
    try {
      const equipo = await this.equiposerv.obtenerEquipoMoneq().toPromise();
      this.listaEsquipo = equipo;
      this.listaEsquipoGhost = equipo;
      const arrOnline = [];
      const arrOffline = [];
      for (const element of this.listaEsquipo) {
        let dateEquipo = new Date(element.tiempoSincronizacion);
        let diffInMinutes = (this.fechaActual - dateEquipo.getTime()) / 60000;
        if (diffInMinutes >= 5) {
          element.estadoPing = 0;
        }
        await this.obtenerIndicadores(element.serieEquipo);
        if (element.estadoPing == 1) arrOnline.push(element);
        if (element.estadoPing == 0) arrOffline.push(element);
      }
      this.estadosMonitoreo[0].count = arrOnline.length;
      this.estadosMonitoreo[1].count = arrOffline.length;
    } catch (e) {
      console.log(e);
    }
  }

  obtenerIndicadores(machine_sn: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.listaEsquipoIndicadores = [];
      this.equiposerv.obtenerTotalesMoneq(machine_sn).subscribe({
        next: (equipo: any) => this.listaEsquipoIndicadores = equipo,
        error: (e) => {
          console.error(e);
          this.listaEsquipoIndicadores = [];
          reject(false);
        },
        complete: () => {
          if (this.listaEsquipoIndicadores.length){
            this.listaEsquipo.filter((elementEq: any) => {
              if (machine_sn == elementEq.serieEquipo) {
                elementEq.indicadorCapacidadBilletes = this.listaEsquipoIndicadores[0].totalCant;
                elementEq.indicadorTotalAsegurado = this.listaEsquipoIndicadores[0].totalMont;
                elementEq.indicadorPorcentajeBilletes = Number(((elementEq.indicadorCapacidadBilletes / elementEq.indicadorCapacidadBilletesMax) * 100).toFixed(2));
                elementEq.indicadorPorcentajeTotalMaxAsegurado = Number(((elementEq.indicadorTotalAsegurado / elementEq.indicadorTotalMaxAsegurado) * 100).toFixed(2));
                elementEq.indicadorColorBarProgressBilletes = this.getColorClass(elementEq.indicadorPorcentajeBilletes);
                elementEq.indicadorColorBarProgressAsegurado = this.getColorClass(elementEq.indicadorPorcentajeTotalMaxAsegurado);
              }
            });
          }
          resolve(true);
        }
      });
    });
  }

  updateTransHub(data: any){
    const equipoFind = this.listaEsquipo.find((item:any) => item.serieEquipo === data.machine_Sn);
    if(equipoFind){
      if (data.tipo === 'R') {
        equipoFind.ultimaRecoleccion = data.fechaTransaccion;
        ('speechSynthesis' in window) ?
          this.readTextAloud('Se realizó una recolección del equipo ' + data.machine_Sn ):
          console.log('La API de Web Speech no está disponible en este navegador.');
        equipoFind.indicadorCapacidadBilletes           = data.cant;
        equipoFind.indicadorTotalAsegurado              = data.monto;
        equipoFind.indicadorPorcentajeBilletes          = 0;
        equipoFind.indicadorPorcentajeTotalMaxAsegurado = 0;
        this.listalertas  = [];
      } else {
        equipoFind.indicadorCapacidadBilletes = equipoFind.indicadorCapacidadBilletes + data.cant;
        equipoFind.indicadorTotalAsegurado = parseFloat((equipoFind.indicadorTotalAsegurado + data.monto).toFixed(2));
        equipoFind.indicadorPorcentajeBilletes = Number(((equipoFind.indicadorCapacidadBilletes / equipoFind.indicadorCapacidadBilletesMax) * 100).toFixed(2));
        equipoFind.indicadorPorcentajeTotalMaxAsegurado = Number(((equipoFind.indicadorTotalAsegurado / equipoFind.indicadorTotalMaxAsegurado) * 100).toFixed(2));
        equipoFind.indicadorColorBarProgressBilletes = this.getColorClass(equipoFind.indicadorPorcentajeBilletes, 'Capacidad de piezas del equipo', data.machine_Sn);
        equipoFind.indicadorColorBarProgressAsegurado = this.getColorClass(equipoFind.indicadorPorcentajeTotalMaxAsegurado, 'Capacidad de Monto Asegurado', data.machine_Sn);
      }
      equipoFind.ultimaNoTrans = data.transaction_no;
      equipoFind.tipoTrans = data.tipo;
      equipoFind.fechaUltimaTrans = data.fechaTransaccion;
    }
  }

  getColorClass(percentage: any, tipo?: any, serieEquipo?: any): string {
    let colorClass = "bg-success text-light";
    let msj = "";
    let colorbg = "";
    if (percentage < 80) {
      colorClass = "bg-success text-light";
    } else if (percentage >= 80 && percentage <= 90) {
      colorClass = "bg-warning text-dark";
      if (tipo && serieEquipo) {
        msj = `A punto de alcanzar el límite de ${tipo.toLowerCase()}`;
        colorbg = 'orange';
        this.playAudio();
      }
    } else {
      colorClass = "bg-danger text-light";
      if (tipo && serieEquipo) {
        msj = `Haz alcanzado el límite de ${tipo.toLowerCase()}`;
        colorbg = 'orangered';
        this.playAudio();
      }
    }
    if(tipo && serieEquipo) this.controlalerts(tipo, msj, colorbg, serieEquipo);
    return colorClass;
  }

  filterEquipos(): void {
    if(this.selectedClienteId == 'todoCliente'){
      this.listaEsquipo = this.listaEsquipoGhost.filter((item:any) => 
        item.serieEquipo.toString().toLowerCase().includes(this.filterequip.toLowerCase())    ||  
        item.tipoMaquinaria.toString().toLowerCase().includes(this.filterequip.toLowerCase()) || 
        item.provincia.toString().toLowerCase().includes(this.filterequip.toLowerCase())      ||
        item.nombreTienda.toLowerCase().includes(this.filterequip.toLowerCase())
      )
    } else {
      this.listaEsquipo = this.listaEsquipoGhost.filter((item:any) => 
        (item.serieEquipo.toString().toLowerCase().includes(this.filterequip.toLowerCase())   || 
        item.tipoMaquinaria.toString().toLowerCase().includes(this.filterequip.toLowerCase()) || 
        item.provincia.toString().toLowerCase().includes(this.filterequip.toLowerCase())      ||    
        item.nombreTienda.toLowerCase().includes(this.filterequip.toLowerCase()))             &&
        item.idCliente == this.selectedClienteId
      )
    }
  }

  alertHub(dataPingHub: any){
    let fecha = new Date();
    this.updatePing(dataPingHub);
    if(this.contadorPing>=500){
      this.alertTrans();
      this.alertTimeSincro(dataPingHub);
      this.contadorPing = 0;
      this.fechaNotif = fecha.getTime();
    }
    if(this.contadorPing===30 || this.contadorPing===100 || 
      this.contadorPing===200 || this.contadorPing===300 || 
      this.contadorPing===400) {
      const arrOnline = [];
      const arrOffline = [];
      for (const element of this.listaEsquipo) {
        if (element.estadoPing == 1) arrOnline.push(element);
        if (element.estadoPing == 0) arrOffline.push(element);
      }
      this.estadosMonitoreo[0].count = arrOnline.length;
      this.estadosMonitoreo[1].count = arrOffline.length;
    }
    this.contadorPing++;
    console.log(this.contadorPing);
  }

  private updatePing(data: any) {
    for (let equipo of this.listaEsquipo){
      if (equipo.ipEquipo === data.ip) {
        equipo.estadoPing = data.estadoPing;
      } else {
        const syncTime = new Date(data.tiempoSincronizacion);
        const dateEquipo = new Date(equipo.tiempoSincronizacion);
        const diffInMinutes = (syncTime.getTime() - dateEquipo.getTime()) / 60000;
        if (diffInMinutes >= 5) {
          equipo.estadoPing = 0;
        }
      }
    }
  }

  alertTrans(){
    let equiposNow = [];
    (this.selectedClienteId == 'todoCliente') ? equiposNow = this.listaEsquipo : equiposNow = this.listaEsquipoGhost.filter((item: any) => {return item.idCliente === this.selectedClienteId});
    for (let item of equiposNow) {
      let validarhora = this.calcularTiempoDesdeAhora(this.numHorasAlertTrans,item.fechaUltimaTrans);
      if(validarhora){
        let tipo = 'Monitoreo Trans TimeSincro';
        let msj  = 'No se ha realizado transacciones en 24h';
        let colorbg = 'red';
        let serie = item.serieEquipo;
        this.playAudio();
        this.controlalerts( tipo, msj, colorbg, serie);
      }
    }
  }
  
  alertTimeSincro(dataPingHub: any){
    let newMesj = `Ha estado desactivado por mas de ${this.numHorasAlertTimeSincro}h`;
    let equipoFind: any;
    let alerta: any;
    dataPingHub = dataPingHub.filter((element: any) => {
      return element.estadoPing == 0;
    });
    for (let item of dataPingHub) {
      let validarhora = this.calcularTiempoDesdeAhora(this.numHorasAlertTimeSincro,item.tiempoSincronizacion);
      if(validarhora){
        let equiposNow = [];
        equiposNow = (this.selectedClienteId == 'todoCliente') ? this.listaEsquipo : 
          this.listaEsquipoGhost.filter((item: any) => {return item.idCliente === this.selectedClienteId});
        equipoFind = equiposNow.find((itemEquipo:any) => itemEquipo.ipEquipo === item.ip);
        if(equipoFind){
          alerta = this.listalertas.find((itemAlerta:any) =>
            itemAlerta.tipo === 'Monitoreo Trans TimeSincro' &&
            itemAlerta.nserie === equipoFind.serieEquipo
          );
          if(alerta){
            let arrayMsj = newMesj.split(" ");
            let validateMsj = arrayMsj.every(palabra => alerta.msj.includes(palabra));
            if(!validateMsj) alerta.msj = alerta.msj + '\n' +newMesj;
          }
          let tipo = 'Monitoreo Trans TimeSincro';
          let msj  = newMesj;
          let colorbg = 'red';
          let serie = equipoFind.serieEquipo;
          this.playAudio();
          this.controlalerts( tipo, msj, colorbg, serie);
        }
      }
    }
  }

  calcularTiempoDesdeAhora(horas: any, date: any): boolean {
    const ahora = new Date();
    const fecha = new Date(date);
    const diferenciaEnMilisegundos = ahora.getTime() - fecha.getTime();
    const diferenciaEnHoras = diferenciaEnMilisegundos / (1000 * 60 * 60);
    return diferenciaEnHoras > horas;
  }
  
  eliminarAlerta( i:number ) {
    this.listalertas.splice(i, 1);
    this.nuevoObjectalerts.splice(i, 1);
  }
  
  eliminarAllAlerts(){
    this.listalertas.splice(0);
    this.nuevoObjectalerts.splice(0);
  }

  getColor(estadoPing: any){
    if(estadoPing === 1) return 'GREEN';
    if(estadoPing === 0) return 'RED';
    return estadoPing;
  }

  getTipoTrans(tipoTrans: any){
    if(tipoTrans == 'A') return 'Automático';
    if(tipoTrans == 'M') return 'Manual';
    if(tipoTrans == 'R') return 'Retiro';
    return tipoTrans;
  }

  getClientes(){
    this.clienteService.ObtenerClienteSelect().subscribe({
      next: (cliente) => this.listaCliente = cliente,
      error: (e) => console.log(e)
    })
  }

  filterCliente(idCliente: any, nameCliente: any) {
    this.selectedCliente = nameCliente;
    this.selectedClienteId = idCliente;
    this.updateListaEsquipo();
    this.eliminarAllAlerts();
    if(this.selectedClienteId=='todoCliente'){
      this.estadosMonitoreo[0].count = this.listaEsquipoGhost.filter((item: any) => item.estadoPing == 1).length;
      this.estadosMonitoreo[1].count = this.listaEsquipoGhost.filter((item: any) => item.estadoPing == 0).length;
    }else{
      this.estadosMonitoreo[0].count = this.listaEsquipoGhost.filter((item: any) => item.idCliente === this.selectedClienteId && item.estadoPing == 1).length;
      this.estadosMonitoreo[1].count = this.listaEsquipoGhost.filter((item: any) => item.idCliente === this.selectedClienteId && item.estadoPing == 0).length;
    }
    if (this.selectedMonitoreo == 'Online') this.selectedCount = this.estadosMonitoreo[0].count;
    if (this.selectedMonitoreo == 'Offline') this.selectedCount = this.estadosMonitoreo[1].count;
  }
  
  filterMonitoreo(estado: any, color: any, count: any) {
    this.selectedMonitoreo = estado;
    this.selectedMonitoreoColor = color;
    this.selectedCount = count;
    this.updateListaEsquipo();
  }

  updateListaEsquipo() {
    if (this.selectedClienteId === 'todoCliente') {
      if (this.selectedMonitoreo === 'Mostrar todo') {
        this.listaEsquipo = this.listaEsquipoGhost;
      } else {
        let color = this.selectedMonitoreo === 'Online' ? 1 : 0;
        this.listaEsquipo = this.listaEsquipoGhost.filter((item: any) => item.estadoPing === color);
      }
    } else {
      if (this.selectedMonitoreo === 'Mostrar todo') {
        this.listaEsquipo = this.listaEsquipoGhost.filter((item: any) => item.idCliente === this.selectedClienteId);
      } else {
        let color = this.selectedMonitoreo === 'Online' ? 1 : 0;
        this.listaEsquipo = this.listaEsquipoGhost.filter((item: any) => item.idCliente === this.selectedClienteId && item.estadoPing === color);
      }
    }
  }
  
  obtenerFechaActual(){
    this.equiposerv.obtenerHoraActual().subscribe({
      next: (data: any) => this.fechaActual = new Date(data),
      error: (e) => console.error('Error obteniendo la hora actual:', e),
      complete: () => this.obtenerEquiposMoneq()
    });
  }
}