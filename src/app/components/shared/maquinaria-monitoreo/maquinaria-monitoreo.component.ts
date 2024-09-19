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
  numE: any;
  codCli: any;
  listaCliente: any;
  nameidentifier: any;
  sub: any;
  name: any;
  role: any;
  exp: any;
  iss: any;
  aud: any;
  usuario: any;
  authorizationdecision: any;
  filterequip: any;
  fechaNotif: any;
  fechaActual: any;
  listalertas: any = [];
  nuevoObjectalerts: any[] = [];
  listaEsquipo: any = [];
  listaEsquipoGhost: any = [];
  listaEsquipoIndicadores: any = [];
  numHorasAlertTrans: any = 6;
  numHorasAlertTimeSincro: any = 1;
  numTopNotification: any = 300;
  selectedCliente: any = 'Todos los clientes';
  selectedClienteId: any = 'todoCliente';
  selectedMonitoreo: any = 'Mostrar todo';
  selectedMonitoreoColor: any = 'White';
  flagVoice = false;
  contadorPing: number = 0;
  selectedCount: number = 0;
  theme: any = {
    bgTheme: '#11264a',
    bgSelectColor: '#F6FAFD',
    ftColor: '#2F4656',
    bgTable: '#F6FAFD',
    hoverTable: '#DFECFF'
  }
  estadosMonitoreo: any = [
    { estado: 'Online', color: 'green', count: 0 },
    { estado: 'Offline', color: 'red', count: 0 },
    { estado: 'E. Transaccional', color: 'orange', count: 0 }
  ];
  private urlHub: any = this.env.apiUrlHub();
  private connectionSendPingEquipo: HubConnection;
  private manualTransactionHub: HubConnection;

  constructor(private env: Environments,
    private ncrypt: EncryptService,
    private router: Router,
    private equiposerv: EquipoService,
    private clienteService: ClientesService) {
    this.connectionSendPingEquipo = new HubConnectionBuilder().withUrl(this.urlHub + 'PingHubEquipos').build();
    this.connectionSendPingEquipo.on("SendPingEquipo", message => {
      this.alertHub(message);
    });
    this.manualTransactionHub = new HubConnectionBuilder().withUrl(this.urlHub + 'manualTransaction').build();
    this.manualTransactionHub.on("SendTransaccionManual", message => {
      this.updateTransHub(message)
    });
  }

  ngOnInit(): void {
    this.validateSesion();
    let xuser: any = sessionStorage.getItem('usuario');
    this.usuario = xuser;
    let xtoken: any = sessionStorage.getItem('token');
    const xtokenDecript: any = this.ncrypt.decryptWithAsciiSeed(xtoken, this.env.es, this.env.hash);
    if (xtokenDecript != null || xtokenDecript != undefined) {
      var decoded: any = jwt_decode(xtokenDecript);
      this.sub = decoded["sub"];
      this.nameidentifier = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      this.name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      this.role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      this.authorizationdecision = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision"];
      this.exp = decoded["exp"];
      this.iss = decoded["iss"];
      this.aud = decoded["aud"];
      const rolEncrypt: any = this.ncrypt.encryptWithAsciiSeed(this.role, this.env.es, this.env.hash);
      sessionStorage.setItem('PR', rolEncrypt);
      if (this.role == 'R003') this.router.navigate(['moneq']);
    } else if (xtokenDecript == null || xtokenDecript == undefined) {
      this.router.navigate(['login'])
    }
    this.getClientes();
    this.connectionSendPingEquipo.start().then(() => { })
      .catch(e => console.error('Algo ha pasado con el ping...', e));
    this.manualTransactionHub.start().then(() => { })
      .catch(e => console.error('Algo ha pasado con th...', e));
  }

  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  playAudio() {
    this.audioPlayer.nativeElement.play();
  }

  controlalerts(tipo: string, msj: string, colorbg: string, nserie: string) {
    let xmsj = msj;
    if (xmsj == '') xmsj = 'void';
    let arr: any = {
      tipo: tipo,
      msj: msj,
      colorbg: colorbg,
      nserie: nserie
    }
    if (xmsj != 'void') this.listalertas.push(arr);
    const uniqueData = new Map();
    let key = JSON.stringify({});
    for (const item of this.listalertas) {
      if (item.tipo == "Monitoreo Trans TimeSincro") {
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
    let xtoken: any = sessionStorage.getItem('token');
    if (xtoken == null || xtoken == undefined || xtoken == '') this.router.navigate(['login']);
  }

  async readTextAloud(textData: string) {
    let voiceSelect;
    try {
      if (this.flagVoice == false) this.flagVoice = await EasySpeech.init({ maxTimeout: 5000, interval: 250 });
      if (this.flagVoice == true) {
        voiceSelect = EasySpeech.voices().find(voice =>
          voice.lang === 'es-EC' ||
          voice.lang === 'es-ES' ||
          voice.lang === 'es-MX' ||
          voice.lang === 'es_EC' ||
          voice.lang === 'es_ES' ||
          voice.lang === 'es_MX'
        );
        (voiceSelect) ? voiceSelect : EasySpeech.voices()[1];
        await EasySpeech.speak({
          text: textData,
          voice: voiceSelect,
        })
      }
    } catch (error) {
      console.error('Hubo un error en el speaker: ', error);
    }
  }

  async obtenerEquiposMoneq() {
    try {
      if (this.role === 'R005') {
        this.numE = 2;
        this.codCli = this.env.codCerveceria;
      } else {
        this.numE = 1;
        this.codCli = null;
      }
      const equipo = await this.equiposerv.obtenerEquipoMoneq(this.numE, this.codCli).toPromise();
      this.listaEsquipo = equipo;
      this.listaEsquipoGhost = equipo;
      const arrOnline = [];
      const arrOffline = [];
      const arrMaqError = [];
      for (const element of this.listaEsquipo) {
        let dateEquipo = new Date(element.tiempoSincronizacion);
        let diffInMinutes = (this.fechaActual - dateEquipo.getTime()) / 60000;
        let validarhora = this.calcularTiempoDesdeAhora(this.numHorasAlertTrans, element.fechaUltimaTrans);
        if (diffInMinutes >= 5) element.estadoPing = 0;
        await this.obtenerIndicadores(element.serieEquipo);
        if (element.estadoPing == 1) arrOnline.push(element);
        if (element.estadoPing == 0) arrOffline.push(element);
        if (validarhora) arrMaqError.push(element);
      }
      this.estadosMonitoreo[0].count = arrOnline.length;
      this.estadosMonitoreo[1].count = arrOffline.length;
      this.estadosMonitoreo[2].count = arrMaqError.length;
    } catch (e) {
      console.error(e);
    }
  }

  obtenerIndicadores(machine_sn: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.listaEsquipoIndicadores = [];
      this.equiposerv.obtenerTotalesMoneq(machine_sn).subscribe({
        next: (equipo: any) => { this.listaEsquipoIndicadores = equipo;  },
        error: (e) => {
          console.error(e);
          this.listaEsquipoIndicadores = [];
          reject(false);
        },
        complete: () => {
          if (this.listaEsquipoIndicadores.length) {
            this.listaEsquipo.filter((elementEq: any) => {
              if (machine_sn == elementEq.serieEquipo) {
                elementEq.indicadorCapacidadBilletes = elementEq.tipoMaquinaria === 'DEPOSITARIO DE MONEDAS' ? this.listaEsquipoIndicadores[0].totalCantMonedas : this.listaEsquipoIndicadores[0].totalCantBilletes;
                elementEq.indicadorPorcentajeBilletes = Number(((elementEq.indicadorCapacidadBilletes / (elementEq.tipoMaquinaria === 'DEPOSITARIO DE MONEDAS' ? elementEq.indicadorCapacidadMaxMonedas : elementEq.indicadorCapacidadBilletesMax)) * 100).toFixed(2));
                elementEq.indicadorColorBarProgressBilletes = this.getColorClass(elementEq.indicadorPorcentajeBilletes);
                elementEq.indicadorTotalAsegurado = this.listaEsquipoIndicadores[0].totalMont;
                elementEq.indicadorPorcentajeTotalMaxAsegurado = Number(((elementEq.indicadorTotalAsegurado / elementEq.indicadorTotalMaxAsegurado) * 100).toFixed(2));
                elementEq.indicadorColorBarProgressAsegurado = this.getColorClass(elementEq.indicadorPorcentajeTotalMaxAsegurado);
              }
            });
          }
          resolve(true);
        }
      });
    });
  }

  updateTransHub(data: any) {
    const equipoFind = this.listaEsquipo.find((item: any) => item.serieEquipo === data.machine_Sn);
    if (equipoFind) {
      if (data.tipo === 'R') {
        equipoFind.ultimaRecoleccion = data.fechaTransaccion;
        ('speechSynthesis' in window)
          ? this.readTextAloud('Se realizó una recolección del equipo ' + data.machine_Sn)
          : console.error('La API de Web Speech no está disponible en este navegador.');
        equipoFind.indicadorCapacidadBilletes = data.cant;
        equipoFind.indicadorTotalAsegurado = data.monto;
        equipoFind.indicadorPorcentajeBilletes = 0;
        equipoFind.indicadorPorcentajeTotalMaxAsegurado = 0;
        this.listalertas = [];
      } else {
        if (equipoFind.tipoMaquinaria === 'DEPOSITARIO DE MONEDAS') {
          if (data.tipo === 'M') equipoFind.indicadorCapacidadBilletes = equipoFind.indicadorCapacidadBilletes + data.cant;
        } else {
          if (data.tipo === 'A') equipoFind.indicadorCapacidadBilletes = equipoFind.indicadorCapacidadBilletes + data.cant;
        }
        equipoFind.indicadorPorcentajeBilletes = Number(((equipoFind.indicadorCapacidadBilletes / (equipoFind.tipoMaquinaria === 'DEPOSITARIO DE MONEDAS' ? equipoFind.indicadorCapacidadMaxMonedas : equipoFind.indicadorCapacidadBilletesMax)) * 100).toFixed(2));
        equipoFind.indicadorColorBarProgressBilletes = this.getColorClass(equipoFind.indicadorPorcentajeBilletes, 'Capacidad de piezas del equipo', data.machine_Sn);
        equipoFind.indicadorTotalAsegurado = parseFloat((equipoFind.indicadorTotalAsegurado + data.monto).toFixed(2));
        equipoFind.indicadorPorcentajeTotalMaxAsegurado = Number(((equipoFind.indicadorTotalAsegurado / equipoFind.indicadorTotalMaxAsegurado) * 100).toFixed(2));
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
    if (tipo && serieEquipo) this.controlalerts(tipo, msj, colorbg, serieEquipo);
    return colorClass;
  }

  filterEquipos(): void {
    if (this.selectedClienteId == 'todoCliente') {
      this.listaEsquipo = this.listaEsquipoGhost.filter((item: any) =>
        item.serieEquipo.toString().toLowerCase().includes(this.filterequip.toLowerCase()) ||
        item.tipoMaquinaria.toString().toLowerCase().includes(this.filterequip.toLowerCase()) ||
        item.provincia.toString().toLowerCase().includes(this.filterequip.toLowerCase()) ||
        item.nombreTienda.toLowerCase().includes(this.filterequip.toLowerCase())
      )
    } else {
      this.listaEsquipo = this.listaEsquipoGhost.filter((item: any) =>
        (item.serieEquipo.toString().toLowerCase().includes(this.filterequip.toLowerCase()) ||
          item.tipoMaquinaria.toString().toLowerCase().includes(this.filterequip.toLowerCase()) ||
          item.provincia.toString().toLowerCase().includes(this.filterequip.toLowerCase()) ||
          item.nombreTienda.toLowerCase().includes(this.filterequip.toLowerCase())) &&
        item.idCliente == this.selectedClienteId
      )
    }
  }

  filterCliente(idCliente: any, nameCliente: any) {
    this.filterequip = '';
    this.selectedCliente = nameCliente;
    this.selectedClienteId = idCliente;
    this.updateListaEsquipo();
    this.eliminarAllAlerts();
    if (this.selectedClienteId == 'todoCliente') {
      this.estadosMonitoreo[0].count = this.listaEsquipoGhost.filter((item: any) => item.estadoPing == 1).length;
      this.estadosMonitoreo[1].count = this.listaEsquipoGhost.filter((item: any) => item.estadoPing == 0).length;
      this.estadosMonitoreo[2].count = this.listaEsquipoGhost.filter((item: any) => this.calcularTiempoDesdeAhora(this.numHorasAlertTrans, item.fechaUltimaTrans)).length;
    } else {
      this.estadosMonitoreo[0].count = this.listaEsquipoGhost.filter((item: any) => item.idCliente === this.selectedClienteId && item.estadoPing == 1).length;
      this.estadosMonitoreo[1].count = this.listaEsquipoGhost.filter((item: any) => item.idCliente === this.selectedClienteId && item.estadoPing == 0).length;
      this.estadosMonitoreo[2].count = this.listaEsquipoGhost.filter((item: any) => item.idCliente === this.selectedClienteId && this.calcularTiempoDesdeAhora(this.numHorasAlertTrans, item.fechaUltimaTrans)).length;
    }
    if (this.selectedMonitoreo == 'Online') this.selectedCount = this.estadosMonitoreo[0].count;
    if (this.selectedMonitoreo == 'Offline') this.selectedCount = this.estadosMonitoreo[1].count;
    if (this.selectedMonitoreo == 'E. Transaccional') this.selectedCount = this.estadosMonitoreo[2].count;
  }

  filterMonitoreo(estado: any, color: any, count: any) {
    this.filterequip = '';
    this.selectedMonitoreo = estado;
    this.selectedMonitoreoColor = color;
    this.selectedCount = count;
    this.updateListaEsquipo();
  }

  updateListaEsquipo() {
    let color: any;
    if (this.selectedClienteId === 'todoCliente') {
      if (this.selectedMonitoreo === 'Mostrar todo') {
        this.listaEsquipo = this.listaEsquipoGhost;
      } else {
        if (this.selectedMonitoreo === 'Online' || this.selectedMonitoreo === 'Offline') {
          color = this.selectedMonitoreo === 'Online' ? 1 : 0;
          this.listaEsquipo = this.listaEsquipoGhost.filter((item: any) => item.estadoPing === color);
        }
        if (this.selectedMonitoreo === 'E. Transaccional') {
          this.listaEsquipo = this.listaEsquipoGhost.filter((item: any) => this.calcularTiempoDesdeAhora(this.numHorasAlertTrans, item.fechaUltimaTrans));
        }
      }
    } else {
      if (this.selectedMonitoreo === 'Mostrar todo') {
        this.listaEsquipo = this.listaEsquipoGhost.filter((item: any) => item.idCliente === this.selectedClienteId);
      } else {
        if (this.selectedMonitoreo === 'Online' || this.selectedMonitoreo === 'Offline') {
          color = this.selectedMonitoreo === 'Online' ? 1 : 0;
          this.listaEsquipo = this.listaEsquipoGhost.filter((item: any) => item.idCliente === this.selectedClienteId && item.estadoPing === color);
        }
        if (this.selectedMonitoreo === 'E. Transaccional') {
          this.listaEsquipo = this.listaEsquipoGhost.filter((item: any) => item.idCliente === this.selectedClienteId && this.calcularTiempoDesdeAhora(this.numHorasAlertTrans, item.fechaUltimaTrans));
        }
      }
    }
  }

  alertHub(dataPingHub: any) {
    this.updatePing(dataPingHub);
    if (this.contadorPing >= this.numTopNotification) {
      let equiposNow = (this.selectedClienteId === 'todoCliente') ? this.listaEsquipoGhost : this.listaEsquipoGhost.filter((item: any) => { return item.idCliente === this.selectedClienteId });
      for (let item of equiposNow) {
        this.alertTrans(item);
        this.alertTimeSincro(item);
      }
      this.contadorPing = 0;
      this.fechaNotif = this.fechaActual.getTime();
      this.playAudio();
    }
    if (this.contadorPing === 25 || this.contadorPing === 50 ||
      this.contadorPing === 75 || this.contadorPing === 98) {
      this.equiposerv.obtenerHoraActual().subscribe({
        next: (data: any) => this.fechaActual = new Date(data),
        error: (e) => console.error('Error obteniendo la hora actual:', e),
        complete: () => {
          const arrOnline = [];
          const arrOffline = [];
          const arrMaqError = [];
          for (const element of this.listaEsquipo) {
            let validarhora = this.calcularTiempoDesdeAhora(this.numHorasAlertTrans, element.fechaUltimaTrans);
            if (element.estadoPing === 1) arrOnline.push(element);
            if (element.estadoPing === 0) arrOffline.push(element);
            if (validarhora) arrMaqError.push(element);
          }
          this.estadosMonitoreo[0].count = arrOnline.length;
          this.estadosMonitoreo[1].count = arrOffline.length;
          this.estadosMonitoreo[2].count = arrMaqError.length;
        }
      });
    }
    this.contadorPing++;
    // console.log(this.contadorPing);
  }

  private updatePing(data: any) {
    const syncTime = new Date(data.tiempoSincronizacion);
    for (let equipo of this.listaEsquipo) {
      if (equipo.ipEquipo === data.ip) {
        equipo.estadoPing = data.estadoPing;
        equipo.tiempoSincronizacion = data.tiempoSincronizacion;
      } else {
        const dateEquipo = new Date(equipo.tiempoSincronizacion);
        const diffInMinutes = (syncTime.getTime() - dateEquipo.getTime()) / 60000;
        if (diffInMinutes >= 5) equipo.estadoPing = 0;
      }
    }
  }

  alertTrans(item: any) {
    let validarhora = this.calcularTiempoDesdeAhora(this.numHorasAlertTrans, item.fechaUltimaTrans);
    if (validarhora) {
      let tipo = 'Monitoreo Trans TimeSincro';
      let msj = 'No se ha realizado transacciones en ' + this.numHorasAlertTrans + 'h';
      let colorbg = 'red';
      let serie = item.serieEquipo;
      this.controlalerts(tipo, msj, colorbg, serie);
    }
  }

  alertTimeSincro(item: any) {
    let newMesj = `Ha estado desactivado por más de ${this.numHorasAlertTimeSincro}h`;
    let alerta: any;
    let validateTimeSincro = this.calcularTiempoDesdeAhora(this.numHorasAlertTimeSincro, item.tiempoSincronizacion);
    if (validateTimeSincro) {
      alerta = this.listalertas.find((itemAlerta: any) =>
        itemAlerta.tipo === 'Monitoreo Trans TimeSincro' &&
        itemAlerta.nserie === item.serieEquipo
      );
      if (alerta) {
        let arrayMsj = newMesj.split(" ");
        let validateMsj = arrayMsj.every(palabra => alerta.msj.includes(palabra));
        if (!validateMsj) alerta.msj = alerta.msj + '\n' + newMesj;
      }
      let tipo = 'Monitoreo Trans TimeSincro';
      let msj = newMesj;
      let colorbg = 'red';
      let serie = item.serieEquipo;
      this.controlalerts(tipo, msj, colorbg, serie);
    }
  }

  calcularTiempoDesdeAhora(horas: any, date: any): boolean {
    const fecha = new Date(date);
    const diferenciaEnMilisegundos = this.fechaActual.getTime() - fecha.getTime();
    const diferenciaEnHoras = diferenciaEnMilisegundos / (1000 * 60 * 60);
    return diferenciaEnHoras > horas;
  }

  eliminarAlerta(i: number) {
    this.listalertas.splice(i, 1);
    this.nuevoObjectalerts.splice(i, 1);
  }

  eliminarAllAlerts() {
    this.listalertas.splice(0);
    this.nuevoObjectalerts.splice(0);
  }

  getColor(estadoPing: any) {
    if (estadoPing === 1) return 'GREEN';
    if (estadoPing === 0) return 'RED';
    return estadoPing;
  }

  getTipoTrans(tipoTrans: any) {
    if (tipoTrans == 'A') return 'Automático';
    if (tipoTrans == 'M') return 'Manual';
    if (tipoTrans == 'R') return 'Retiro';
    return tipoTrans;
  }

  getClientes() {
    this.clienteService.ObtenerClienteSelect().subscribe({
      next: (cliente) => this.listaCliente = cliente,
      error: (e) => console.error(e),
      complete: () => this.obtenerFechaActual()
    })
  }

  obtenerFechaActual() {
    this.equiposerv.obtenerHoraActual().subscribe({
      next: (data: any) => this.fechaActual = new Date(data),
      error: (e) => console.error('Error obteniendo la hora actual:', e),
      complete: () => this.obtenerEquiposMoneq()
    });
  }
}