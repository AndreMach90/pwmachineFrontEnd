import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteComponent } from '../cliente.component';
import { CuentasBancariasService } from './services/cuentas-bancarias.service';
import { ServicesSharedService } from 'src/app/components/shared/services-shared/services-shared.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Environments } from 'src/app/components/environments/environments';
import Swal from 'sweetalert2'
import { ControlinputsService } from 'src/app/components/shared/services/controlinputs.service';
import { ClientesService } from '../services/clientes.service';

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
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.scss']
})

export class ModalClienteComponent implements OnInit {

  delete: any = this.env.apiUrlIcon()+'delete.png';
  edit:   any = this.env.apiUrlIcon()+'edit.png';
  crear:  any = this.env.apiUrlIcon()+'accept.png';
  cancel: any = this.env.apiUrlIcon()+'cancel.png';
  search: any = this.env.apiUrlIcon()+'search.png';

  _edit_btn:                    boolean = false;
  _delete_show:                 boolean = true;
  _edit_show:                   boolean = true;
  _create_show:                 boolean = true;
  _form_create:                 boolean = true;

  _action_butto = 'Crear';
  _show_spinner: boolean = false;
  _icon_button: string = 'add';
  _cancel_button: boolean = false;

  primary:any;
  secondary:any;
  secondary_a:any;
  secondary_b:any;

  public ctaBancariaForm = new FormGroup({
    nombanco:     new FormControl(''), 
    numerocuenta: new FormControl(''),
    observacion:  new FormControl(''),
  })

  constructor( public dialogRef: MatDialogRef<ClienteComponent>,
               private clienteserv: ClientesService,
               @Inject(MAT_DIALOG_DATA) public data: any, private env: Environments,
               private controlInputsService: ControlinputsService,
               private cuentasservs: CuentasBancariasService, private sharedservs: ServicesSharedService ) { }
               
               validateInputText(data:any) {
                this.controlInputsService.validateAndCleanInput(data);
              }
              
              validateInputNumber(data: any) {
                this.controlInputsService.validateAndCleanNumberInput(data);
              }
  ngOnInit(): void {
    this.primary =  this.env.appTheme.colorPrimary;
    this.secondary = this.env.appTheme.colorSecondary_C;
    this.secondary_a = this.env.appTheme.colorSecondary_A;
    this.secondary_b = this.env.appTheme.colorSecondary_B;
    console.warn('this.data modal cliente');
    console.warn(this.data);

    switch(this.data.action) {
      case 'C':
        this._action_butto = 'Crear';
        break;
      case 'E':
        this.obtenerCuentaBancariaCliente();
        this._action_butto = 'Editar';
        this.ctaBancariaForm.controls['nombanco']
            .setValue(this.data.nombanco);
        this.ctaBancariaForm.controls['numerocuenta'] 
            .setValue(this.data.numerocuenta);
        break;
    }
  }

  modelCuentasBancarias:any = [];
  crearCuentasBancarias() {
    this._show_spinner = true;
    if ( this.ctaBancariaForm.controls['nombanco'].value == null ||  this.ctaBancariaForm.controls['nombanco'].value == undefined ||  this.ctaBancariaForm.controls['nombanco'].value == '' ) Toast.fire({ icon: 'warning', title: 'No debe ir vacío el campo de Nombre del banco' });
    else if ( this.ctaBancariaForm.controls['numerocuenta'].value == null || this.ctaBancariaForm.controls['numerocuenta'].value == undefined || this.ctaBancariaForm.controls['numerocuenta'].value == '' ) Toast.fire({ icon: 'warning', title: 'No debe ir vacío el campo de Número de cuenta' });
    else {
      let date = new Date();
      this._create_show = false;
      const codec: any = this.sharedservs.generateRandomString(10);
      const token: any = 'CB-'+ codec + '-' + date.getFullYear() + '-' + date.getDay();

      this.modelCuentasBancarias = {
        codigoCliente: this.data.codigoCliente,
        codcuentacontable: token,
        nombanco:     this.ctaBancariaForm.controls['nombanco'].value?.replace(/[^a-zA-Z ]/g, ''),
        numerocuenta: this.ctaBancariaForm.controls['numerocuenta'].value?.replace(/[^0-9.]*/g, ''),
        tipoCuenta:   this.cuentaSeleccionada,
        observacion:  this.ctaBancariaForm.controls['observacion'].value
      }
      setTimeout(() => {
      this.cuentasservs.guardarCuentasBancarias(this.modelCuentasBancarias).subscribe({
        next: (x) => {
          Toast.fire({
              icon: 'success',
              title: 'Cuenta bancaria gaurdada con éxito'
            });
            this._show_spinner = false;
        }, error: (e) => {
          console.error(e);
          Toast.fire({
              icon: 'error',
              title: 'No hemos podido crear la cuenta bancaria para este cliente'
            });
            this._show_spinner = false;
        }, complete: () => {
          this.closeDialog(this.modelCuentasBancarias);
        }
      })
    }, 1000)
  }
  }

  onSubmit() {

    switch(this._action_butto) {
      case 'Crear':
        this.crearCuentasBancarias();
        break;
      case 'Editar':
        this.editarCuentasBancarias();
        break;
    }

  }

  ahorro:boolean = false;
  corriente:boolean = false;
  cuentaslista: any = [];
    obtenerCuentaBancariaCliente() {
      console.warn(this.data.idCliente);
      
      this._show_spinner = true;
      this.cuentaslista = [];
      this.clienteserv.obtenerCuentaCliente(this.data.idCliente).subscribe({
          next: ( cuentas ) => {  
            this.cuentaslista = cuentas;
            console.log('this.cuentaslista desde el mdoal cliente');
            console.table(this.cuentaslista);
            this._show_spinner = false;          
          }, error:(e) => {
            console.error(e);
            this._show_spinner = false;
          }, complete: () => {
            this.cuentaslista.filter((element: any)=> {
              if ( element.id == this.data.id ) {
                //////////console.warn('CUENTA ENCONTRADA');
                //////////console.warn(element);
                this.ctaBancariaForm.controls['observacion'].setValue(element.observacion);
                if( element.tipoCuenta == 'ahorro' ) {
                  this.ahorro = true;
                  this.corriente = false;
                  this.cuentaSeleccionada = 'ahorro';
                } else if (element.tipoCuenta == 'corriente') {
                  // //alert'Es de corriente')
                  this.ahorro = false;
                  this.corriente = true;
                  this.cuentaSeleccionada = 'corriente';
                }
              }
            })
          }
        }
      )
    }

  editarCuentasBancarias() {
    if ( this.ctaBancariaForm.controls['nombanco'].value == null ||  this.ctaBancariaForm.controls['nombanco'].value == undefined ||  this.ctaBancariaForm.controls['nombanco'].value == '' ) Toast.fire({ icon: 'warning', title: 'No debe ir vacío el campo de Nombre del banco' });
    else if ( this.ctaBancariaForm.controls['numerocuenta'].value == null || this.ctaBancariaForm.controls['numerocuenta'].value == undefined || this.ctaBancariaForm.controls['numerocuenta'].value == '' ) Toast.fire({ icon: 'warning', title: 'No debe ir vacío el campo de Número de cuenta' });
    else {
      this._show_spinner = true;
    this.modelCuentasBancarias = {
      codigoCliente:     this.data.codigoCliente,
      codcuentacontable: this.data.codcuentacontable,
      nombanco:          this.ctaBancariaForm.controls['nombanco'].value?.replace(/[^a-zA-Z ]/g, ''),
      numerocuenta:      this.ctaBancariaForm.controls['numerocuenta'].value?.replace(/[^0-9.]*/g, ''),
      tipoCuenta:        this.cuentaSeleccionada,
      observacion:       this.ctaBancariaForm.controls['observacion'].value
    }

    this.cuentasservs.editarCuentaBancaria(this.modelCuentasBancarias).subscribe({
      next: (x) => {
        Toast.fire(
          { 
            icon: 'success',
            title: 'Cuenta bancaria actualizada con éxito'
          }
        );
        this._show_spinner = false;
        }, error: (e) => {
          console.error(e);
          Toast.fire(
            {
              icon: 'error',
              title: 'No hemos podido actualiza la cuenta bancaria para este cliente'
            });
            this._show_spinner = false;
        }, complete: () => {
          this.closeDialog(this.modelCuentasBancarias);
        }
      })
    }
  }

  limpiar() {

    this.closeDialog({responsemodal: 'Se cerró el modal de cuentas bancarias'});

  }

  closeDialog(data:any) {
    this.dialogRef.close(data);
  }

  cuentaSeleccionada: string | undefined;

  seleccionarCuenta(tipo: string) {
    this.cuentaSeleccionada = tipo;
    ////////console.log(`Cuenta seleccionada: ${tipo}`);
  }

}
