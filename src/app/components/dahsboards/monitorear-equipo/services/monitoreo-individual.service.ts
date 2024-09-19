import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})

export class MonitoreoIndividualService {

  constructor( private env: Environments, private http: HttpClient ) { }

  obtenerEquiposCliente( codcli:any ) {    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(this.env.apiurl() + 'Equipo/EquipoLista/' + codcli, { headers });
  }

}
