import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesTiendaService {

  constructor( private env: Environments, private http: HttpClient ) { }

  obtenerTransaccionesTienda(id:any, tp: number) {
    return this.http.get( this.env.apiurl()+'Transacciones/ObtenerTransacciones/'+id + '/' + tp );
  }  

  filtroTransaccionesRango( model:any [] ) {
    // console.log( this.env.apiurl() + 'FiltroFechas/Filtrar' )
    return this.http.post( this.env.apiurl() + 'FiltroFechas/Filtrar', model );
  }

  GuardarTransaccionesAcreditadas( model:any [] ) {
    return this.http.post( this.env.apiurl() + 'TransAcreditada/GuardarTransacciones', model );
  }

  ObtenerEquiposSaldo( machineSn: any ) {
    return this.http.get( this.env.apiurl() + 'EquipoDetalle/ObtenerTotales/' + machineSn );
  }

}
