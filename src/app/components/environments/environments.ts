import { Injectable } from '@angular/core';
import { EncryptService } from '../shared/services/encrypt.service';

@Injectable({
  providedIn: 'root',
})
export class Environments {
  /** ======================================================= */
  // CONTROL DE ERRORES
  E_404: any = 'Error al ingresar';
  E_0: any = 'Hay inconvenientes al establecer conexión con el servidor';
  E_500: any = 'Problemas en consulta de datos';
  /** ======================================================= */

  constructor(private encrypt: EncryptService) {}

  apingRok: any = 'http://192.168.55.96:9095';
  // apingRok: any = 'https://sfiback.azurewebsites.net';
  // FORTIUS INVITADO
  // apingRok:    any = 'http://192.168.101.71:5001';
  version: string = 'V.1.0.2';
  es: number = 5;
  hash: number = 10;
  encode: number = 99;
  codCerveceria = "CLI-Cerve-YgWEL5ywHS-2024-4";

  apiurl(): string {
    const env: string = this.apingRok + '/api/';
    return env;
  }

  apiUrlHub(): string {
    const envHub: string = this.apingRok + '/hubs/';
    return envHub;
  }

  apiUrlStorage(): string {
    const envstorage: string = this.apingRok + '/storage/';
    return envstorage;
  }

  apiUrlIcon(): string {
    const envicon = this.apingRok + '/iconsApp/';
    return envicon;
  }

  TokenJWT(): string {
    let xtoken: any = sessionStorage.getItem('token');
    let x: any = this.encrypt.decryptWithAsciiSeed(xtoken, this.es, this.hash);
    return x;
  }

  appTheme: appTheme = {
    colorPrimary: '#0f5499',
    colorSecondary: '#A5CF61',
    colorSecondary_A: '#6F9B3C',
    colorSecondary_B: '#558257',
    colorSecondary_C: '#1B456F',
  };

  getAppTheme(): appTheme {
    return this.appTheme;
  }
}

export interface appTheme {
  colorPrimary: string;
  colorSecondary: string;
  colorSecondary_A: string;
  colorSecondary_B: string;
  colorSecondary_C: string;
}
