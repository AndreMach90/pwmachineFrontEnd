import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  constructor( private http: HttpClient, private env: Environments ) { }

  obtenerIndicadores(idTienda:string, tp: number) {
    return this.http.get(this.env.apiurl() + 'Indicadores/ObtenerIndicadores/'+ idTienda + '/' + tp )
  }

  obtenerDetalleEquipos(idmaquina:string) {
    return this.http.get(this.env.apiurl() + 'EquipoDetalle/ObtenerDetalle/'+ idmaquina );
  }

  obtenerValorUnico(idmaquina:string) {
    return this.http.get(this.env.apiurl() + 'CalculoTotal/Calculo/'+ idmaquina );
  }

  guardarErroralerts(model:any []) {
    return this.http.post( this.env.apiurl() + 'alertError/GuardarErroralert', model );
  }

}
