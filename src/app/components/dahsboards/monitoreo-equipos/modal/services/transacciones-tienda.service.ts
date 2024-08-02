import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesTiendaService {

  constructor( private env: Environments, private http: HttpClient ) { }

  obtenerTransaccionesTienda(id:any, tp: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl()+'Transacciones/ObtenerTransacciones/'+id + '/' + tp, {headers} );
  }  

  filtroTransaccionesRango( model:any [] ) {
    // console.log( this.env.apiurl() + 'FiltroFechas/Filtrar' )
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post( this.env.apiurl() + 'FiltroFechas/Filtrar', model, {headers} );
  }

  GuardarTransaccionesAcreditadas( model:any [] ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post( this.env.apiurl() + 'TransAcreditada/GuardarTransacciones', model, {headers} );
  }

  ObtenerEquiposSaldo( machineSn: any ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl() + 'EquipoDetalle/ObtenerTotales/' + machineSn, {headers} );
  }

}
