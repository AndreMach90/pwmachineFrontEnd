import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Environments } from '../../environments/environments';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  constructor(private http: HttpClient, private env: Environments) { }

  generateRandomString = (num: any) => {
    const characters = '-_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result1;
  }
  
  //Posible API no utilizada
  getDataMaster(master: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(this.env.apiurl() + 'DataMaster/GetDataMaster/' + master, { headers });
  }

  getIndicadoresHome(option: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.env.TokenJWT()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(this.env.apiurl() + 'Indicadores/ObtenerIndicadoresHome/' + option, { headers });
  }
}
