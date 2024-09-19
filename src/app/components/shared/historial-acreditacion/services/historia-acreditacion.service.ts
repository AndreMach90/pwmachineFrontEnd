import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HistoriaAcreditacionService {

  constructor( private env: Environments, private http: HttpClient ) { }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
  }

  guardarHistorialAcreditacion(model:any[]) {
    return this.http.post( this.env.apiurl() + 'TransAcreditada/GuardarTransacciones', model, { headers: this.headers } );
  }

  obtenerPreAcreditacion() {
    return this.http.get( this.env.apiurl() + 'Acreeditacion/GenerarCard', { headers: this.headers } );
  }

  obtenerAcreditadasTran(model:any []) {
    return this.http.post( this.env.apiurl() + 'Acreeditacion/GenerarCardAcreeditadasFiltro', model, { headers: this.headers } );
  }

  obtenerEquiposAcreditados( data:string ) {
    return this.http.get( this.env.apiurl() + 'Acreeditacion/GenerarTransacciones/' + data, { headers: this.headers } );
  }

  actualizarEquiposAcreditados(nombreArchivo:any) {
    return this.http.get( this.env.apiurl() + 'Acreeditacion/AprobacionTransacciones/' + nombreArchivo, { headers: this.headers } );
  }

  cancelarEquiposAcreditados(nombreArchivo:any) {
    return this.http.delete( this.env.apiurl() + 'Acreeditacion/BorrarTransacciones/' + nombreArchivo, { headers: this.headers } );
  }
}
