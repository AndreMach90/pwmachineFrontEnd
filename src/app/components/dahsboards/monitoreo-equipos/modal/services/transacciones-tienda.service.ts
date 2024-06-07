import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesTiendaService {

  constructor( private env: Environments, private http: HttpClient ) { }
  // Transacciones/ObtenerTransacciones/
  obtenerTransaccionesTienda(id:any, tp: number) {
    // return this.http.get( this.env.apiurl()+'Transacciones/ObtenerTransacciones/'+id + '/' + tp );
    const apiUrl = this.env.apiurl() + 'Transacciones/ObtenerTransacciones/'+id + '/' + tp;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }

  filtroTransaccionesRango( model:any [] ) {
    return this.http.post( this.env.apiurl() + 'FiltroFechas/Filtrar', model );
  }

  GuardarTransaccionesAcreditadas( model:any [] ) {
    return this.http.post( this.env.apiurl() + 'TransAcreditada/GuardarTransacciones', model );
  }

  ObtenerEquiposSaldo( machineSn: any ) {
    // return this.http.get( this.env.apiurl() + 'EquipoDetalle/ObtenerTotales/' + machineSn );
    const apiUrl = this.env.apiurl() + 'EquipoDetalle/ObtenerTotales/' + machineSn;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }  
}
