import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginService } from '../../login/services/login.service';
import { Router } from '@angular/router';
import { Environments } from '../../environments/environments';

export interface Modulo {
  nombre: string;
  icono: string;
  permiso: string;
  description: string;
  state: number
}


@Component({
  selector: 'app-navside-works',
  templateUrl: './navside-works.component.html',
  styleUrls: ['./navside-works.component.scss']
})
export class NavsideWorksComponent implements OnInit {

  @Output() modulo: EventEmitter<Modulo> = new EventEmitter<Modulo>();

  /** TEMPORAL */

  modelModules: any = [
  {
    nombre_module: 'Home',
    description_module: '',
    icon_module: this.env.apiUrlIcon()+'cliente.png',
    permison: 1,
    state: 1
  },
  {
    nombre_module: 'Cliente',
    description_module: 'Controla los clientes de la aplicación',
    icon_module: this.env.apiUrlIcon()+'cliente.png',
    permison: 1,
    state: 1
  },
  {
    nombre_module: 'Tienda',
    description_module: 'Controla las tiendas de la aplicación',
    icon_module: this.env.apiUrlIcon()+'shop.png',
    permison: 1,
    state: 1
  },
  {
    nombre_module: 'Equipo',
    description_module: 'Controla los equipos de las tiendas',
    icon_module: this.env.apiUrlIcon()+'machine.png',
    permison: 1,
    state: 1
  },
  {
  
    nombre_module: 'Usuarios',
    description_module: 'Controla los ususarios de la aplicación',
    icon_module: this.env.apiUrlIcon()+'usuarios.png',
    permison: 1,
    state: 1
  
  },
  // {
  //   nombre_module: 'Monitoreo de Equipos',
  //   description_module: 'Monitorea los estados de los equipos adquiridos por tienda ',
  //   icon_module: this.env.apiUrlIcon()+'cmachine.png',
  //   permison: 1,
  //   state: 1
  // },
]

  constructor(private log: LoginService, private router: Router, private env: Environments) {}

  primary:any;
  secondary:any;
  secondary_a:any;
  secondary_b:any;
  ngOnInit(): void {
      this.primary =  this.env.appTheme.colorPrimary;
      this.secondary = this.env.appTheme.colorSecondary_C;
      this.secondary_a = this.env.appTheme.colorSecondary_A;
      this.secondary_b = this.env.appTheme.colorSecondary_B;

      this.obtenerModulos();
  }

  obtenerModulos () {
    //////////console.warn(this.modelModules);
    return this.modelModules;
  }


botonClick(data: any) {

  // //////////console.warn(data);

    let modulo: Modulo = {
      nombre: data.nombre_module,
      icono: data.icon_module,
      permiso: data.permison,
      description: data.description_module,
      state: data.permison
    }

    localStorage.setItem('modulo',modulo.nombre);
    localStorage.setItem('iconmodulo',modulo.icono);

    this.modulo.emit(modulo)

  }

}
