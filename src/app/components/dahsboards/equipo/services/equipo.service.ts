import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})

export class EquipoService {
  constructor( private env: Environments, private http: HttpClient ) { }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
  }

  obtenerModelo( codtipomaq: any, codmarca: any ) {
    return this.http.get( this.env.apiurl() + 'MarcaModeloEquipo/ObtenerModelo/' + codtipomaq + '/' + codmarca, { headers: this.headers } );
  }

  obtenerMarca( codtipomaq:string ) {
    console.log(codtipomaq);
    
    return this.http.get( this.env.apiurl() + 'MarcaModeloEquipo/ObtenerMarca/' + codtipomaq, { headers: this.headers } );
  }

  guardarEquipo(model: any []) {
    return this.http.post(this.env.apiurl() + 'Equipo/GuardarEquipo', model, { headers: this.headers });
  }

  actualizarEquipo( id:number, model:any [] ) {
    return this.http.put(this.env.apiurl() + 'Equipo/ActualizarEquipo/' + id, model, { headers: this.headers });
  }

  obtenerEquipo() {
    return this.http.get(this.env.apiurl() + 'Equipo/ObtenerEquipo', { headers: this.headers });
  }

  obtenerEquipoMoneq() {
    return this.http.get(this.env.apiurl() + 'Equipo/ObtenerEquipoMoneq', { headers: this.headers });
  }

  obtenerTotalesMoneq(machine_sn: any) {
    return this.http.get(this.env.apiurl() + 'Equipo/ObtenerTotalesMoneq/' + machine_sn, { headers: this.headers });
  }

  obtenerEquipoConteoTran( option:any, model:any [] ) {
    return this.http.post(this.env.apiurl() + 'EquiposNoTransaccion/Conteo/'+option, model, { headers: this.headers });
  }

  eliminarEquipos(id:number) {
    return this.http.delete(this.env.apiurl() + 'Equipo/BorrarEquipo/'+id, { headers: this.headers });
  }

  obtenerUsuariosTemporales(ip:string) {
    return this.http.get( this.env.apiurl() + 'UsuarioTemporal/Usuario/'+ip, { headers: this.headers } )
  }

  obtenerUsuariosIp(ip:string) {
    console.log(ip);
    return this.http.get( this.env.apiurl() + 'Usuario/ObtenerUsuarioIP/'+ip, { headers: this.headers })
  }

  eliminarUsuarioTemporal(id:number) {
    return this.http.get( this.env.apiurl() + 'UsuarioTemporal/UsuarioDelete/' + id, { headers: this.headers });
  } 

  obtenerIPEquipos() {
    return this.http.get( this.env.apiurl() + 'Equipo/EquipoNuevo', { headers: this.headers });
  }

  activarEquipo (id: number) {
    return this.http.put( this.env.apiurl() + 'Equipo/ActivarEquipo/' + id, id, { headers: this.headers });
  }
}
