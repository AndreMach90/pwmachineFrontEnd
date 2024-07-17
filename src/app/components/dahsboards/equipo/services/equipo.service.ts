import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})

export class EquipoService {

  constructor( private env: Environments, 
               private http: HttpClient ) { }

  obtenerModelo( codtipomaq: any, codmarca: any ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl() + 'MarcaModeloEquipo/ObtenerModelo/' + codtipomaq + '/' + codmarca, { headers } );
  }

  obtenerMarca( codtipomaq:string ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl() + 'MarcaModeloEquipo/ObtenerMarca/' + codtipomaq, { headers } );
  }

  guardarEquipo(model: any []) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(this.env.apiurl() + 'Equipo/GuardarEquipo', model, { headers });
  }

  actualizarEquipo( id:number, model:any [] ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.put(this.env.apiurl() + 'Equipo/ActualizarEquipo/' + id, model, { headers });
  }

  obtenerEquipo( tp:number, ctienda:string ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(this.env.apiurl() + 'Equipo/ObtenerEquipo/'+ tp + '/' + ctienda, { headers });
  }

  obtenerEquipoConteoTran( option:any, model:any [] ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(this.env.apiurl() + 'EquiposNoTransaccion/Conteo/'+option, model, { headers });
  }

  eliminarEquipos(id:number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete(this.env.apiurl() + 'Equipo/BorrarEquipo/'+id, { headers });
  }

  obtenerUsuariosTemporales(ip:string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl() + 'UsuarioTemporal/Usuario/'+ip, { headers } )
  }

  obtenerUsuariosIp(ip:string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl() + 'Usuario/ObtenerUsuarioIP/'+ip, { headers } )
  }

  eliminarUsuarioTemporal(id:number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl() + 'UsuarioTemporal/UsuarioDelete/' + id, { headers } );
  } 

  obtenerIPEquipos() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl() + 'Equipo/EquipoNuevo', { headers } );
  }

  activarEquipo (id: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.put( this.env.apiurl() + 'Equipo/ActivarEquipo/' + id, id, { headers });
  } 

}
