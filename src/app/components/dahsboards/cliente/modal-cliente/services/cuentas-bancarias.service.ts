import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CuentasBancariasService {

  constructor( private env: Environments, private http: HttpClient ) { }

  guardarCuentasBancarias( model:any[] ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    //////console.warn(this.env.apiurl() + 'Cuenta/GuardarCuenta')
    return this.http.post(this.env.apiurl() + 'Cuenta/GuardarCuenta', model, { headers });
  }

  eliminarCuentaBancaria( id:number ) {
    return this.http.delete( this.env.apiurl() + 'Cuenta/BorrarCuenta/' + id );
  }

  editarCuentaBancaria(model:any []) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.put( this.env.apiurl() + 'Cuenta/ActualizarCuenta', model, {headers} );
  }

}
