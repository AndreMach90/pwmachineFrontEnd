import { Component, OnInit } from '@angular/core';
import { ServicesSharedService } from '../../shared/services-shared/services-shared.service';
import { ClientesService } from '../cliente/services/clientes.service';
import { MatDialog } from '@angular/material/dialog';
import { Environments } from '../../environments/environments';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TiendaService } from './services/tienda.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import Swal from 'sweetalert2'
import { ModalTiendaCuentaComponent } from './modal-tienda-cuenta/modal-tienda-cuenta.component';
import { elementAt } from 'rxjs';
import { ControlinputsService } from '../../shared/services/controlinputs.service';
import { ModalClienteService } from '../cliente/modal-localidad-cliente/services/modal-cliente.service';

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
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.scss']
})
export class TiendaComponent implements OnInit {
  dis_account_shop:       boolean = false;
  _width_table:            string = 'tabledata table-responsive w-100 p-2';
  delete:                     any = this.env.apiUrlIcon()+'delete.png';
  edit:                       any = this.env.apiUrlIcon()+'edit.png';
  crear:                      any = this.env.apiUrlIcon()+'accept.png';
  cancel:                     any = this.env.apiUrlIcon()+'cancel.png';
  search:                     any = this.env.apiUrlIcon()+'search.png';
  add:                        any = this.env.apiUrlIcon()+'add.png';
  viewForm:               boolean = false;
  public provinciaLista:      any = [];
  _edit_btn:              boolean = false;
  _delete_show:           boolean = true;
  _edit_show:             boolean = true;
  _create_show:           boolean = true;
  _form_create:           boolean = true;
  _action_butto                   = 'Crear';
  _show_spinner:          boolean = false;
  _icon_button:            string = 'add';
  _cancel_button:         boolean = false;
  tiendalista:                any = []
  editcatch:              boolean = false;
  listaCuentaTiendasBanc:     any = [];
  modelTienda:                any = [];
  clienteListaGhost:          any = [];
  clientelista:               any = [];
  primary:                    any;
  secondary:                  any;
  secondary_a:                any;
  secondary_b:                any;
  namemodulo:                 any = '';
  permisonUsers:          boolean = true;
  calwidth:               boolean = true;
  resultModal:                any = [];
  addOnBlur                       = true;
  readonly separatorKeysCodes     = [ENTER, COMMA] as const;
  tipoAccion:              number = 0;
  token:                      any;
  tiendaListaGhost:           any = [];
  count:                   number = 0;
  intervalId:                 any;  
  cuentaslista:               any = [];
  codecTienda:                any;
  idtienda:                number = 0;

  public tiendaForm = new FormGroup({
    codigoClienteidFk:     new FormControl(''), 
    cuentaBanco:           new FormControl(''), 
    nombreTienda:          new FormControl(''), 
    telefono:              new FormControl(''), 
    direccion:             new FormControl(''),
    nombreAdmin:           new FormControl(''), 
    telfAdmin:             new FormControl(''),
    emailAdmin:            new FormControl(''),
    codProv:               new FormControl('')
  })

  public filtertienForm = new FormGroup({
    filtertien: new FormControl()
  })

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
    this.primary     = this.env.appTheme.colorPrimary;
    this.secondary   = this.env.appTheme.colorSecondary_C;
    this.secondary_a = this.env.appTheme.colorSecondary_A;
    this.secondary_b = this.env.appTheme.colorSecondary_B;
    this.obtenerCliente();
    this.obtenerTiendas(1);
  }
    
  widthAutom() {
    switch( this.calwidth ) {
      case true:
        this._width_table = 'tabledata table-responsive w-75 p-2';
        this.calwidth = false;
        break;
      case false:        
        this._width_table = 'tabledata table-responsive w-100 p-2';
        this.calwidth = true;
        break;
    }
    this.tiendaForm.controls['codigoClienteidFk'].enable();
    this.tiendaForm.controls['codigoClienteidFk'].setValue('');
    this.tiendaForm.controls['cuentaBanco'].setValue('');
    this.tiendaForm.controls['nombreTienda'].setValue('');
    this.tiendaForm.controls['telefono'].setValue('');
    this.tiendaForm.controls['direccion'].setValue('');
    this.tiendaForm.controls['nombreAdmin'].setValue('');
    this.tiendaForm.controls['telfAdmin'].setValue('');
    this.tiendaForm.controls['emailAdmin'].setValue('');
    this.tiendaForm.controls['codProv'].setValue('');
    this._action_butto    = 'Crear';
    this.cuentaslista     = [];
    this.resultModal      = [];
    this._cancel_button   = false;
    this.tiendasForm      = false;
    this.tipoAccion       = 0;
    this.editcatch        = false;
    this._create_show     =  true;
    this.dis_account_shop = false;
  }

  constructor( private env:                  Environments,
               private controlInputsService: ControlinputsService,
               private tiendaservs:          TiendaService,
               public dialog:                MatDialog,
               private clienteserv:          ClientesService,
               private loc:                  ModalClienteService,
               private sharedservs:          ServicesSharedService) {}

  validateInputText(data:any) {
    this.controlInputsService.validateAndCleanInput(data);
  }
    
  validateInputNumber(data: any) {
    this.controlInputsService.validateAndCleanNumberInput(data);
  }

  eliminarTiendas( data:any, i:number ) {
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
        this.tiendaservs.eliminarTiendas( data.id ).subscribe({
          next: (x) => {
            this._show_spinner = false;
            Swal.fire (
              'Deleted!',
              'Tienda eliminado',
              'success'
            )
          }, error: (e) => {
            console.error(e);
            this._show_spinner = false;
            Swal.fire(
              'Upps!',
              'No hemos podido eliminar esta Tienda',
              'error'
            )
          }, complete: () => {
            this.obtenerTiendas(1);
            this.limpiar();
          } 
        })
      }
    })
  }

  limpiar() {
    this.tiendaForm.controls['codigoClienteidFk'].setValue('');
    this.tiendaForm.controls['cuentaBanco'].setValue('');
    this.tiendaForm.controls['nombreTienda'].setValue('');
    this.tiendaForm.controls['telefono'].setValue('');
    this.tiendaForm.controls['direccion'].setValue('');
    this.tiendaForm.controls['nombreAdmin'].setValue('');
    this.tiendaForm.controls['telfAdmin'].setValue('');
    this.tiendaForm.controls['emailAdmin'].setValue('');
    this.tiendaForm.controls['codProv'].setValue('');
    this._action_butto    = 'Crear';
    this.cuentaslista     = [];
    this.resultModal      = [];
    this._cancel_button   = false;
    this.tiendasForm      = false;
    this.tipoAccion       = 0;
    this.editcatch        = false;
    this._create_show     =  true;
    this.dis_account_shop = false;
    this.viewForm         = false;
    this._width_table     = 'tabledata table-responsive w-100 p-2';
  }

  onSubmit() {
    switch(this._action_butto) {
      case 'Crear':
        this.guardarTienda();
        break;
      case 'Editar':
        this.editarTienda();
        break;
    }
  }

  editarTienda() {
    if( this.tiendaForm.controls['nombreTienda'].value == undefined || this.tiendaForm.controls['nombreTienda'].value == null || this.tiendaForm.controls['nombreTienda'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de nombre tienda vacío' });
    else if (this.tiendaForm.controls['telefono'].value == undefined || this.tiendaForm.controls['telefono'].value == null || this.tiendaForm.controls['nombreTienda'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo teléfono de tienda vacío' });
    else if (this.tiendaForm.controls['direccion'].value == undefined || this.tiendaForm.controls['direccion'].value == null || this.tiendaForm.controls['nombreTienda'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo direcció de tienda vacío' });
    else {
      this._show_spinner = true;
      this.modelTienda = {
        codigoTienda:       this.codecTienda,
        codigoClienteidFk:  this.tiendaForm.controls['codigoClienteidFk'].value,
        cuentaBanco:        this.tiendaForm.controls['cuentaBanco'].value,
        nombreTienda:       this.tiendaForm.controls['nombreTienda'].value,
        telefono:           this.tiendaForm.controls['telefono'].value.replace(/[^0-9.]*/g, ''),
        direccion:          this.tiendaForm.controls['direccion'].value,
        nombreAdmin:        this.tiendaForm.controls['nombreAdmin'].value?.toString().replace(/[^a-zA-Z ]/g, ''),
        telfAdmin:          this.tiendaForm.controls['telfAdmin'].value?.replace(/[^0-9.]*/g, ''),
        emailAdmin:         this.tiendaForm.controls['emailAdmin'].value,
        codProv:            this.tiendaForm.controls['codProv'].value?.toString().trim(),
        idCentroProceso:    null,
        Active: 'A'
      }

      this.tiendaservs.editarTiendas(this.modelTienda).subscribe({
        next:(x) => {
          Toast.fire({ icon: 'success', title: 'Tienda editar con éxito' });
          this._show_spinner = false;
        }, error: (e) => {
          Toast.fire({ icon: 'error', title: 'No hemos podido editar esta tienda' });
          this._show_spinner = false;
        }, complete: () => {
          this.obtenerTiendas(1);
          this.limpiar();
        }
      })
    }
  }

  generarCodectienda():string {
    let date = new Date();
    this.token = 'TI-'+this.tiendaForm.controls['nombreTienda'].value?.slice(0,5).replace(' ', '_') +'-' + this.sharedservs.generateRandomString(10) + '-' + date.getFullYear() + '-' + date.getDay();
    return this.token;
  }

  guardarTienda() {
    if( this.tiendaForm.controls['nombreTienda'].value == undefined || this.tiendaForm.controls['nombreTienda'].value == null || this.tiendaForm.controls['nombreTienda'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de nombre tienda vacío' });
    else if (this.tiendaForm.controls['telefono'].value == undefined || this.tiendaForm.controls['telefono'].value == null || this.tiendaForm.controls['nombreTienda'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo teléfono de tienda vacío' });
    else if (this.tiendaForm.controls['direccion'].value == undefined || this.tiendaForm.controls['direccion'].value == null || this.tiendaForm.controls['nombreTienda'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo direcció de tienda vacío' });
    else {    
      this._show_spinner = true;
      this._create_show = false;
      this.modelTienda = {
        codigoTienda:       this.generarCodectienda(),
        codigoClienteidFk:  this.tiendaForm.controls['codigoClienteidFk'].value,
        cuentaBanco:        this.tiendaForm.controls['cuentaBanco'].value,
        nombreTienda:       this.tiendaForm.controls['nombreTienda'].value,
        telefono:           this.tiendaForm.controls['telefono'].value.replace(/[^0-9.]*/g, ''),
        direccion:          this.tiendaForm.controls['direccion'].value,
        nombreAdmin:        this.tiendaForm.controls['nombreAdmin'].value?.toString().replace(/[^a-zA-Z ]/g, ''),
        telfAdmin:          this.tiendaForm.controls['telfAdmin'].value?.replace(/[^0-9.]*/g, ''),
        emailAdmin:         this.tiendaForm.controls['emailAdmin'].value,
        codProv:            this.tiendaForm.controls['codProv'].value?.toString().trim(),
        idCentroProceso:    null,
        Active: 'A'
      }
      console.log(this.modelTienda);
      setTimeout( () => {
        this.tiendaservs.guardarTiendas(this.modelTienda).subscribe({
            next:(x) => {
              Toast.fire({ icon: 'success', title: 'Tienda guardado con éxito' });
              this._show_spinner = false;
            }, error: (e) => {
              Toast.fire({ icon: 'error', title: 'No hemos podido guardar esta tienda' });
              this._show_spinner = false;
            }, complete: () => {
              this.obtenerTiendas(2);
            }
          }
          )
        }, 1000);
    }
  }

  selectTienda() {
    this.tiendalista.filter( (element:any) => { })
  }

  obtenerTiendas(type:number) {
    this.tiendaservs.obtenerTiendas().subscribe({
      next: (tienda) => {
        this.tiendaListaGhost = tienda;
        this.tiendalista = tienda;
      }, complete: () => {
        switch(type) {
          case 1:
            break;
          case 2:
            this.tiendalista.filter(( tienda:any ) => { 
              if(tienda.codigoTienda == this.token) {
                this.resultModal.filter( (element:any) => {
                  let arr:any = {
                    idtienda: tienda.codigoTienda,
                    idcuentabancaria: element.id,
                    fcrea: new Date()
                  }
                  this.tiendaservs.guardarCuentAsigna(arr).subscribe({
                    next:(x) =>
                    { },
                    error: (e) => {
                      console.error(e);
                    }, 
                    complete: () => {
                      tienda.cantidadCuentasAsign ++;
                      this.limpiar();
                    }
                  });
                })
              }
            })
        }
      }, error: (e) => {
        console.error(e);
      }
    })
  }

  validateCatchData(data: any) {
    for ( let x = 0; x<1; x++ ) {
      this.catchData(data);
    }
  }

  catchData(data:any) {
    this.calwidth = true;
    this.widthAutom();
    this.dis_account_shop = true;
    this.resultModal = []
    this.viewForm = true;
    this.tipoAccion = 1;
    this.idtienda = data.id;
    this.codecTienda = data.codigoTienda;
    this.tiendaForm.controls['codigoClienteidFk'].setValue(data.codigoCliente);
    this.tiendaForm.controls['codigoClienteidFk'].setValue(data.codigoCliente);
    this.obtenerCuentaBancariaCliente();
    this.obtenerCuentasTienda(this.codecTienda);
    this.editcatch = true;
    this.tiendaForm.controls['nombreTienda'].setValue(data.nombreTienda);
    this.tiendaForm.controls['telefono'].setValue(data.telefono);
    this.tiendaForm.controls['direccion'].setValue(data.direccion);
    this.tiendaForm.controls['nombreAdmin'].setValue(data.nombreAdmin);
    this.tiendaForm.controls['telfAdmin'].setValue(data.telfAdmin);
    this.tiendaForm.controls['emailAdmin'].setValue(data.emailAdmin);
    this.tiendaForm.controls['codProv'].setValue(data.codProv.toString().trim());
    this._action_butto = 'Editar';
    this._cancel_button = true;
    setTimeout(() => {
      this.tiendaForm.controls['codigoClienteidFk'].disable()
    }, 1000);
  }

  obtenerCliente() {
    this.clientelista = [];
    this._show_spinner = true;
    this.clienteserv.obtenerCliente().subscribe({
      next: (cliente) => {
        this.clienteListaGhost = cliente;
        //console.log('==================================')
        //console.log('Este es el cliente escogido')
        //console.log(this.clienteListaGhost)
        //console.log('==================================')
        this._show_spinner = false;
      }, error: (e) => {
        this._show_spinner = false;
        console.error(e);
      }, complete: () => {
        this.clienteListaGhost.filter( (element:any) => {
          let arr: any = {
            "id": element.id,
            "codigoCliente": element.codigoCliente,
            "nombreCliente": element.nombreCliente,
            "ruc": element.ruc,
            "direccion": element.direccion,
            "telefcontacto": element.telefcontacto,
            "emailcontacto": element.emailcontacto,
            "nombrecontacto": element.nombrecontacto
          }
          this.clientelista.unshift(arr);
      })
      }
    })
  }

  filterTienda () {
    let filtertien: any = this.filtertienForm.controls['filtertien'].value;
    this.tiendalista = this.tiendaListaGhost.filter( (item:any) => 
      item.nombreTienda   .toLowerCase().includes(filtertien.toLowerCase()) ||
      item.nombreProvincia.toLowerCase().includes(filtertien.toLowerCase()) ||
      item.nombreAdmin    .toLowerCase().includes(filtertien.toLowerCase()) ||
      item.nombreCliente  .toLowerCase().includes(filtertien.toLowerCase()) 
    );
    this.tiendalista = this.tiendaListaGhost.filter( (item:any) => 
      item.nombreTienda   .toLowerCase().includes(filtertien.toLowerCase()) ||
      item.nombreProvincia.toLowerCase().includes(filtertien.toLowerCase()) ||
      item.nombreAdmin    .toLowerCase().includes(filtertien.toLowerCase()) ||
      item.nombreCliente  .toLowerCase().includes(filtertien.toLowerCase()) 
    );
  }

  codcli: any;
  obtenerCuentaBancariaCliente() {
    this._show_spinner = true;
    this.cuentaslista = [];
    let id: any = this.tiendaForm.controls['codigoClienteidFk'].value;
    this.codcli = id;
    this.obtenerLocalidad(id)
    this.clienteserv.obtenerCuentaCliente(id).subscribe({
      next: ( cuentas ) => {
        this.cuentaslista  = cuentas;
        this._show_spinner = false;
      }, error:(e) => {
        console.error(e);
        this._show_spinner = false;
      }
    })
  }

  eliminarCuentaBancaria(index: number) {
    this.resultModal.splice(index, 1);
  }

  getDataMaster(cod:string) {
    this.sharedservs.getDataMaster(cod).subscribe({
      next: (data) => {
        switch(cod) {
        case 'PRV00':
          this.provinciaLista = data;
          break;
        }
      }
    }) 
  }

  localidadesGuardadasCliente: any = [];
  obtenerLocalidad(id:any) {
    this._show_spinner = true;
    this.loc.obtenerLocalidadesCliente( id ).subscribe({
      next: (x) => {
        this.localidadesGuardadasCliente = x;
      }, complete: () => {
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }
    })
  }



  openDialogCuentas( data:any ): void {
    this.obtenerCuentasTienda(data.codigoTienda);
    let nombreCliente: string = '';
    let idCLiente:     number = 0;
    const xuser: any = sessionStorage.getItem('usuario');
    this.clienteListaGhost.filter( ( element:any ) => {
        if ( data.codigoCliente == element.codigoCliente ) {

          console.log('data entrada')
          console.log(element)

          nombreCliente = element.nombreCliente;
          idCLiente     = element.id;
        }
    })
    this._show_spinner = true;
    setTimeout(() => {
      const dialogRef = this.dialog.open( ModalTiendaCuentaComponent, {
        height: 'auto',
        width:  '50%',
        data: {
          nombreCliente: nombreCliente,
          idCLiente: idCLiente,
          res:  this.listaCuentaTiendasBanc,
          type: 0,
          codigoTiendaEdicion: data.codigoTienda
        },
      });
      this._show_spinner = false;
      dialogRef.afterClosed().subscribe( (result:any) => { 
        if ( result != null ||  result != undefined ) {
            result.filter( (res:any) => {
              this.obtenerTiendas(1)
              this.resultModal.push(res);
            }
          )          
          this.validationCtaBancarias();
        }
      }
    );
    }, 2000); 

  }

  tiendasForm: boolean = false;
  validationCtaBancarias() {
    if( this.resultModal.length > 0 ) {
      this.tiendasForm = true;
      this.tiendaForm.controls['codigoClienteidFk'].disable();
    }
  }

  obtenerCuentasTienda(id:any) {
    console.log(id)
    this.listaCuentaTiendasBanc = [];
    this.tiendaservs.obtenerCuentasAsignadas(id).subscribe({
      next: (cuentaTiendaBank) => {
        this.listaCuentaTiendasBanc = cuentaTiendaBank;
        console.warn(this.listaCuentaTiendasBanc);
      }, error: (e) => {
        console.error(e);
      }, complete: () => {
        if( this.editcatch ) {
          
          this.listaCuentaTiendasBanc.filter( ( element:any ) => {
            this.resultModal.push(element);
          })

          this.validationCtaBancarias();
        }
      }
    })
  }

  eliminarCuentaTienda(data:any, id:number) {

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
            this.tiendaservs.eliminarCuentasAsignadas( data.id ).subscribe({
              next: (x) => {
                this._show_spinner = false;
                Swal.fire (
                  'Deleted!',
                  'Cuenta asignada, eliminada',
                  'success'
                )
              }, error: (e) => {
                console.error(e);
                this._show_spinner = false;
                Swal.fire(
                  'Upps!',
                  'No hemos podido eliminar esta cuenta',
                  'error'
                )
              }, complete: () => {
                this.eliminarCuentaBancaria(id);
                this.obtenerTiendas(1);
              } 
              })
            }
        })
    }
  
  
}