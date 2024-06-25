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
    return this.http.get( this.env.apiurl()+'Cliente/obtenerCliente');
  }

  obtenerCuentaCliente(id:number) {    
    console.log(this.env.apiurl()+'Cliente/ObtenerCuentaCliente/'+id)
    return this.http.get( this.env.apiurl()+'Cliente/ObtenerCuentaCliente/'+id);
  }

  obtenerCuentaTransacCant(id:number) {    
    return this.http.get( this.env.apiurl()+'Cuenta/NTransacciones/'+id);
  }


  eliminarCliente( codigoCliente:string ) {
    return this.http.delete( this.env.apiurl() + 'Cliente/BorrarCliente/' + codigoCliente );
  }

}
