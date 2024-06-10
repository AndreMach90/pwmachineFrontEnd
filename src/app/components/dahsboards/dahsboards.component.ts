import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LoginService } from '../login/services/login.service';
import { Router } from '@angular/router';
import { Environments } from '../environments/environments';
import jwt_decode from 'jwt-decode';
import { EncryptService } from '../shared/services/encrypt.service';

@Component({
  selector: 'app-dahsboards',
  templateUrl: './dahsboards.component.html',
  styleUrls: ['./dahsboards.component.scss'],
})

export class DahsboardsComponent implements OnInit, OnChanges {
  @Output() estadointerfaz: any = new EventEmitter();
  modimagen: any = this.env.apiUrlIcon() + 'modulos.png';
  moduloEmitter: any;
  width_menu: any = '250px';
  show_usuarios: boolean = false;
  show_tiendas: boolean = false;
  show_clientes: boolean = false;
  show_equipo: boolean = false;
  show_home: boolean = true;
  constructor(
    private ncrypt: EncryptService,
    private log: LoginService,
    private router: Router,
    private env: Environments
  ) {}

  primary: any;
  secondary: any;
  secondary_a: any;
  secondary_b: any;
  show_monit_equip: boolean = false;
  namemodulo: any = '';
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

  tpsend: any;
  ngOnChanges(changes: SimpleChanges): void {
      if(changes) {
        console.log('TPSEND')
        console.log(this.tpsend)
      }
  }

  ngOnInit(): void {
    this.validateSesion();
    let xuser: any = sessionStorage.getItem('usuario');
    this.usuario = xuser;
    let xtoken: any = sessionStorage.getItem('token');
    const xtokenDecript: any = this.ncrypt.decryptWithAsciiSeed(
      xtoken,
      this.env.es,
      this.env.hash
    );
    if (xtokenDecript != null || xtokenDecript != undefined) {
      var decoded: any = jwt_decode(xtokenDecript);
      this.sub = decoded['sub'];
      this.nameidentifier =
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ];
      this.name =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      this.role =
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      this.authorizationdecision =
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision'
        ];
      this.exp = decoded['exp'];
      this.iss = decoded['iss'];
      this.aud = decoded['aud'];
      const rolEncrypt: any = this.ncrypt.encryptWithAsciiSeed(
        this.role,
        this.env.es,
        this.env.hash
      );
      sessionStorage.setItem('PR', rolEncrypt);
      if (this.role == 'R003') {
        this.router.navigate(['moneq']);
      }
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

  validateSesion() {
    let xtoken: any = sessionStorage.getItem('token');
    if (xtoken == null || xtoken == undefined || xtoken == '') {
      this.router.navigate(['login']);
    }
  }

  closeSession() {
    sessionStorage.removeItem('token');
    let xtoken: any = sessionStorage.getItem('token');
    if (xtoken == undefined || xtoken == null || xtoken == '') {
      this.router.navigate(['login']);
    }
  }

  emitEstado(estado: any) {
    this.estadointerfaz.emit(estado);
  }

  estadow: boolean = true;
  height_app: any = '100vh';
  controlWidth() {

    this.tpsend = 1;

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
        this.show_home = true;
        this.show_usuarios = false;
        this.show_tiendas = false;
        this.show_clientes = false;
        this.show_equipo = false;
        this.show_monit_equip = false;
        break;
      case 'Usuarios':
        this.show_home = false;
        this.show_usuarios = true;
        this.show_tiendas = false;
        this.show_clientes = false;
        this.show_equipo = false;
        this.show_monit_equip = false;
        break;
      case 'Tienda':
        this.show_home = false;
        this.show_usuarios = false;
        this.show_tiendas = true;
        this.show_clientes = false;
        this.show_equipo = false;
        this.show_monit_equip = false;
        break;
      case 'Cliente':
        this.show_home = false;
        this.show_usuarios = false;
        this.show_tiendas = false;
        this.show_clientes = true;
        this.show_equipo = false;
        this.show_monit_equip = false;
        break;
      case 'Equipo':
        this.show_home = false;
        this.show_usuarios = false;
        this.show_tiendas = false;
        this.show_clientes = false;
        this.show_equipo = true;
        this.show_monit_equip = false;
        break;
      case 'Monitoreo de Equipos':
        this.show_home = false;
        this.show_usuarios = false;
        this.show_tiendas = false;
        this.show_clientes = false;
        this.show_equipo = false;
        this.show_monit_equip = true;
        break;
    }
  }
}
