import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HistoriaAcreditacionService {

  constructor( private env: Environments, private http: HttpClient ) { }


  guardarHistorialAcreditacion(model:any[]) {
    return this.http.post( this.env.apiurl() + 'TransAcreditada/GuardarTransacciones', model );
  }

  obtenerPreAcreditacion() {
    // return this.http.get( this.env.apiurl() + 'Acreeditacion/GenerarCard' );
    const apiUrl = this.env.apiurl() + 'Acreeditacion/GenerarCard';
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }

  obtenerAcreditadasTran(model:any []) {
    return this.http.post( this.env.apiurl() + 'Acreeditacion/GenerarCardAcreeditadasFiltro', model );
  }

  obtenerEquiposAcreditados( data:string ) {
    // return this.http.get( this.env.apiurl() + 'Acreeditacion/GenerarTransacciones/' + data );
    const apiUrl = this.env.apiurl() + 'Acreeditacion/GenerarTransacciones/' + data;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }

  actualizarEquiposAcreditados(nombreArchivo:any) {
    // return this.http.get( this.env.apiurl() + 'Acreeditacion/AprobacionTransacciones/' + nombreArchivo );
    const apiUrl = this.env.apiurl() + 'Acreeditacion/AprobacionTransacciones/' + nombreArchivo;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }

  cancelarEquiposAcreditados(nombreArchivo:any) {
    return this.http.delete( this.env.apiurl() + 'Acreeditacion/BorrarTransacciones/' + nombreArchivo );
  }
}
