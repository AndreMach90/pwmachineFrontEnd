import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})

export class ConsolidadoService {

  constructor( private env: Environments, private http: HttpClient ) { }

  obtenerConsolidado( model:any) {
    console.warn(this.env.apiurl() + 'FiltroFechas/Consolidado')
    return this.http.post( this.env.apiurl() + 'FiltroFechas/Consolidado', model );
  }

}
