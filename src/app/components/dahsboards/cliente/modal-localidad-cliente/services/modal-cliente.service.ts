import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ModalClienteService {

  constructor( private env: Environments, private http: HttpClient ) { }

  obtenerLocalidades( codcli:any ) {
    return this.http.get( this.env.apiurl() + 'DataMaster/ObtenerDatamasterLocalidades/' + codcli );
  }
  
  guardarLocalidades( model:any ) {
    return this.http.post( this.env.apiurl() + 'ClienteSignaLocalidad/GuardarClienteSignaTienda', model );
  }

  obtenerLocalidadesCliente( codcli: any ) {
    console.log(this.env.apiurl() + 'ClienteSignaLocalidad/ObtenerLocalidades/' + codcli)
    return this.http.get( this.env.apiurl() + 'ClienteSignaLocalidad/ObtenerLocalidades/' + codcli );
  }

  eliminarLocalidadCliente( id:number ) {
    return this.http.delete( this.env.apiurl() + 'ClienteSignaLocalidad/BorrarLocalidad/' + id );
  }

}