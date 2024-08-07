import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})

export class ConsolidadoService {

  constructor( private env: Environments, private http: HttpClient ) { }

  obtenerConsolidado( model:any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post( this.env.apiurl() + 'FiltroFechas/Consolidado', model, {headers} );
  }

}
