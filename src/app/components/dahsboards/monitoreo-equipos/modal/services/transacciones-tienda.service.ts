import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesTiendaService {
  constructor( private env: Environments, private http: HttpClient ) { }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
  }

  obtenerTransaccionesTienda(id:any, tp: number) {
    return this.http.get( this.env.apiurl()+'Transacciones/ObtenerTransacciones/'+id + '/' + tp, { headers: this.headers } );
  }  

  filtroTransaccionesRango( model:any [] ) {
    return this.http.post( this.env.apiurl() + 'FiltroFechas/Filtrar', model, { headers: this.headers } );
  }

  GuardarTransaccionesAcreditadas( model:any [] ) {
    return this.http.post( this.env.apiurl() + 'TransAcreditada/GuardarTransacciones', model, { headers: this.headers } );
  }

  ObtenerEquiposSaldo( machineSn: any ) {
    return this.http.get( this.env.apiurl() + 'EquipoDetalle/ObtenerTotales/' + machineSn, { headers: this.headers } );
  }
}
