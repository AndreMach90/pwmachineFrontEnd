import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor( private env: Environments, private http: HttpClient ) { }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
  }

  guardarClientes( model:any[] ) {
    return this.http.post(this.env.apiurl() + 'Cliente/GuardarCliente', model, { headers: this.headers });
  }

  actualizarCliente (model:any[]) {
    return this.http.put( this.env.apiurl()+'Cliente/ActualizarCliente', model, { headers: this.headers } );
  }

  obtenerCliente() {    
    return this.http.get( this.env.apiurl()+'Cliente/obtenerCliente', { headers: this.headers });
  }

  ObtenerClienteSelect() {
    return this.http.get( this.env.apiurl()+'Cliente/ObtenerClienteSelect', { headers: this.headers });
  }

  obtenerCuentaCliente(id:number) {
    return this.http.get( this.env.apiurl()+'Cliente/ObtenerCuentaCliente/'+id, { headers: this.headers });
  }

  obtenerCuentaTransacCant(id:number) {
    return this.http.get( this.env.apiurl()+'Cuenta/NTransacciones/'+id, { headers: this.headers });
  }

  eliminarCliente( codigoCliente:string ) {
    return this.http.delete( this.env.apiurl() + 'Cliente/BorrarCliente/' + codigoCliente, { headers: this.headers } );
  }
}
