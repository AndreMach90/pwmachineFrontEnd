import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginService } from '../login/services/login.service';
import { Router } from '@angular/router';
import { Environments } from '../environments/environments';
import jwt_decode from 'jwt-decode';
import { EncryptService } from '../shared/services/encrypt.service';
import Swal from 'sweetalert2'
import { SharedService } from '../shared/services/shared.service';
@Component({
  selector: 'app-dahsboards',
  templateUrl: './dahsboards.component.html',
  styleUrls: ['./dahsboards.component.scss'],
})

export class DahsboardsComponent implements OnInit {
  @Output() estadointerfaz: any = new EventEmitter();
  // modimagen: any = this.env.apiUrlIcon() + 'modulos.png';
  moduloEmitter: any;
  width_menu: any = '250px';
  show_usuarios: boolean = false;
  show_tiendas: boolean = false;
  show_clientes: boolean = false;
  show_equipo: boolean = false;
  show_home: boolean = true;
  show_monitorear_equipo: boolean = false;
  constructor(
    private ncrypt: EncryptService,
    private log: LoginService,
    private router: Router,
    private env: Environments,
    private shar:       SharedService
  ) {}

  primary: any;
  secondary: any;
  secondary_a: any;
  secondary_b: any;
  show_monit_equip: boolean = false;
  namemodulo: string = 'Home';
  iconmodulo: any = '';
  nameidentifier: any;
  sub: any;
  name: any;
  role: any;
  authorizationdecision: any;
  exp: any;
  iss: any;
  aud: any;
  usuario: any;
  monitor: boolean = false;

  estadow: boolean = true;
  height_app: any = '100vh';

  horaCierre: any;

  ngOnInit(): void {
    this.namemodulo = 'Home';
    this.validateSesion();
    this.obtenerIndicadoresHomeMenu();
    let xuser: any = sessionStorage.getItem('usuario');
    this.usuario = xuser;
    let xtoken: any = sessionStorage.getItem('token');
    const xtokenDecript: any = this.ncrypt.decryptWithAsciiSeed(xtoken, this.env.es, this.env.hash);

    if (xtokenDecript != null || xtokenDecript != undefined) {
      var decoded: any = jwt_decode(xtokenDecript);
      this.sub = decoded['sub'];
      this.nameidentifier = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      this.name = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      this.role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      this.authorizationdecision = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision'];
      this.exp = decoded['exp'];
      this.iss = decoded['iss'];
      this.aud = decoded['aud'];
      this.horaCierre = this.convertTimestampToReadableDate(this.exp);

      const rolEncrypt: any = this.ncrypt.encryptWithAsciiSeed(this.role, this.env.es, this.env.hash);
      sessionStorage.setItem('PR', rolEncrypt);
      if (this.role == 'R003') {
        this.router.navigate(['moneq']);
      }

      this.startSessionTimer(this.exp);
    }

    this.primary = this.env.appTheme.colorPrimary;
    this.secondary = this.env.appTheme.colorSecondary_C;
    this.secondary_a = this.env.appTheme.colorSecondary_A;
    this.secondary_b = this.env.appTheme.colorSecondary_B;

    let xmodulo: any = localStorage.getItem('modulo');
    let xicono: any = localStorage.getItem('iconmodulo');
    this.iconmodulo = xicono;

    let arrmodulo = { nombre: xmodulo };
    this.recibirModulo(arrmodulo);
  }

  listaHomeMenu: any = [];
  obtenerIndicadoresHomeMenu() {
    this.shar.getIndicadoresHome().subscribe({
      next: (x) => {
        // console.log('BOTONES HOME');
        // console.log(x);
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
          { 'tipo': 'Cerrar Sesión', 'icon': 'power_settings_new', 'width': '350px !important' },
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
  
  convertTimestampToReadableDate(timestamp: number): string {
    // Convertir el timestamp a milisegundos
    const date = new Date(timestamp * 1000);

    // Formatear la fecha a una cadena legible
    const readableDate = date.toLocaleString();

    return readableDate;
  }

  /** TOKEN NO TOCAR [EXPIRACION SESION] */
  startSessionTimer(exp: number): void {
    const currentTime = Math.floor(Date.now() / 1000); // Obtener el tiempo actual en segundos
    const timeUntilExpiration = exp - currentTime;
    const twoMinutesInSeconds = 2 * 60;

    if (timeUntilExpiration > 0) {
      if (timeUntilExpiration > twoMinutesInSeconds) {
        setTimeout(() => {
          const minutesLeft = Math.floor((exp - Math.floor(Date.now() / 1000)) / 60);
          Swal.fire({
            title:  "Sesión por expirar.",
            text:   `Por motivos de seguridad su sesión está por expirar en ${minutesLeft} minutos`,
            footer: 'Puedes volver a iniciar sesión para generar un token de sesión nuevo.',
            icon:   "warning"
          });
          setTimeout(() => {
            this.closeSession();
          }, twoMinutesInSeconds * 1000); // Esperar los dos minutos restantes
        }, (timeUntilExpiration - twoMinutesInSeconds) * 1000); // Esperar hasta que queden dos minutos
      } else {
        setTimeout(() => {
          this.closeSession();
        }, timeUntilExpiration * 1000); // Convertir a milisegundos
      }
    } else {
      this.closeSession(); // Expiró el token, cerrar la sesión inmediatamente
    }
  }

  validateSesion() {
    let xtoken: any = sessionStorage.getItem('token');
    if (xtoken == null || xtoken == undefined || xtoken == '') this.router.navigate(['login']);    
  }

  showHeadMenu:boolean = false;
  recibirDataButtonHome(event:any) {
    switch (event) {
      case 'usuarios':
        this.show_home              = false;
        this.show_usuarios          = true;
        this.show_tiendas           = false;
        this.show_clientes          = false;
        this.show_equipo            = false;
        this.show_monit_equip       = false;
        this.show_monitorear_equipo = false;
        this.showHeadMenu = true;
        break;
      case 'tiendas':
        this.show_home              = false;
        this.show_usuarios          = false;
        this.show_tiendas           = true;
        this.show_clientes          = false;
        this.show_equipo            = false;
        this.show_monit_equip       = false;
        this.show_monitorear_equipo = false;
        this.showHeadMenu = true;
        break;
      case 'clientes':
        this.show_home              = false;
        this.show_usuarios          = false;
        this.show_tiendas           = false;
        this.show_clientes          = true;
        this.show_equipo            = false;
        this.show_monit_equip       = false;
        this.show_monitorear_equipo = false;
        this.showHeadMenu = true;
        break;
      case 'equipos':
        this.show_home              = false;
        this.show_usuarios          = false;
        this.show_tiendas           = false;
        this.show_clientes          = false;
        this.show_equipo            = true;
        this.show_monit_equip       = false;
        this.show_monitorear_equipo = false;
        this.showHeadMenu           = true;
        break;
      case 'Monitorear transaccional':
        this.show_home              = false;
        this.show_usuarios          = false;
        this.show_tiendas           = false;
        this.show_clientes          = false;
        this.show_equipo            = false;
        this.show_monit_equip       = false;
        this.show_monitorear_equipo = true;
        this.showHeadMenu = true;
        break;
      case 'Monitoreo de equipos':
        this.router.navigate(['moneq']);
        break;
      case 'Reporte de datos':
        this.router.navigate(['datexport']);
        break;
      case 'Cerrar Sesión':
        this.closeSession();
        break;
    }
  }

  

  closeSession() {
    sessionStorage.removeItem('token');
    let xtoken: any = sessionStorage.getItem('token');
    if (xtoken == undefined || xtoken == null || xtoken == '') {
      this.router.navigate(['login']);
    }
  }

  goToHome() {
    this.router.navigate(['dashboard']);
    this.show_home = true;
    this.showHeadMenu = false;
    this.show_usuarios = false;
    this.show_tiendas = false;
    this.show_clientes = false;
    this.show_equipo = false;
  }

  emitEstado(estado: any) {
    this.estadointerfaz.emit(estado);
  }

  controlWidth() {
    switch (this.estadow) {
      case true:
        this.width_menu = '50px';
        this.height_app = '100vh';
        this.estadow = false;
        this.emitEstado(this.estadow);
        break;
      case false:
        this.width_menu = '250px';
        this.estadow = true;
        this.height_app = '90vh';
        this.emitEstado(this.estadow);
        break;
    }
  }

  recibirModulo(modulo: any) {
    this.moduloEmitter = modulo;
    this.namemodulo = ' ' + this.moduloEmitter.nombre;
    this.iconmodulo = this.moduloEmitter.icono;
    switch (this.moduloEmitter.nombre) {
      case 'Home':
        this.show_home        = true;
        this.show_usuarios    = false;
        this.show_tiendas     = false;
        this.show_clientes    = false;
        this.show_equipo      = false;
        this.show_monit_equip = false;
        this.showHeadMenu = false;
        break;
      case 'Usuarios':
        this.show_home        = false;
        this.show_usuarios    = true;
        this.show_tiendas     = false;
        this.show_clientes    = false;
        this.show_equipo      = false;
        this.show_monit_equip = false;
        this.showHeadMenu = true;
        break;
      case 'Tienda':
        this.show_home        = false;
        this.show_usuarios    = false;
        this.show_tiendas     = true;
        this.show_clientes    = false;
        this.show_equipo      = false;
        this.show_monit_equip = false;
        this.showHeadMenu = true;
        break;
      case 'Cliente':
        this.show_home        = false;
        this.show_usuarios    = false;
        this.show_tiendas     = false;
        this.show_clientes    = true;
        this.show_equipo      = false;
        this.show_monit_equip = false;
        this.showHeadMenu = true;
        break;
      case 'Equipo':
        this.show_home        = false;
        this.show_usuarios    = false;
        this.show_tiendas     = false;
        this.show_clientes    = false;
        this.show_equipo      = true;
        this.show_monit_equip = false;
        this.showHeadMenu = true;
        break;
      case 'Monitoreo de Equipos':
        this.show_home        = false;
        this.show_usuarios    = false;
        this.show_tiendas     = false;
        this.show_clientes    = false;
        this.show_equipo      = false;
        this.show_monit_equip = true;
        this.showHeadMenu = true;
        break;
      case 'Cerrar Sesión':
        this.closeSession();
        break;
    }
  }
}
