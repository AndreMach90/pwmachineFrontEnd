import { Component, OnInit } from '@angular/core';
import { Environments } from '../../environments/environments';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalClienteComponent } from './modal-cliente/modal-cliente.component';
import { ClientesService } from './services/clientes.service';
import { ServicesSharedService } from '../../shared/services-shared/services-shared.service';
import { CuentasBancariasService } from './modal-cliente/services/cuentas-bancarias.service';

import { ControlinputsService } from '../../shared/services/controlinputs.service';
import { ModalDetalleMaquinaTranComponent } from '../monitoreo-equipos/modal-detalle-maquina-tran/modal-detalle-maquina-tran.component';
import { ModalUsuariosTemporalesComponent } from './modal-usuarios-temporales/modal-usuarios-temporales.component';

import Swal from 'sweetalert2'
import { ModalLocalidadClienteComponent } from './modal-localidad-cliente/modal-localidad-cliente.component';
import { ModalClienteService } from './modal-localidad-cliente/services/modal-cliente.service';
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
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls:   ['./cliente.component.scss']
})

export class ClienteComponent implements OnInit {

  guardarControl: boolean = false;


  _width_table: string = 'tabledata table-responsive w-100 p-2';
  _show_add_tecnic: boolean = true;

  delete: any = this.env.apiUrlIcon()+'delete.png';
  localidad: any = this.env.apiUrlIcon()+'localidad.png';
  localidad1: any = this.env.apiUrlIcon()+'localidad1.png';
  localidad2: any = this.env.apiUrlIcon()+'localidad2.png';
  edit:   any = this.env.apiUrlIcon()+'edit.png';
  crear:  any = this.env.apiUrlIcon()+'accept.png';
  cancel: any = this.env.apiUrlIcon()+'cancel.png';
  add: any = this.env.apiUrlIcon()+'add.png';
  search: any = this.env.apiUrlIcon()+'search.png';

  tiendaListaGhost:any = [];
  filterequip:any =[];

  _edit_btn:    boolean = false;
  _delete_show: boolean = true;
  _edit_show:   boolean = true;
  _create_show: boolean = true;
  _form_create: boolean = true;
  cuentaslista: any = [];
  _action_butto = 'Crear';
  _show_spinner: boolean = false;
  _icon_button: string = 'add';
  _cancel_button: boolean = false;

  clientelista:any = [];

  public clienteForm = new FormGroup({
    Nombre_Cliente:   new FormControl(''), 
    Telefono:         new FormControl(''), 
    Direccion:        new FormControl(''), 
    RUC:              new FormControl(''), 
    nombre_contacto:  new FormControl(''), 
    email_contacto:   new FormControl(''), 
    Active:           new FormControl(''), 
  })

  public filterForm = new FormGroup({
    filterCli:   new FormControl('')
  })

  calwidth: boolean = true;

  primary:any;
  secondary:any;
  secondary_a:any;
  secondary_b:any;
  namemodulo:any = '';
  permisonUsers:boolean = true;
  viewForm: boolean = false;
  ngOnInit(): void {

    let x:any = this.sharedservs.validateRol();
    switch( x ) {
      case 1:
        this.permisonUsers = true;
        break;
      case 0:
        this.permisonUsers = false; 
        break;
    }

      this.primary     =  this.env.appTheme.colorPrimary;
      this.secondary   = this.env.appTheme.colorSecondary_C;
      this.secondary_a = this.env.appTheme.colorSecondary_A;
      this.secondary_b = this.env.appTheme.colorSecondary_B;
      this.obtenerCliente();

  }

  constructor( private env: Environments,
               public dialog: MatDialog,
               private loc: ModalClienteService,
               private clienteserv: ClientesService,
               private controlInputsService: ControlinputsService,
               private sharedservs: ServicesSharedService, 
               private ctabancarias: CuentasBancariasService ) {}
 
               validateInputText(data:any) {
                this.controlInputsService.validateAndCleanInput(data);
              }
              
              validateInputNumber(data: any) {
                this.controlInputsService.validateAndCleanNumberInput(data);
              }
  
  localidadesGuardadasCliente: any = [];
  obtenerLocalidad( codcli:any ) {
    this._show_spinner = true;
    this.loc.obtenerLocalidadesCliente( codcli ).subscribe({
      next: (x) => {
        this.localidadesGuardadasCliente = x;
        console.warn(this.localidadesGuardadasCliente)
        this._show_spinner = false;
      }, complete: () => {
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }
    })
  }

  eliminarCliente( index:number, id:number, idcliente: number ) {
    this._show_spinner = true;
    this.loc.eliminarLocalidadCliente(id).subscribe({
      next: (x) => {
        Toast.fire({ icon: 'success', title: 'Asignación de localidad eliminada' });
      }, error: (e) => {
        this._show_spinner = false;
        Toast.fire({ icon: 'error', title: 'No hemos podido eliminar la localidad' });
      }, complete: () => {
        this._show_spinner = false;
        this.localidadesGuardadasCliente.splice(index, 1);
        this.clientelista.filter( (x:any) => {
          console.log( x.id )
          console.log( idcliente )
          if ( x.id == idcliente ) {
            console.warn( 'cliente encontrado: '  )
            console.warn( x )
            x.cantidadLocalidades -1
          }
        })
      }
    })
  }
  
  widthAutom() {
    switch( this.calwidth ) {
      case true:
        this._width_table   = 'tabledata table-responsive w-75 p-2';
        this.guardarControl = true;
        this.calwidth       = false;
        break;
      case false:        
        this._width_table   = 'tabledata table-responsive w-100 p-2';
        this.guardarControl = false;
        this.calwidth       = true;
        break;
    }
  }
              

  clienteListaGhost: any = [];
  obtenerCliente() {
    this.clientelista = [];
    this._show_spinner = true;
    this.clienteserv.obtenerCliente()
                    .subscribe({
      next: (cliente) => {
        this.clienteListaGhost = cliente;
        console.warn('----------------');
        console.warn('----------------');
        console.warn(this.clienteListaGhost);
        console.warn('----------------');
        console.warn('----------------');
        this._show_spinner = false;
      }, error: (e) => {
        this._show_spinner = false;
        console.error(e);
      }, complete: () => {
        this.clienteListaGhost.filter((element:any)=>{

          ////////console.warn(element)

          let arr: any = {
            "id": element.id,
            "codigoCliente": element.codigoCliente,
            "nombreCliente": element.nombreCliente,
            "ruc": element.ruc,
            "direccion": element.direccion,
            "telefcontacto": element.telefcontacto,
            "emailcontacto": element.emailcontacto,
            "nombrecontacto": element.nombrecontacto,
            "cantidadCuntasBancarias": element.cantidadCuntasBancarias,
            "cantidadLocalidades": element.cantidadLocalidades
          }

          this.clientelista.unshift(arr);
          // ////////console.warn(this.clientelista);

        })
      }
    })
  }


  filterCliente () {

    let filter: any = this.filterForm.controls['filterCli'].value;

    this.clientelista = this.clienteListaGhost.filter((item:any) => 
      item.ruc.toLowerCase().includes(filter.toLowerCase()) ||
      item.nombreCliente.toLowerCase().includes(filter.toLowerCase())
    );
    
  }


  onSubmit() {    
      switch(this._action_butto) {
        case 'Crear':
          this.guardarClientes();
          break;
        case 'Editar':
          this.editarClientes();
          break;
      }
  } 

  guardarClientes() {

    
    if( this.clienteForm.controls['Nombre_Cliente'].value == null || this.clienteForm.controls['Nombre_Cliente'].value == undefined || this.clienteForm.controls['Nombre_Cliente'].value == ''  ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de nombre cliente vacío' });
    else if( this.clienteForm.controls['RUC'].value == null || this.clienteForm.controls['RUC'].value == undefined || this.clienteForm.controls['RUC'].value == ''  ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de RUC cliente vacío' });
    else if( this.clienteForm.controls['Telefono'].value == null || this.clienteForm.controls['Telefono'].value == undefined || this.clienteForm.controls['Telefono'].value == ''  ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de Telefono cliente vacío' });
    else {
      
      this._show_spinner = true;
      this._create_show = false;
      let date = new Date();
      const codec: any =this.sharedservs.generateRandomString(10);
      const token: any = 'CLI-'+this.clienteForm.controls['Nombre_Cliente'].value?.slice(0,5).replace(' ', '_') +'-' + this.sharedservs.generateRandomString(10) + '-' + date.getFullYear() + '-' + date.getDay();

      let arr: any = {
        codigoCliente:   token,
        nombreCliente:   this.clienteForm.controls['Nombre_Cliente'].value,
        ruc:             this.clienteForm.controls['RUC'].value?.replace(/[^0-9.]*/g, ''),
        Direccion:       this.clienteForm.controls['Direccion'].value,
        telefcontacto:   this.clienteForm.controls['Telefono'].value?.replace(/[^0-9.]*/g, ''),
        emailcontacto:   this.clienteForm.controls['email_contacto'].value,
        nombrecontacto:  this.clienteForm.controls['nombre_contacto'].value?.replace(/[^a-zA-Z ]/g, ''),
      }

      setTimeout(() => {        
        this.clienteserv.guardarClientes( arr ).subscribe({
          next: (x) => {
            Toast.fire({ icon: 'success', title: 'Cliente gaurdado con éxito' });
          }, error: (e) => {
            console.error(e);
            Toast.fire({ icon: 'error', title: 'No se ha podido guardar' });
            this._show_spinner = false;
          }, complete: () => {
            this._show_spinner = false;
            // this.clientelista.unshift(arr);
            this.obtenerCliente();
            this.limpiar();
          }
        })
      }, 1000);
    }

  }

  editarClientes() {

    if( this.clienteForm.controls['Nombre_Cliente'].value == null || this.clienteForm.controls['Nombre_Cliente'].value == undefined || this.clienteForm.controls['Nombre_Cliente'].value == ''  ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de nombre cliente vacío' });
    else if( this.clienteForm.controls['RUC'].value == null || this.clienteForm.controls['RUC'].value == undefined || this.clienteForm.controls['RUC'].value == ''  ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de RUC cliente vacío' });
    else if( this.clienteForm.controls['Telefono'].value == null || this.clienteForm.controls['Telefono'].value == undefined || this.clienteForm.controls['Telefono'].value == ''  ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de Telefono cliente vacío' });
    else {
      let arr: any = {
        id:              this.idlciente,
        codigoCliente:   this.codigoCliente,
        nombreCliente:   this.clienteForm.controls['Nombre_Cliente'].value,
        ruc:             this.clienteForm.controls['RUC'].value?.replace(/[^0-9.]*/g, ''),
        Direccion:       this.clienteForm.controls['Direccion'].value,
        telefcontacto:   this.clienteForm.controls['Telefono'].value?.replace(/[^0-9.]*/g, ''),
        emailcontacto:   this.clienteForm.controls['email_contacto'].value,
        nombrecontacto:  this.clienteForm.controls['nombre_contacto'].value?.replace(/[^a-zA-Z ]/g, ''),
      }

      this._show_spinner = true;

      this.clienteserv.actualizarCliente(arr).subscribe({
        next: ( x ) => {
          Toast.fire({ icon: 'success', title: 'Cliente actualizado con éxito' });
          this._show_spinner = false;
        }, error: (e) => {
          Toast.fire({ icon: 'error', title: 'Algo ha pasado' });
          this._show_spinner = false;
        }, complete: () => {
          this._show_spinner = false;
          this.obtenerCliente();
          this.limpiar();
        }
      })
    }
  }

  obtenerCuentaTransac(data:any) {
    //console.log(data)
    this.clienteserv.obtenerCuentaTransacCant(data.id).subscribe({
      next: (x) => {
        //console.warn(x);
      }
    })
  }

  obtenerCuentaBancariaCliente(id:number) {
    console.log('id cliente')
    console.log(id)
    this._show_spinner = true;
    this.cuentaslista = [];
    this.clienteserv.obtenerCuentaCliente(id).subscribe({
      next: ( cuentas ) => {
        this.cuentaslista = cuentas;
        console.log('Obteniendo');
        console.log(this.cuentaslista);
        this._show_spinner = false;
      }, error:(e) => {
        console.error(e);
        this._show_spinner = false;
      }
    })
  }

  eliminarCuentaCliente(cuenta:any, i:number) {
    this._show_spinner = true;
    this.ctabancarias.eliminarCuentaBancaria(cuenta.id).subscribe({
      next:(x) => {
        Toast.fire({ icon: 'success', title: 'Cuenta bancaria eliminada' });
        this._show_spinner = false;
      }, error: (e) => {
        Toast.fire({ icon: 'error', title: 'Algo ha pasado' });
        this._show_spinner = false;
      }, complete: () => {
        this.cuentaslista.splice(i, 1);
      }
    })

  }
  
  codigoCliente:any;
  idlciente:any;
  catchData(data:any) {
    this.calwidth = true;
    this.widthAutom();
    this.idlciente = data.id;
    this.codigoCliente = data.codigoCliente;
    this.clienteForm.controls['Nombre_Cliente'].setValue(data.nombreCliente);
    this.clienteForm.controls['RUC'].setValue(data.ruc);
    this.clienteForm.controls['Direccion'].setValue(data.direccion);
    this.clienteForm.controls['Active'].setValue(data.active);
    this.clienteForm.controls['Telefono'].setValue(data.telefcontacto);
    this.clienteForm.controls['email_contacto'].setValue(data.emailcontacto);
    this.clienteForm.controls['nombre_contacto'].setValue(data.nombrecontacto);
    this._action_butto = 'Editar'
    this._cancel_button = true;
    this.viewForm = true;
  }

  eliminarUsuario(data:any, index:number) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "Esta acción es irreversible y podría provocar perdida de datos en otros procesos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._show_spinner = true;  
        this.clienteserv.eliminarCliente( data.id ).subscribe({
          next: (x) => {
            this._show_spinner = false;
            Swal.fire (
              'Deleted!',
              'Cliente eliminado',
              'success'
            )
          }, error: (e) => {
            console.error(e);
            this._show_spinner = false;
            Swal.fire(
              'Upps!',
              'No hemos podido eliminar este cliente',
              'error'
            )
          }, complete: () => {
            this.obtenerCliente();
            this.limpiar();
          } 
          })
        }
    })
  }

  limpiar() {
    this.clienteForm.controls['Nombre_Cliente'].setValue('');
    this.clienteForm.controls['RUC'].setValue('');
    this.clienteForm.controls['Direccion'].setValue('');
    this.clienteForm.controls['Active'].setValue('A');
    this.clienteForm.controls['Telefono'].setValue('');
    this.clienteForm.controls['email_contacto'].setValue('')
    this.clienteForm.controls['nombre_contacto'].setValue('')
    this._action_butto = 'Crear'
    this._cancel_button = false;
    this.viewForm = false;
    this._width_table = 'tabledata table-responsive w-100 p-2';
    this._create_show = true;
  }


  openDialogCrearCuentaBancaria(data:any, action:string): void {
    let modelData: any;
    switch( action ) {
      case 'C':
        modelData = {
          "id":             data.id,
          "codigoCliente":  data.codigoCliente,
          "nombreCliente":  data.nombreCliente,
          "ruc":            data.ruc,
          "direccion":      data.direccion,
          "telefcontacto":  data.telefcontacto,
          "emailcontacto":  data.emailcontacto,
          "nombrecontacto": data.nombrecontacto,
          "action":         action
        }
        break;
      case 'E':
        let nombreCliente:any;
        this.clientelista.filter((element:any)=> {
          if( element.codigoCliente == data.codigoCliente) nombreCliente = element.nombreCliente;
        })

        modelData = {
          "id": data.id,
          "nombreCliente": nombreCliente,
          "codigoCliente": data.codigoCliente,
          "codcuentacontable": data.codcuentacontable,
          "nombanco": data.nombanco,
          "numerocuenta": data.numerocuenta,
          "tipoCuenta": data.tipoCuenta,
          "observacion": data.observacion,
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
      ////////console.warn(result);
      this.obtenerCliente();
    });

  }

  openDialogAsignarLocalidad(data:any): void {

    console.log(data);

    const dialogRef = this.dialog.open( ModalLocalidadClienteComponent, {
      height: 'auto',
      width:  '80%',
      data: data, 
    });

    dialogRef.afterClosed().subscribe( result => {
      ////////console.warn(result);
      // this.obtenerCliente();
    });

  }
  
  openDialogUsuariosAsignados(data:any): void {


    const dialogRef = this.dialog.open( ModalUsuariosTemporalesComponent, {
      height: 'auto',
      width:  '80%',
      data: data, 
    });


    dialogRef.afterClosed().subscribe( result => {      
      ////////console.warn(result);
      this.obtenerCliente();
    });


  }

}