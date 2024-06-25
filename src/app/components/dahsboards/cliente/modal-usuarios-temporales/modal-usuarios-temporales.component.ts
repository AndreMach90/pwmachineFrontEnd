import { Component, Inject, OnInit } from '@angular/core';
import { ClienteComponent } from '../cliente.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Environments } from 'src/app/components/environments/environments';
import { ControlinputsService } from 'src/app/components/shared/services/controlinputs.service';
import { CuentasBancariasService } from '../modal-cliente/services/cuentas-bancarias.service';
import { ServicesSharedService } from 'src/app/components/shared/services-shared/services-shared.service';
import { ClientesService } from '../services/clientes.service';
import { ModalClienteComponent } from '../modal-cliente/modal-cliente.component';
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
  selector: 'app-modal-usuarios-temporales',
  templateUrl: './modal-usuarios-temporales.component.html',
  styleUrls: ['./modal-usuarios-temporales.component.scss']
})
export class ModalUsuariosTemporalesComponent implements OnInit {

  _show_spinner: boolean = false;
  delete: any = this.env.apiUrlIcon()+'delete.png';
  edit:   any = this.env.apiUrlIcon()+'edit.png';
  crear:  any = this.env.apiUrlIcon()+'accept.png';
  cancel: any = this.env.apiUrlIcon()+'cancel.png';
  search: any = this.env.apiUrlIcon()+'search.png';

  viewForm:boolean = true;
  permisonUsers:boolean = true;
  clientelista:      any = [];
  clienteListaGhost: any = [];

  constructor( public dialogRef: MatDialogRef<ClienteComponent>,
               private clienteserv: ClientesService,
               public dialog: MatDialog,
               @Inject(MAT_DIALOG_DATA) public data: any, private env: Environments,
               private controlInputsService: ControlinputsService,
               private cuentasservs: CuentasBancariasService, private sharedservs: ServicesSharedService ) { }

  
  
    ngOnInit(): void {
      this.obtenerCuentaBancariaCliente();
      let x:any = this.sharedservs.validateRol();
      switch( x ) {
        case 1:
          this.permisonUsers = true;
          break;
        case 0:
          this.permisonUsers = false; 
          break;
      }
    }

    cuentaslista: any = [];
    obtenerCuentaBancariaCliente() {

      console.log('Este es el ID obtenido de la DATA enciada')
      console.log(this.data.id)
      console.log('***********************************')
      console.log(this.data)

      this._show_spinner = true;
      this.cuentaslista = [];
      this.clienteserv.obtenerCuentaCliente(this.data.codigoCliente).subscribe({
        next: ( cuentas ) => {  
          this.cuentaslista = cuentas;
          console.log('Cuentas bancarias creadas');
          console.log(this.cuentaslista);
          this._show_spinner = false;
  
        }, error:(e) => {
          console.error(e);
          this._show_spinner = false;
        }, complete: () => {

          this.cuentaslista.filter((cuentas:any)=>{
            this.clienteserv.obtenerCuentaTransacCant(cuentas.id).subscribe({
              next: (x) => {
                ////console.warn(x);
                cuentas.nTransac = Number(x);
                if( cuentas.nTransac > 0 ) cuentas.delete = false;
                else cuentas.delete = true;
              }
            })
          });

          ////console.log('this.cuentaslista');
          //console.table(this.cuentaslista);

        }
      }) 
    }

    obtenerCuentaTransac(data:any) {
      ////console.log(data)
      this.clienteserv.obtenerCuentaTransacCant(data.id).subscribe({
        next: (x) => {
          ////console.warn(x);
        }
      })
    }


    obtenerCliente() {
      this.clientelista = [];
      this._show_spinner = true;
      this.clienteserv.obtenerCliente()
                      .subscribe({
        next: (cliente) => {
          this.clienteListaGhost = cliente;
          // //////////console.warn(this.clienteListaGhost);
          this._show_spinner = false;
        }, error: (e) => {
          this._show_spinner = false;
          console.error(e);
        }, complete: () => {
          this.clienteListaGhost.filter((element:any)=>{
  
            //////////console.warn(element)
  
            let arr: any = {
              "id": element.id,
              "codigoCliente": element.codigoCliente,
              "nombreCliente": element.nombreCliente,
              "ruc": element.ruc,
              "direccion": element.direccion,
              "telefcontacto": element.telefcontacto,
              "emailcontacto": element.emailcontacto,
              "nombrecontacto": element.nombrecontacto,
              "cantidadCuntasBancarias": element.cantidadCuntasBancarias
            }
  
            this.clientelista.unshift(arr);
            // //////////console.warn(this.clientelista);
  
          })
        }
      })
    }

    eliminarCuentaCliente(cuenta:any, i:number) {
  
      this._show_spinner = true;
      this.cuentasservs.eliminarCuentaBancaria(cuenta.id).subscribe({
        next:(x) => {
          Toast.fire({ icon: 'success', title: 'Cuenta bancaria eliminada' });
          this._show_spinner = false;
        }, error: (e) => {
          Toast.fire({ icon: 'error', title: 'Algo ha pasado' });
          this._show_spinner = false;
        }, complete: () => {
          this.cuentaslista.splice(i, 1);
          // this.limpiar();
        }
      })
  
    }
    
    openDialogCuentasBancarias(data:any, action:string): void {

    let modelData: any;
    switch( action ) {
      case 'C':

        modelData = {
          "id": data.id,
          "codigoCliente": data.codigoCliente,
          "nombreCliente": data.nombreCliente,
          "ruc": data.ruc,
          "direccion": data.direccion,
          "telefcontacto": data.telefcontacto,
          "emailcontacto": data.emailcontacto,
          "nombrecontacto": data.nombrecontacto,
          "action": action
        }

        break;

      case 'E':

        let nombreCliente:any;
        this.clientelista.filter( (element:any) => {

          if( element.codigoCliente == data.codigoCliente) {
            nombreCliente = element.nombreCliente;
          }

        })

        modelData = {
          "id": data.id,
          "idCliente": this.cuentaslista[0].clienteID,
          "nombreCliente": nombreCliente,
          "codigoCliente": data.codigoCliente,
          "codcuentacontable": data.codcuentacontable,
          "nombanco": data.nombanco,
          "numerocuenta": data.numerocuenta,
          "fecrea": new Date(),
          "action": action
        }

        break;

    }   

    const dialogRef = this.dialog.open( ModalClienteComponent, {
      height: 'auto',
      width:  '350px',
      data: modelData, 
    });

    dialogRef.afterClosed().subscribe( result => {
      // this.obtenerCliente();
      this.obtenerCuentaBancariaCliente();
    });

  }


}
