import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ModalClienteService {

  constructor( private env: Environments, private http: HttpClient ) { }

  obtenerLocalidades( codcli:any ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl() + 'DataMaster/ObtenerDatamasterLocalidades/' + codcli, {headers} );
  }
  
  guardarLocalidades( model:any ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post( this.env.apiurl() + 'ClienteSignaLocalidad/GuardarClienteSignaTienda', model, {headers} );
  }

  obtenerLocalidadesCliente( codcli: any ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl() + 'ClienteSignaLocalidad/ObtenerLocalidades/' + codcli, {headers} );
  }

  eliminarLocalidadCliente( id:number ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete( this.env.apiurl() + 'ClienteSignaLocalidad/BorrarLocalidad/' + id, {headers} );
  }

}