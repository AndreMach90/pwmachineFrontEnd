import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  constructor( private env: Environments, private http: HttpClient ) { }

  guardarTiendas( model:any[] ) {    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(this.env.apiurl() + 'tiendas/GuardarTienda', model, { headers });
  }

  obtenerTiendas() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(this.env.apiurl() + 'tiendas/ObtenerTiendasCompletas', {headers});
  }

  editarTiendas( model:any ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.put( this.env.apiurl() + 'tiendas/ActualizarTienda', model, {headers} );    
  }

  eliminarTiendas(id:number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete( this.env.apiurl() + 'tiendas/BorrarTienda/' + id, {headers} );
  }

  guardarCuentAsigna( model: any [] ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post( this.env.apiurl() + 'CuentAsigna/GuardarCuentAsigna', model, {headers} );
  }

  obtenerCuentasAsignadas(idtienda:any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get( this.env.apiurl() + 'TiendaCuenta/ObtenerTiendaCuentas/' + idtienda, {headers} );
  }

  eliminarCuentasAsignadas(id:number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete( this.env.apiurl() + 'TiendaCuenta/BorrarCuentaTienda/' + id, {headers} );
  }



}
