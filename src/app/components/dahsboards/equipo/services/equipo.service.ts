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
    return this.http.get( this.env.apiurl() + 'MarcaModeloEquipo/ObtenerModelo/' + codtipomaq + '/' + codmarca );
  }

  obtenerMarca( codtipomaq:string ) {
    return this.http.get( this.env.apiurl() + 'MarcaModeloEquipo/ObtenerMarca/' + codtipomaq );
  }

  guardarEquipo(model: any []) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(this.env.apiurl() + 'Equipo/GuardarEquipo', model, { headers });
  }

  actualizarEquipo( id:number, model:any [] ) {
    return this.http.put(this.env.apiurl() + 'Equipo/ActualizarEquipo/' + id, model);
  }

  obtenerEquipo( tp:number, ctienda:string ) {
    return this.http.get(this.env.apiurl() + 'Equipo/ObtenerEquipo/'+ tp + '/' + ctienda);
  }

  obtenerEquipoConteoTran( option:any, model:any [] ) {
    return this.http.post(this.env.apiurl() + 'EquiposNoTransaccion/Conteo/'+option, model);
  }

  eliminarEquipos(id:number) {
    return this.http.delete(this.env.apiurl() + 'Equipo/BorrarEquipo/'+id);
  }

  obtenerUsuariosTemporales(ip:string) {
    return this.http.get( this.env.apiurl() + 'UsuarioTemporal/Usuario/'+ip )
  }

  obtenerUsuariosIp(ip:string) {
    return this.http.get( this.env.apiurl() + 'Usuario/ObtenerUsuarioIP/'+ip )
  }

  eliminarUsuarioTemporal(id:number) {
    return this.http.get( this.env.apiurl() + 'UsuarioTemporal/UsuarioDelete/' + id );
  } 

  obtenerIPEquipos() {
    return this.http.get( this.env.apiurl() + 'Equipo/EquipoNuevo' );
  }

  

}
