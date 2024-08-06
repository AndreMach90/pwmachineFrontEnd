import { Injectable } from '@angular/core';
import { Environments } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EncryptService } from '../services/encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesSharedService {
  constructor( private env: Environments, private http: HttpClient, private ncrypt: EncryptService ) { }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
  }

  generateRandomString = (num: any) => {
    const characters ='-_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1= '';
    const charactersLength = characters.length;
    for ( let i = 0; i < num; i++ ) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result1;
  }

  getDataMaster(master: any) {
    return this.http.get( this.env.apiurl() + 'DataMaster/GetDataMaster/' + master, { headers: this.headers } );
  }

  getTipoEquipo () {
    return this.http.get( this.env.apiurl() + 'DataMaster/GetTipoEquipo', { headers: this.headers } )
  }

  validateRol():any {
    const x:any = sessionStorage.getItem('PR');
    const rol:any = this.ncrypt.decryptWithAsciiSeed(x, this.env.es, this.env.hash);
    switch(rol){
      case 'R001':
        return 1;
      case 'R002':
        return 0;
      case 'R003':
        return 0;
    }
  }
}
