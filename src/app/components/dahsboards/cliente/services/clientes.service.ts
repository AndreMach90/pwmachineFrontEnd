import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor( private env: Environments, private http: HttpClient ) { }

  guardarClientes( model:any[] ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.env.apiurl() + 'Cliente/GuardarCliente', model, { headers });
  }

  actualizarCliente (model:any[]) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.put( this.env.apiurl()+'Cliente/ActualizarCliente', model, {headers} );
  }

  obtenerCliente() {    
    // return this.http.get( this.env.apiurl()+'Cliente/obtenerCliente');
    const apiUrl = this.env.apiurl() + 'Cliente/obtenerCliente';
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }

  obtenerCuentaCliente(id:number) {    
    // return this.http.get( this.env.apiurl()+'Cliente/ObtenerCuentaCliente/'+id);
    const apiUrl = this.env.apiurl() + 'Cliente/ObtenerCuentaCliente/'+id;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }

  obtenerCuentaTransacCant(id:number) {    
    // return this.http.get( this.env.apiurl()+'Cuenta/NTransacciones/'+id);
    const apiUrl = this.env.apiurl() + 'Cuenta/NTransacciones/'+id;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }

  eliminarCliente( codigoCliente:string ) {
    return this.http.delete( this.env.apiurl() + 'Cliente/BorrarCliente/' + codigoCliente );
  }
}
