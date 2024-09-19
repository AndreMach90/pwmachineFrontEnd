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
    return this.http.get( this.env.apiurl() + 'Usuario/ObtenerUsuario', {headers: this.headers} )
  }

  obtenerUsuariosPortal() {
    return this.http.get( this.env.apiurl() + 'UsuarioPortal/ObtenerUsuario', {headers: this.headers} )
  }

  actualizarUsuario( id:number,  model:any []) {
    return this.http.put( this.env.apiurl() + 'Usuario/ActualizarUsuario/' + id, model, {headers: this.headers} );
  } 

  actualizarUsuarioPortal ( id:number, model:any [] ) {
    return this.http.put( this.env.apiurl() + 'UsuarioPortal/ActualizarUsuario/' + id, model, {headers: this.headers} );
  }
  
  actualizarDatosPersonales( id:number, model:any [] ) {
    return this.http.put( this.env.apiurl() + 'Usuario/ActualizarDatosPersonales/' + id, model, {headers: this.headers} );
  }

  deleteUsuario( id:number ) {
    return this.http.delete( this.env.apiurl()+ 'Usuario/BorrarUsuario/' + id, {headers: this.headers} );
  }

  deleteUsuarioPortal( id:number ) {
    return this.http.delete( this.env.apiurl()+ 'UsuarioPortal/BorrarUsuario/' + id, {headers: this.headers} );
  }
}
