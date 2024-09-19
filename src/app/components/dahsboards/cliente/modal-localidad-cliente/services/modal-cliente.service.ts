import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ModalClienteService {

  constructor( private env: Environments, private http: HttpClient ) { }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
  }

  obtenerLocalidades( codcli:any ) {
    return this.http.get( this.env.apiurl() + 'DataMaster/ObtenerDatamasterLocalidades/' + codcli, { headers: this.headers });
  }
  
  guardarLocalidades( model:any ) {
    return this.http.post( this.env.apiurl() + 'ClienteSignaLocalidad/GuardarClienteSignaTienda', model, { headers: this.headers });
  }

  obtenerLocalidadesCliente( codcli: any ) {
    return this.http.get( this.env.apiurl() + 'ClienteSignaLocalidad/ObtenerLocalidades/' + codcli, { headers: this.headers });
  }

  eliminarLocalidadCliente( id:number ) {
    return this.http.delete( this.env.apiurl() + 'ClienteSignaLocalidad/BorrarLocalidad/' + id, { headers: this.headers });
  }

}