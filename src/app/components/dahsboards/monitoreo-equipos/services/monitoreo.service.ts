import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  constructor( private http: HttpClient, private env: Environments ) { }

  obtenerIndicadores(idTienda:string, tp: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(this.env.apiurl() + 'Indicadores/ObtenerIndicadores/'+ idTienda + '/' + tp, {headers} )
  }

  obtenerDetalleEquipos(idmaquina:string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(this.env.apiurl() + 'EquipoDetalle/ObtenerDetalle/'+ idmaquina, {headers} );
  }

  obtenerValorUnico(idmaquina:string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(this.env.apiurl() + 'CalculoTotal/Calculo/'+ idmaquina, {headers} );
  }

  guardarErroralerts(model:any []) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post( this.env.apiurl() + 'alertError/GuardarErroralert', model, {headers} );
  }

}
