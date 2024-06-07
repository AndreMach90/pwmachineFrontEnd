import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  constructor( private http: HttpClient, private env: Environments ) { }

  obtenerIndicadores(idTienda:string, tp: number) {
    // return this.http.get(this.env.apiurl() + 'Indicadores/ObtenerIndicadores/'+ idTienda + '/' + tp );
    const apiUrl = this.env.apiurl() + 'Indicadores/ObtenerIndicadores/'+ idTienda + '/' + tp;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }

  obtenerDetalleEquipos(idmaquina:string) {
    // return this.http.get(this.env.apiurl() + 'EquipoDetalle/ObtenerDetalle/'+ idmaquina );
    const apiUrl = this.env.apiurl() + 'EquipoDetalle/ObtenerDetalle/'+ idmaquina;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }

  obtenerValorUnico(idmaquina:string) {
    // return this.http.get(this.env.apiurl() + 'CalculoTotal/Calculo/'+ idmaquina );
    const apiUrl = this.env.apiurl() + 'CalculoTotal/Calculo/'+ idmaquina;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }

  guardarErroralerts(model:any []) {
    return this.http.post( this.env.apiurl() + 'alertError/GuardarErroralert', model );
  }
}
