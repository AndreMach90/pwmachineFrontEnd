import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from '../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor( private http: HttpClient, private env: Environments ) { }

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
    // return this.http.get( this.env.apiurl() + 'DataMaster/GetDataMaster/' + master );
    const apiUrl = this.env.apiurl() + 'DataMaster/GetDataMaster/' + master;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }
}
