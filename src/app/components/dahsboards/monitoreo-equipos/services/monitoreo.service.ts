import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {
  constructor( private http: HttpClient, private env: Environments ) { }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
  }

  obtenerIndicadores(idTienda:string, tp: number) {
    return this.http.get(this.env.apiurl() + 'Indicadores/ObtenerIndicadores/'+ idTienda + '/' + tp, { headers: this.headers } )
  }

  obtenerDetalleEquipos(idmaquina:string) {
    return this.http.get(this.env.apiurl() + 'EquipoDetalle/ObtenerDetalle/'+ idmaquina, { headers: this.headers } );
  }

  obtenerValorUnico(idmaquina:string) {
    return this.http.get(this.env.apiurl() + 'CalculoTotal/Calculo/'+ idmaquina, { headers: this.headers } );
  }

  guardarErroralerts(model:any []) {
    return this.http.post( this.env.apiurl() + 'alertError/GuardarErroralert', model, { headers: this.headers } );
  }
}
