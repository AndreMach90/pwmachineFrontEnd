import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CuentasBancariasService {
  constructor( private env: Environments, private http: HttpClient ) { }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
  }

  guardarCuentasBancarias( model:any[] ) {
    return this.http.post(this.env.apiurl() + 'Cuenta/GuardarCuenta', model, { headers: this.headers });
  }

  eliminarCuentaBancaria( id:number ) {
    return this.http.delete( this.env.apiurl() + 'Cuenta/BorrarCuenta/' + id, { headers: this.headers });
  }

  editarCuentaBancaria(model:any []) {
    return this.http.put( this.env.apiurl() + 'Cuenta/ActualizarCuenta', model, { headers: this.headers });
  }
}
