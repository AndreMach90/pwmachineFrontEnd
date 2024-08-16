import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  constructor( private env: Environments, private http: HttpClient ) { }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
  }

  guardarUsuarios( model:any[] ) {
    return this.http.post(this.env.apiurl() + 'Usuario/GuardarUsuario', model, { headers: this.headers });
  }

  guardarUsuariosPortal( model:any[] ) {
    return this.http.post(this.env.apiurl() + 'UsuarioPortal/GuardarUsuario', model, { headers: this.headers });

  }

  obtenerUsuarios() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl() + 'Usuario/ObtenerUsuario', {headers} )
  }

  obtenerUsuariosPortal() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl() + 'UsuarioPortal/ObtenerUsuario', {headers} )
  }

  actualizarUsuario( id:number,  model:any []) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.put( this.env.apiurl() + 'Usuario/ActualizarUsuario/' + id, model, {headers} );
  } 

  actualizarUsuarioPortal ( id:number, model:any [] ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.put( this.env.apiurl() + 'UsuarioPortal/ActualizarUsuario/' + id, model, {headers} );
  }
  
  actualizarDatosPersonales( id:number, model:any [] ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.put( this.env.apiurl() + 'Usuario/ActualizarDatosPersonales/' + id, model, {headers} );
  }

  deleteUsuario( id:number ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete( this.env.apiurl()+ 'Usuario/BorrarUsuario/' + id, {headers} );
  }

  deleteUsuarioPortal( id:number ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete( this.env.apiurl()+ 'UsuarioPortal/BorrarUsuario/' + id, {headers} );
  }
}
