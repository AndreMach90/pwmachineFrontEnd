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
    return this.http.get(this.env.apiurl() + 'tiendas/ObtenerTiendasCompletas');
  }

  editarTiendas( model:any ) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });

    return this.http.put( this.env.apiurl() + 'tiendas/ActualizarTienda', model, {headers} );
    
  }

  eliminarTiendas(id:number) {
    return this.http.delete( this.env.apiurl() + 'tiendas/BorrarTienda/' + id );
  }

  guardarCuentAsigna( model: any [] ) {
    return this.http.post( this.env.apiurl() + 'CuentAsigna/GuardarCuentAsigna', model );
  }

  obtenerCuentasAsignadas(idtienda:any) {
    return this.http.get( this.env.apiurl() + 'TiendaCuenta/ObtenerTiendaCuentas/' + idtienda );
  }

  eliminarCuentasAsignadas(id:number) {
    return this.http.delete( this.env.apiurl() + 'TiendaCuenta/BorrarCuentaTienda/' + id );
  }



}
