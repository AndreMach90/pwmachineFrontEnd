import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {

  constructor( private env: Environments, private http: HttpClient ) { }

  obtenerGraficaCollection(nserie:string) {
    return this.http.get( this.env.apiurl() + 'Grafico/ObtenerEquipo/' + nserie );
  }


}
