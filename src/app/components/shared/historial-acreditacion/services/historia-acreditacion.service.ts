import { HttpClient } from '@angular/common/http';
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
    return this.http.get( this.env.apiurl() + 'Acreeditacion/GenerarCard' );
  }

  obtenerAcreditadasTran(model:any []) {
    return this.http.post( this.env.apiurl() + 'Acreeditacion/GenerarCardAcreeditadasFiltro', model );
  }

  obtenerEquiposAcreditados( data:string ) {
    return this.http.get( this.env.apiurl() + 'Acreeditacion/GenerarTransacciones/' + data );
  }

  actualizarEquiposAcreditados(nombreArchivo:any) {
    return this.http.get( this.env.apiurl() + 'Acreeditacion/AprobacionTransacciones/' + nombreArchivo );
  }

  cancelarEquiposAcreditados(nombreArchivo:any) {
    console.warn(this.env.apiurl() + 'Acreeditacion/BorrarTransacciones/' + nombreArchivo);
    return this.http.delete( this.env.apiurl() + 'Acreeditacion/BorrarTransacciones/' + nombreArchivo );
  }

}
