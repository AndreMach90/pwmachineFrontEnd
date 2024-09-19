import { Injectable } from '@angular/core';
import { EncryptService } from '../services/encrypt.service';
import { Router } from '@angular/router';
import { Environments } from '../../environments/environments';
import { SharedService } from '../services/shared.service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenJWTService {

  sub: any;
  nameidentifier: any;
  name: any;
  role: any;
  authorizationdecision: any;
  exp: any;
  iss: any;
  aud: any;
  horaCierre: any;
  clienteCerveceriaNacional: boolean = false;

  constructor(private ncrypt: EncryptService,
    private router: Router,
    private env: Environments,
    private shar: SharedService,) { }

  validateRolJWT() {
    let xtoken: any = sessionStorage.getItem('token');
    const xtokenDecript: any = this.ncrypt.decryptWithAsciiSeed(xtoken, this.env.es, this.env.hash);

    if (xtokenDecript != null || xtokenDecript != undefined) {
      var decoded: any = jwt_decode(xtokenDecript);
      this.sub = decoded['sub'];
      this.nameidentifier = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      this.name = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      this.role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      this.authorizationdecision = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision'];
      this.exp = decoded['exp'];
      this.iss = decoded['iss'];
      this.aud = decoded['aud'];
      this.horaCierre = this.convertTimestampToReadableDate(this.exp);

      const rolEncrypt: any = this.ncrypt.encryptWithAsciiSeed(this.role, this.env.es, this.env.hash);
      sessionStorage.setItem('PR', rolEncrypt);
      if (this.role == 'R003') {
        this.router.navigate(['moneq']);
        this.clienteCerveceriaNacional = false;
      }
      else if (this.role == 'R005') {
        this.clienteCerveceriaNacional = true;
      }
    }

  }

  convertTimestampToReadableDate(timestamp: number): string {
    // Convertir el timestamp a milisegundos
    const date = new Date(timestamp * 1000);

    // Formatear la fecha a una cadena legible
    const readableDate = date.toLocaleString();

    return readableDate;
  }
}
