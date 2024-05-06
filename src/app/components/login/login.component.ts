import { Component, OnInit } from '@angular/core';

import { LoginService } from './services/login.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Environments } from '../environments/environments';

import { EncryptService } from '../shared/services/encrypt.service';

import Swal from 'sweetalert2'
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  _show_spinner: boolean = false;
  primary:       any;
  secondary:     any;
  title_login:   string  = 'Machine Controller';
  hide:          boolean = true;
  _show:         boolean = false;

  public user: any = [];

  public loginForm = new FormGroup({
      email:         new FormControl(''),
      contrasenia:   new FormControl('')
    }
  );

  constructor(private log: LoginService, private ncrypt: EncryptService, private router: Router, private env: Environments) { }
  
  version_actual:any;
  
  ngOnInit(): void {

    this.version_actual = this.env.version;

      this.primary   =  this.env.appTheme.colorPrimary;
      this.secondary = this.env.appTheme.colorSecondary_C;
      
      let xtoken = sessionStorage.getItem('token');
      if( xtoken == null || xtoken == undefined )  { 
        //console.warn('No hay credenciales') 
      }
      else if (xtoken != null || xtoken != undefined) {
        this.router.navigate(['dashboard'])
      };

  }

  onSubmit() {
    this.logins();
  }


  loginModel:any = [];
  logins() {
    
    this.loginModel = {
      "Usuario":  this.loginForm.controls['email'].value,
      "Password": this.loginForm.controls['contrasenia'].value
    }
    
    this._show_spinner = true;
    this.log.login(this.loginModel).subscribe({
      next: (x) => {
        Toast.fire({
          icon: 'success',
          title: 'Te has logeado con éxito'
        })
        this._show_spinner = false;
      }, error: (error) => {
        if ( error.status == 200 ) { 
          Toast.fire({
            icon: 'success',
            title: 'Te has logeado con éxito'
          })
          var e = error.error;
          ////////console.warn(e.text);
          const tokenEn:any = this.ncrypt.encryptWithAsciiSeed(e.text, 5, 10);
          sessionStorage.setItem('token', tokenEn);
          let xuser: any = this.loginForm.controls['email'].value;
          sessionStorage.setItem('usuario', xuser);
          this.router.navigate(['dashboard']);
        } else if ( error.status != 200 ) {
          Toast.fire({
            icon: 'error',
            title: 'Algo ha pasado'
          })
        }   
        this._show_spinner = false;     
      }, complete: () => {
          this.router.navigate(['dashboard']);
      }
    })

  }

}
