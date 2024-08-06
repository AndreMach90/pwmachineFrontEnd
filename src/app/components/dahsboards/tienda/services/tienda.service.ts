import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  constructor( private env: Environments, private http: HttpClient ) { }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
  }

  guardarTiendas( model:any[] ) {    
    return this.http.post(this.env.apiurl() + 'tiendas/GuardarTienda', model, { headers: this.headers });
  }

  obtenerTiendas() {
    return this.http.get(this.env.apiurl() + 'tiendas/ObtenerTiendasCompletas', { headers: this.headers });
  }

  editarTiendas( model:any ) {
    return this.http.put( this.env.apiurl() + 'tiendas/ActualizarTienda', model, { headers: this.headers });    
  }

  eliminarTiendas(id:number) {
    return this.http.delete( this.env.apiurl() + 'tiendas/BorrarTienda/' + id, { headers: this.headers });
  }

  guardarCuentAsigna( model: any [] ) {
    return this.http.post( this.env.apiurl() + 'CuentAsigna/GuardarCuentAsigna', model, { headers: this.headers });
  }

  obtenerCuentasAsignadas(idtienda:any) {
    return this.http.get( this.env.apiurl() + 'TiendaCuenta/ObtenerTiendaCuentas/' + idtienda, { headers: this.headers });
  }

  eliminarCuentasAsignadas(id:number) {
    return this.http.delete( this.env.apiurl() + 'TiendaCuenta/BorrarCuentaTienda/' + id, { headers: this.headers });
  }

  obtenerTiendaFiltroCliente(id: any) {
    return this.http.get( this.env.apiurl() + 'tiendas/ObtenerTiendaFiltroCliente/' + id, { headers: this.headers });
  }

  obtenerCuadre(machineSn: any) {
    return this.http.get( this.env.apiurl() + 'EquiposNoTransaccion/Cuadre/' + machineSn, { headers: this.headers } );
  }
}
