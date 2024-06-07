import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor( private env: Environments, 
               private http: HttpClient ) { }

  guardarUsuarios( model:any[] ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.env.apiurl() + 'Usuario/GuardarUsuario', model, { headers });

  }

  guardarUsuariosPortal( model:any[] ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.env.apiurl() + 'UsuarioPortal/GuardarUsuario', model, { headers });

  }

  obtenerUsuarios() {
    // return this.http.get( this.env.apiurl() + 'Usuario/ObtenerUsuario' );
    const apiUrl = this.env.apiurl() + 'Usuario/ObtenerUsuario';
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }

  obtenerUsuariosPortal() {
    // return this.http.get( this.env.apiurl() + 'UsuarioPortal/ObtenerUsuario' );
    const apiUrl = this.env.apiurl() + 'UsuarioPortal/ObtenerUsuario';
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }

  actualizarUsuario( id:number,  model:any []) {
    return this.http.put( this.env.apiurl() + 'Usuario/ActualizarUsuario/' + id, model );
  } 

  actualizarUsuarioPortal ( id:number, model:any [] ) {
    return this.http.put( this.env.apiurl() + 'UsuarioPortal/ActualizarUsuario/' + id, model );
  }
  
  actualizarDatosPersonales( id:number, model:any [] ) {
    return this.http.put( this.env.apiurl() + 'Usuario/ActualizarDatosPersonales/' + id, model );
  }

  deleteUsuario( id:number ) {
    return this.http.delete( this.env.apiurl()+ 'Usuario/BorrarUsuario/' + id );
  }

  deleteUsuarioPortal( id:number ) {
    return this.http.delete( this.env.apiurl()+ 'UsuarioPortal/BorrarUsuario/' + id );
  }
}
