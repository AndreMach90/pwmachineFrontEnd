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
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl()+'Cliente/obtenerCliente', {headers});
  }

  ObtenerClienteSelect() {    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl()+'Cliente/ObtenerClienteSelect', {headers});
  }

  obtenerCuentaCliente(id:number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl()+'Cliente/ObtenerCuentaCliente/'+id, {headers});
  }

  obtenerCuentaTransacCant(id:number) {    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    console.warn(this.env.apiurl()+'Cuenta/NTransacciones/'+id)
    return this.http.get( this.env.apiurl()+'Cuenta/NTransacciones/'+id, {headers});
  }


  eliminarCliente( codigoCliente:string ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete( this.env.apiurl() + 'Cliente/BorrarCliente/' + codigoCliente, {headers} );
  }

}
