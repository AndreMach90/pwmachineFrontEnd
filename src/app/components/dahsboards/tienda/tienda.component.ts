import { Component, OnInit } from '@angular/core';
import { ServicesSharedService } from '../../shared/services-shared/services-shared.service';
import { ClientesService } from '../cliente/services/clientes.service';
import { MatDialog } from '@angular/material/dialog';
import { Environments } from '../../environments/environments';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TiendaService } from './services/tienda.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import Swal from 'sweetalert2';
import { ModalTiendaCuentaComponent } from './modal-tienda-cuenta/modal-tienda-cuenta.component';
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
  },
});

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.scss'],
})

export class TiendaComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public provinciaLista:  any = [];
  _width_table: string = 'tabledata table-responsive w-100 p-2';
  
  delete: any = this.env.apiUrlIcon() + 'delete.png';
  edit:   any = this.env.apiUrlIcon() + 'edit.png';
  crear:  any = this.env.apiUrlIcon() + 'accept.png';
  cancel: any = this.env.apiUrlIcon() + 'cancel.png';
  search: any = this.env.apiUrlIcon() + 'search.png';
  add:    any = this.env.apiUrlIcon() + 'add.png';

  localidadesGuardadasCliente:  any = [];
  listaCuentaTiendasBanc:       any = [];
  tiendalista:                  any = [];
  modelTienda:                  any = [];
  clienteListaGhost:            any = [];
  clientelista:                 any = [];
  resultModal:                  any = [];
  tiendaListaGhost:             any = [];
  cuentaslista:                 any = [];

  dis_account_shop: boolean = false;
  viewForm:         boolean = false;
  editcatch:        boolean = false;
  tiendasForm:      boolean = false;
  _edit_btn:        boolean = false;
  _show_spinner:    boolean = false;
  _cancel_button:   boolean = false;
  _delete_show:     boolean = true;
  _edit_show:       boolean = true;
  _create_show:     boolean = true;
  _form_create:     boolean = true;
  permisonUsers:    boolean = true;
  calwidth:         boolean = true;
  addOnBlur                 = true;
  
  _icon_button:     string = 'add';
  _action_butto            = 'Crear';
  
  tipoAccion:       number = 0;
  count:            number = 0;
  idtienda:         number = 0;
  
  namemodulo:       any = '';
  primary:          any;
  secondary:        any;
  secondary_a:      any;
  secondary_b:      any;
  intervalId:       any;
  token:            any;
  codecTienda:      any;
  codcli:           any;

  public tiendaForm = new FormGroup({
    codigoClienteidFk: new FormControl('', [Validators.required]),
    nombreTienda:      new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    telefono:          new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    direccion:         new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    nombreAdmin:       new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    telfAdmin:         new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    emailAdmin:        new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    codProv:           new FormControl('', [Validators.required])
  });

  public filtertienForm = new FormGroup({
    filtertien: new FormControl(),
  });

  constructor(
    private env: Environments,
    private controlInputsService: ControlinputsService,
    private tiendaservs: TiendaService,
    public dialog: MatDialog,
    private clienteserv: ClientesService,
    private loc: ModalClienteService,
    private sharedservs: ServicesSharedService
  ) {}

  ngOnInit(): void {
    let x: any = this.sharedservs.validateRol();
    switch (x) {
      case 1:
        this.permisonUsers = true;
        break;
      case 0:
        this.permisonUsers = false;
        break;
    }
    this.primary = this.env.appTheme.colorPrimary;
    this.secondary = this.env.appTheme.colorSecondary_C;
    this.secondary_a = this.env.appTheme.colorSecondary_A;
    this.secondary_b = this.env.appTheme.colorSecondary_B;
    this.obtenerCliente();
    this.obtenerTiendas(1);
  }

  onSubmit() {
    if (this.tiendaForm.invalid) {
      this.markFormGroupTouched(this.tiendaForm);
      return;
    }
    this._action_butto === 'Crear' ? this.guardarTienda() : this.editarTienda();
  }

  widthAutom() {
    switch (this.calwidth) {
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
    this.tiendaForm.controls['nombreTienda'].setValue('');
    this.tiendaForm.controls['telefono'].setValue('');
    this.tiendaForm.controls['direccion'].setValue('');
    this.tiendaForm.controls['nombreAdmin'].setValue('');
    this.tiendaForm.controls['telfAdmin'].setValue('');
    this.tiendaForm.controls['emailAdmin'].setValue('');
    this.tiendaForm.controls['codProv'].setValue('');
    this._action_butto = 'Crear';
    this.cuentaslista = [];
    this.resultModal = [];
    this._cancel_button = false;
    this.tiendasForm = false;
    this.tipoAccion = 0;
    this.editcatch = false;
    this._create_show = true;
    this.dis_account_shop = false;
  }

  validateInputText(data: any) {
    this.controlInputsService.validateAndCleanInput(data);
  }

  validateInputNumber(data: any) {
    this.controlInputsService.validateAndCleanNumberInput(data);
  }

  eliminarTiendas(data: any, i: number) {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Esta acción es irreversible y podría provocar perdida de datos en otros procesos!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._show_spinner = true;
        this.tiendaservs.eliminarTiendas(data.id).subscribe({
          next: (x) => {
            this._show_spinner = false;
            Swal.fire('Eliminado!', 'Tienda eliminado', 'success');
          },
          error: (e) => {
            console.error(e);
            this._show_spinner = false;
            Swal.fire('Upps!', 'No hemos podido eliminar esta Tienda', 'error');
          },
          complete: () => {
            this.obtenerTiendas(1);
            this.limpiar();
          },
        });
      }
    });
  }

  limpiar() {
    this.tiendaForm.controls['codigoClienteidFk'].setValue('');
    this.tiendaForm.controls['nombreTienda'].setValue('');
    this.tiendaForm.controls['telefono'].setValue('');
    this.tiendaForm.controls['direccion'].setValue('');
    this.tiendaForm.controls['nombreAdmin'].setValue('');
    this.tiendaForm.controls['telfAdmin'].setValue('');
    this.tiendaForm.controls['emailAdmin'].setValue('');
    this.tiendaForm.controls['codProv'].setValue('');
    this._action_butto = 'Crear';
    this.cuentaslista = [];
    this.resultModal = [];
    this._cancel_button = false;
    this.tiendasForm = false;
    this.tipoAccion = 0;
    this.editcatch = false;
    this._create_show = true;
    this.dis_account_shop = false;
    this.viewForm = false;
    this._width_table = 'tabledata table-responsive w-100 p-2';
    this.resetFormGroup(this.tiendaForm);
  }

  editarTienda() {
    this._show_spinner = true;
    this.modelTienda = {
      codigoTienda:       this.codecTienda,
      codigoClienteidFk:  this.tiendaForm.controls['codigoClienteidFk'].value,
      nombreTienda:       this.tiendaForm.controls['nombreTienda'].value,
      telefono:           this.tiendaForm.controls['telefono'].value!.replace(/[^0-9.]*/g,''),
      direccion:          this.tiendaForm.controls['direccion'].value,
      nombreAdmin:        this.tiendaForm.controls['nombreAdmin'].value?.toString().replace(/[^a-zA-Z ]/g, ''),
      telfAdmin:          this.tiendaForm.controls['telfAdmin'].value?.replace(/[^0-9.]*/g,''),
      emailAdmin:         this.tiendaForm.controls['emailAdmin'].value,
      codProv:            this.tiendaForm.controls['codProv'].value?.toString().trim(),
      idCentroProceso:    null,
      Active:             'A',
    };
    this.tiendaservs.editarTiendas(this.modelTienda).subscribe({
      next: (x) => {
        Toast.fire({ icon: 'success', title: 'Tienda editar con éxito' });
        this._show_spinner = false;
      }, error: (e) => {
        Toast.fire({
          icon: 'error',
          title: 'No hemos podido editar esta tienda',
        });
        this._show_spinner = false;
      }, complete: () => {
        this.obtenerTiendas(1);
        this.limpiar();
      },
    });
  }

  generarCodectienda(): string {
    let date = new Date();
    this.token = 'TI-' + this.tiendaForm.controls['nombreTienda'].value?.slice(0, 5).replace(' ', '_') + '-' +
                  this.sharedservs.generateRandomString(10) + '-' + date.getFullYear() + '-' + date.getDay();
    return this.token;
  }

  guardarTienda() {
    this._show_spinner = true;
    this._create_show = false;
    this.modelTienda = {
      codigoTienda:       this.generarCodectienda(),
      codigoClienteidFk:  this.tiendaForm.controls['codigoClienteidFk'].value,
      nombreTienda:       this.tiendaForm.controls['nombreTienda'].value,
      telefono:           this.tiendaForm.controls['telefono'].value!.replace(/[^0-9.]*/g,''),
      direccion:          this.tiendaForm.controls['direccion'].value,
      nombreAdmin:        this.tiendaForm.controls['nombreAdmin'].value!.toString().replace(/[^a-zA-Z ]/g, ''),
      telfAdmin:          this.tiendaForm.controls['telfAdmin'].value!.replace(/[^0-9.]*/g,''),
      emailAdmin:         this.tiendaForm.controls['emailAdmin'].value,
      codProv:            this.tiendaForm.controls['codProv'].value!.toString().trim(),
      idCentroProceso:    null,
      Active:             'A',
    };
    setTimeout(() => {
      this.tiendaservs.guardarTiendas(this.modelTienda).subscribe({
        next: (x) => {
          Toast.fire({ icon: 'success', title: 'Tienda guardado con éxito' });
          this._show_spinner = false;
        }, error: (e) => {
          Toast.fire({
            icon: 'error',
            title: 'No hemos podido guardar esta tienda',
          });
          this._show_spinner = false;
        }, complete: () => {
          this.obtenerTiendas(2);
        },
      });
    }, 1000);
  }

  obtenerTiendas(type: number) {
    this.tiendaservs.obtenerTiendas().subscribe({
      next: (tienda) => {
        this.tiendalista = tienda;
        this.tiendaListaGhost = tienda;
      },
      complete: () => {
        switch (type) {
          case 1:
            break;
          case 2:
            this.tiendalista.filter((tienda: any) => {
              if (tienda.codigoTienda == this.token) {
                this.resultModal.filter((element: any) => {
                  let arr: any = {
                    idtienda: tienda.codigoTienda,
                    idcuentabancaria: element.id,
                    fcrea: new Date(),
                  };
                  this.tiendaservs.guardarCuentAsigna(arr).subscribe({
                    next: (x) => {},
                    error: (e) => console.error(e),
                    complete: () => {
                      tienda.cantidadCuentasAsign++;
                      this.limpiar();
                    },
                  });
                });
              }
            });
        }
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  catchData(data: any) {
    this.calwidth = true;
    this.dis_account_shop = true;
    this.resultModal = [];
    this.viewForm = true;
    this.tipoAccion = 1;
    this.idtienda = data.id;
    this.codecTienda = data.codigoTienda;
    this.tiendaForm.controls['codigoClienteidFk'].setValue(data.codigoCliente);
    this.obtenerLocalidad();
    this.editcatch = true;
    this.tiendaForm.controls['nombreTienda'].setValue(data.nombreTienda);
    this.tiendaForm.controls['telefono'].setValue(data.telefono);
    this.tiendaForm.controls['direccion'].setValue(data.direccion);
    this.tiendaForm.controls['nombreAdmin'].setValue(data.nombreAdmin);
    this.tiendaForm.controls['telfAdmin'].setValue(data.telfAdmin);
    this.tiendaForm.controls['emailAdmin'].setValue(data.emailAdmin);
    this._action_butto = 'Editar';
    setTimeout(() => {
      this.localidadesGuardadasCliente.filter((x:any) => x.codigo = x.codigo.toString().trim());
      this.tiendaForm.controls['codigoClienteidFk'].disable();
      this.tiendaForm.controls['codProv'].setValue(data.codProv.toString().trim());
    }, 500);
  }

  obtenerCliente() {
    this.clientelista = [];
    this._show_spinner = true;
    this.clienteserv.ObtenerClienteSelect().subscribe({
      next: (cliente) => {
        this.clientelista = cliente;
        this.clienteListaGhost = cliente;
        this._show_spinner = false;
      },
      error: (e) => {
        this._show_spinner = false;
        console.error(e);
      },
    });
  }

  filterTienda() {
    let filtertien: any = this.filtertienForm.controls['filtertien'].value;
    this.tiendalista = this.tiendaListaGhost.filter(
      (item: any) =>
        item.nombreTienda.toLowerCase().includes(filtertien.toLowerCase()) ||
        item.nombreCliente.toLowerCase().includes(filtertien.toLowerCase())
    );
    this.tiendalista = this.tiendaListaGhost.filter(
      (item: any) =>
        item.nombreTienda.toLowerCase().includes(filtertien.toLowerCase()) ||
        item.nombreCliente.toLowerCase().includes(filtertien.toLowerCase())
    );
  }

  obtenerCuentaBancariaCliente() {
    this._show_spinner = true;
    this.cuentaslista = [];
    let id: any = this.tiendaForm.controls['codigoClienteidFk'].value;
    this.codcli = id;
    this.obtenerLocalidad();
    this.clienteserv.obtenerCuentaCliente(id).subscribe({
      next: (cuentas) => {
        this.cuentaslista = cuentas;
        this._show_spinner = false;
      },
      error: (e) => {
        console.error(e);
        this._show_spinner = false;
      },
    });
  }

  eliminarCuentaBancaria(index: number) {
    this.resultModal.splice(index, 1);
  }

  getDataMaster(cod: string) {
    this.sharedservs.getDataMaster(cod).subscribe({
      next: (data) => {
        switch (cod) {
          case 'PRV00':
            this.provinciaLista = data;
            break;
        }
      },
    });
  }

  obtenerLocalidad() {
    this.localidadesGuardadasCliente = [];
    let id: any = this.tiendaForm.controls['codigoClienteidFk'].value;
    this.tiendaForm.controls['codProv'].setValue(null);
    this._show_spinner = true;
    this.loc.obtenerLocalidadesCliente(id).subscribe({
      next: (x) => {
        this.localidadesGuardadasCliente = x;
      },
      complete: () => {
        this._show_spinner = false;
      },
      error: (e) => {
        console.error(e);
        this._show_spinner = false;
      },
    });
  }

  openDialogCuentas(data: any): void {
    console.log(data);
    this.obtenerCuentasTienda(data.codigoTienda);
    this._show_spinner = true;
    setTimeout(() => {
      const dialogRef = this.dialog.open(ModalTiendaCuentaComponent, {
        height: 'auto',
        width: '50%',
        data: {
          nombreCliente: data.nombreCliente,
          idCLiente: data.codigoCliente,
          res: this.listaCuentaTiendasBanc,
          type: 0,
          codigoTiendaEdicion: data.codigoTienda,
        },
      });
      this._show_spinner = false;
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result != null || result != undefined) {
          result.filter((res: any) => {
            this.obtenerTiendas(1);
            this.resultModal.push(res);
          });
          this.validationCtaBancarias();
        }
      });
    }, 1000);
  }

  validationCtaBancarias() {
    if (this.resultModal.length > 0) {
      this.tiendasForm = true;
      this.tiendaForm.controls['codigoClienteidFk'].disable();
    }
  }

  obtenerCuentasTienda(id: any) {
    this.listaCuentaTiendasBanc = [];
    this.tiendaservs.obtenerCuentasAsignadas(id).subscribe({
      next: (cuentaTiendaBank) => {
        this.listaCuentaTiendasBanc = cuentaTiendaBank;
      },
      error: (e) => console.error(e),
      complete: () => {
        if (this.editcatch) {
          this.listaCuentaTiendasBanc.filter((element: any) => {
            this.resultModal.push(element);
          });
          this.validationCtaBancarias();
        }
      },
    });
  }

  eliminarCuentaTienda(data: any, id: number) {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Esta acción es irreversible y podría provocar perdida de datos en otros procesos!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._show_spinner = true;
        this.tiendaservs.eliminarCuentasAsignadas(data.id).subscribe({
          next: (x) => {
            this._show_spinner = false;
            Swal.fire('Eliminado!', 'Cuenta eliminada', 'success');
          }, error: (e) => {
            this._show_spinner = false;
            Swal.fire('Upps!', 'No hemos podido eliminar esta cuenta', 'error');
          }, complete: () => {
            this.eliminarCuentaBancaria(id);
            this.obtenerTiendas(1);
          },
        });
      }
    });
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
