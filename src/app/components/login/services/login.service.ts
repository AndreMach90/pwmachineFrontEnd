import { Injectable } from '@angular/core';
import { Environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // public url: string = environment.deploy_url;

  constructor( private env: Environments, private http: HttpClient, public router: Router ) { }

  login( model: any[] ) {
    return this.http.post( this.env.apiurl() + 'Login', model )
  }

  validate() {
    let token: any = sessionStorage.getItem('token');
    //////////// console.warn(token)
    if( token == undefined || token == null || token == '' ) {
      this.router.navigate(['login']);
    } else {
      this.router.navigate(['dashboard']);
    }
  }

  closeSession() {
    sessionStorage.removeItem('token');
    this.validate();
  }

}
