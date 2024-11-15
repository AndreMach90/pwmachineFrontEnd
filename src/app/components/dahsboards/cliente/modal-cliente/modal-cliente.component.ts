import { ServicesSharedService } from 'src/app/components/shared/services-shared/services-shared.service';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ControlinputsService } from 'src/app/components/shared/services/controlinputs.service';
import { CuentasBancariasService } from './services/cuentas-bancarias.service';
import { Environments } from 'src/app/components/environments/environments';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ClienteComponent } from '../cliente.component';
import Swal from 'sweetalert2';

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
  _edit_btn:              boolean = false;
  _delete_show:           boolean = true;
  _edit_show:             boolean = true;
  _create_show:           boolean = true;
  _form_create:           boolean = true;
  ahorro:                 boolean = false;
  corriente:              boolean = false;
  cuentaSeleccionada:     string | undefined;
  modelCuentasBancarias:  any = [];
  _show_spinner:          boolean = false;
  _cancel_button:         boolean = false;
  _icon_button:           string = 'add';
  _action_butto           = 'Crear';
  primary:                any;
  secondary:              any;
  secondary_a:            any;
  secondary_b:            any;

  public ctaBancariaForm = new FormGroup({
    nombanco:     new FormControl('', [Validators.required, this.noWhitespaceValidator()]), 
    numerocuenta: new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    tipoCuenta: new FormControl('', [this.radioValidator]),
    observacion:  new FormControl(''),
  })

  constructor( public dialogRef: MatDialogRef<ClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private env: Environments,
    private controlInputsService: ControlinputsService,
    private cuentasservs: CuentasBancariasService, 
    private sharedservs: ServicesSharedService ) { }
               
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
    switch(this.data.action) {
      case 'C':
        this._action_butto = 'Crear';
        break;
      case 'E':
        this._action_butto = 'Editar';
        this.ctaBancariaForm.controls['nombanco'].setValue(this.data.nombanco);
        this.ctaBancariaForm.controls['numerocuenta'].setValue(this.data.numerocuenta);
        if (this.data.tipoCuenta == 'ahorro') {
          this.ahorro = true;
          this.corriente = false;
        }
        if (this.data.tipoCuenta == 'corriente') {
          this.ahorro = false;
          this.corriente = true;
        }
        this.ctaBancariaForm.controls['tipoCuenta'].setValue(this.data.tipoCuenta);
        this.ctaBancariaForm.controls['observacion'].setValue(this.data.observacion);
        break;
    }
  }

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
        tipoCuenta:   this.ctaBancariaForm.controls['tipoCuenta'].value,
        observacion:  this.ctaBancariaForm.controls['observacion'].value
      }
      setTimeout(() => {
        this.cuentasservs.guardarCuentasBancarias(this.modelCuentasBancarias).subscribe({
          next: (x) => {
            Toast.fire({
                icon: 'success',
                title: 'Cuenta bancaria guardada con éxito'
            });
            this._show_spinner = false;
          }, error: (e) => {
            console.error(e);
            Toast.fire({
              icon: 'error',
              title: 'No hemos podido crear la cuenta bancaria para este cliente'
            });
            this._show_spinner = false;
          }, 
          complete: () => this.closeDialog(this.modelCuentasBancarias)
        })
      }, 1000)
    }
  }

  onSubmit() {
    if (this.ctaBancariaForm.invalid) {
      this.markFormGroupTouched(this.ctaBancariaForm);
      return;
    }
    this._action_butto === 'Crear' ? this.crearCuentasBancarias() : this.editarCuentasBancarias();
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
        tipoCuenta:        this.ctaBancariaForm.controls['tipoCuenta'].value,
        observacion:       this.ctaBancariaForm.controls['observacion'].value
      }
      this.cuentasservs.editarCuentaBancaria(this.modelCuentasBancarias).subscribe({
        next: (x) => {
          Toast.fire({ 
            icon: 'success',
            title: 'Cuenta bancaria actualizada con éxito'
          });
          this._show_spinner = false;
        }, error: (e) => {
          console.error(e);
          Toast.fire({
            icon: 'error',
            title: 'No hemos podido actualiza la cuenta bancaria para este cliente'
          });
          this._show_spinner = false;
        }, 
        complete: () => this.closeDialog(this.modelCuentasBancarias)
      })
    }
  }

  limpiar() {
    this.closeDialog({responsemodal: 'Se cerró el modal de cuentas bancarias'});
    this.ctaBancariaForm.reset();
    this.ahorro = false;
    this.corriente = false;
    this.resetFormGroup(this.ctaBancariaForm);
  }

  closeDialog(data:any) {
    this.dialogRef.close(data);
  }

  seleccionarCuenta(tipo: string) {
    if (tipo === 'ahorro') {
      this.ahorro = true;
      this.corriente = false;
    }
    if (tipo === 'corriente') {
      this.ahorro = false;
      this.corriente = true;
    }
    this.ctaBancariaForm.controls['tipoCuenta'].setValue(tipo);
  }

  radioValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return control.value ? null : { 'required': true };
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    };
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  private resetFormGroup(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsUntouched({ onlySelf: true });
      control?.markAsPristine({ onlySelf: true });
    });
  }
}
