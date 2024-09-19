import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Environments } from '../../environments/environments';
import { TiendaService } from '../tienda/services/tienda.service';
import { MatDialog } from '@angular/material/dialog';
import { ClientesService } from '../cliente/services/clientes.service';
import { ServicesSharedService } from '../../shared/services-shared/services-shared.service';
import { EquipoService } from './services/equipo.service';
import Swal from 'sweetalert2'
import { UsuariosTemporalesMaquinaComponent } from './usuarios-temporales-maquina/usuarios-temporales-maquina.component';
import { ControlinputsService } from '../../shared/services/controlinputs.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { OverlayPanel } from 'primeng/overlaypanel';

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
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.scss']
})

export class EquipoComponent implements OnInit {
  @ViewChild('op') overlayPanel!: OverlayPanel;
  private usuarioTemporalHub: HubConnection;
  private urlHub: any = this.env.apiUrlHub();

  modelDatosPersonales:      any = [];
  listaUsuariosMaquina:      any = [];
  listaUsuariosMaquinaGhost: any = [];
  tiendalista:               any = [];
  modelUsers:                any = [];
  modeloEquipos:             any = [];
  clientelista:              any = [];
  listaEsquipo:              any = [];
  listaEsquipoGhost:         any = [];
  arrIp:                     any = [];
  listaIps:                  any = [];
  listaMarcas:               any = [];
  listaModelos:              any = [];
  tipomaqlista:              any = [];
  
  idusermaquina:        any;
  nombreUserMaquina:    any;
  idDatosPersonales:    any;
  observacion:          any;
  cuentasIdFk:          any;
  ipMachine:            any;
  _cedula:              any;
  _nombresx:            any;
  _telefono:            any;
  ipmaquinaUserMaq:     any;
  codigoTiendaidFk:     any;
  ipeditar:             any;
  ipEquipo:             any;
  tipoEquipo:           any;

  isActive:           boolean = false;
  edit_temporal_user: boolean = false;
  viewForm:           boolean = false;
  _show_spinner:      boolean = false;
  _cancel_button:     boolean = false;
  _cancel_button_us:  boolean = true;
  _create_show:       boolean = true;
  permisonUsers:      boolean = true;
  calwidth:           boolean = true;

  idEquipo:           number = 0;
  count:              number = 0;

  _action_butto_us    = 'Editar';
  _action_butto       = 'Crear';
  
  add:            any = this.env.apiUrlIcon()+'add.png';
  delete:         any = this.env.apiUrlIcon()+'delete.png';
  edit:           any = this.env.apiUrlIcon()+'edit.png';
  crear:          any = this.env.apiUrlIcon()+'accept.png';
  cancel:         any = this.env.apiUrlIcon()+'cancel.png';
  search:         any = this.env.apiUrlIcon()+'search.png';
  users:          any = this.env.apiUrlIcon()+'usuarios.png';
  _width_table:   string = 'tabledata table-responsive w-100 p-2';

  public equiposForm = new FormGroup({
    codigoClienteidFk:    new FormControl('', [Validators.required, this.controlInputsService.noWhitespaceValidator()]),
    codigoTiendaidFk:     new FormControl('', [Validators.required]), 
    tipomaq:              new FormControl('', [Validators.required, this.controlInputsService.noWhitespaceValidator()]), 
    nomMarc:              new FormControl('', [Validators.required, this.controlInputsService.noWhitespaceValidator()]),
    nomMod:               new FormControl('', [Validators.required, this.controlInputsService.noWhitespaceValidator()]),
    ipmaquina:            new FormControl({ value: '', disabled: false }, [Validators.required, this.controlInputsService.noWhitespaceValidator()]),
    serieEquipo:          new FormControl('', [Validators.required, this.controlInputsService.noWhitespaceValidator()]), 
    capacidadIni:         new FormControl('', [Validators.required]),
    capacidadIniSobres:   new FormControl('', [Validators.required]),
    capacidadAsegurada:   new FormControl('', [Validators.required]),
    fechaInstalacion:     new FormControl('', [Validators.required, this.controlInputsService.noWhitespaceValidator()])
  })

  public filterForm = new FormGroup({
    filterequip:          new FormControl('')
  })

  public filterUserEquiposForm = new FormGroup({
    filterusermaq:        new FormControl('')
  })

  public filterEquiposForm = new FormGroup({
    _nombres:             new FormControl(''),
    _cedula:              new FormControl(''),
  })

  constructor( private env: Environments,
    private clienteserv: ClientesService,
    private tiendaservs: TiendaService,
    public dialog: MatDialog,
    private controlInputsService: ControlinputsService,
    private equiposerv: EquipoService,
    private userservs: UsuariosService,
    private sharedservs: ServicesSharedService) {
    this.usuarioTemporalHub = new HubConnectionBuilder()
      .withUrl(this.urlHub+'usuarioTemporal').build();
    this.usuarioTemporalHub.on("SendUsuarioTemporal", message => {
      this.ObtenerUsuarioTemporalHub(message);
    });
  }

  ngOnInit(): void {
    this.getClientSelect();
    let x:any = this.sharedservs.validateRol();
    switch( x ) {
      case 1:
        this.permisonUsers = true;
        break;
      case 0:
        this.permisonUsers = false; 
        break;
    }
    this.obtenerEquipos();
    this.getDataMaster();
    this.obtenerIps();
    this.usuarioTemporalHub.start().then(()=>{})
      .catch( e => console.error('Algo ha pasado con el usuario temporal...', e))
  }

  onSubmit() {
    if (this.equiposForm.invalid) {
      this.controlInputsService.markFormGroupTouched(this.equiposForm);
      return;
    }
    this._action_butto === 'Crear' ? this.guardarEquipos() : this.editarEquipos();
  }

  limpiar() {
    this.obtenerIps();
    this.equiposForm.controls['codigoClienteidFk'].setValue('');
    this.equiposForm.controls['codigoTiendaidFk'].setValue('');
    this.equiposForm.controls['tipomaq'].setValue('');
    this.equiposForm.controls['nomMarc'].setValue('');
    this.equiposForm.controls['nomMod'].setValue('');
    this.equiposForm.controls['ipmaquina'].setValue('');
    this.equiposForm.controls['serieEquipo'].setValue('');
    this.equiposForm.controls['capacidadIni'].setValue('');
    this.equiposForm.controls['capacidadIniSobres'].setValue('');
    this.equiposForm.controls['capacidadAsegurada'].setValue('');
    this.equiposForm.controls['fechaInstalacion'].setValue('');
    this.tiendalista    = [];
    this.listaMarcas    = [];
    this.listaModelos   = [];
    this.calwidth       = true;
    this._create_show   = true;
    this._cancel_button = false;
    this.viewForm       = false;
    this.ipeditar       = '';
    this.tipoEquipo     = '';
    this._action_butto  = 'Crear';
    this._width_table   = 'tabledata table-responsive w-100 p-2';
    this.equiposForm.controls['ipmaquina'].enable();
    this.controlInputsService.resetFormGroup(this.equiposForm);
  }

  ObtenerUsuarioTemporalHub(data:any) {
    this.listaEsquipo.filter((element:any)=> {
      if( element.ipEquipo == data.ipMachineSolicitud) {
        element.capacidadUsuariosTemporales++;
      }
    })
  }

  obtenerEquipos() {
    this.equiposerv.obtenerEquipo().subscribe({
      next: (equipo: any) => {
        this.listaEsquipo = equipo.filter((element: any) => {
          return element.active === "A";
        });
        this.listaEsquipoGhost = equipo;
      },
      error: (e) => console.error(e)
    })
  }

  getDataMaster() {
    this.sharedservs.getTipoEquipo().subscribe({
      next: (data) => this.tipomaqlista = data, 
      error: (e) => console.error(e)
    })
  }

  obtenerIps() {
    this.equiposerv.obtenerIPEquipos().subscribe({
      next: (x) => this.listaIps = x, 
      error: (e) => console.error(e)
    })
  }

  widthAutom() {
    this._width_table = this.calwidth ? 'tabledata table-responsive w-75 p-2' : 'tabledata table-responsive w-100 p-2';
    this.calwidth = !this.calwidth;
    this.equiposForm.controls['codigoClienteidFk'].setValue('');
    this.equiposForm.controls['codigoTiendaidFk'].setValue('');
    this.equiposForm.controls['tipomaq'].setValue('');
    this.equiposForm.controls['nomMarc'].setValue('');
    this.equiposForm.controls['nomMod'].setValue('');
    this.equiposForm.controls['ipmaquina'].enable();
    this.equiposForm.controls['ipmaquina'].setValue('');
    this.equiposForm.controls['serieEquipo'].setValue('');
    this.equiposForm.controls['capacidadIni'].setValue('');
    this.equiposForm.controls['capacidadIniSobres'].setValue('');
    this.equiposForm.controls['capacidadAsegurada'].setValue('');
    this.equiposForm.controls['fechaInstalacion'].setValue('');
    this._action_butto  = 'Crear';
    this.tipoEquipo     = '';
    this.tiendalista    = [];
    this.listaMarcas    = [];
    this.listaModelos   = [];
  }

  guardarEquipos() {
    this._show_spinner = true;
    this._create_show = false;
    let tiempoSincronizacion = new Date();
    tiempoSincronizacion.setHours(0, 0, 0, 0);
    this.modeloEquipos = {
      codigoTiendaidFk:   this.equiposForm.controls['codigoTiendaidFk'].value,
      tipo:               this.equiposForm.controls['tipomaq'].value,
      marca:              this.equiposForm.controls['nomMarc'].value,
      modelo:             this.equiposForm.controls['nomMod'].value,
      serieEquipo:        this.equiposForm.controls['serieEquipo'].value,
      active:             'A',
      fechaInstalacion:   this.equiposForm.controls['fechaInstalacion'].value,
      ipEquipo:           this.ipEquipo[0],
      capacidadAsegurada: this.equiposForm.controls['capacidadAsegurada'].value?.toString().replace(/[^0-9.]*/g, ''),
      tiempoSincronizacion: tiempoSincronizacion,
      ...(this.tipoEquipo === '009' 
        ? { capacidadIniSobres: this.equiposForm.controls['capacidadIniSobres'].value?.toString().replace(/[^0-9.]*/g, ''),
            capacidadIni: '0' } 
        : { capacidadIni: this.equiposForm.controls['capacidadIni'].value?.toString().replace(/[^0-9.]*/g, ''),
            capacidadIniSobres: '0' })
    }
    this.equiposerv.guardarEquipo(this.modeloEquipos).subscribe({
      next: (x) => Toast.fire({ icon: 'success', title: 'Equipo guardado' }), 
      error: (e) => {
        console.error(e);
        Toast.fire({ icon: 'error', title: 'No se ha podido guardar este equipo' });
      }, 
      complete: () => {
        this._show_spinner = false;
        this.obtenerEquipos();
        this.obtenerIps();
        this.limpiar();
      }
    })
  }

  catchData(data:any) {
    this.widthAutom();
    this.idEquipo = data.id;
    this.equiposForm.controls['ipmaquina'].disable();// Deshabilita el ip maquina para la edicion
    this.equiposForm.controls['codigoClienteidFk'].setValue(data.codigoClienteidFk.toString());
    this.validateTiendas();
    setTimeout(() => {                                
      this.equiposForm.controls['codigoTiendaidFk'].setValue(data.codigoTiendaidFk);
    }, 1000);
    this.equiposForm.controls['tipomaq'].setValue(data.tipo);
    this.obtenerMarcas();
    setTimeout(() => { 
      this.equiposForm.controls['nomMarc'].setValue(data.marca.toString().trim());
      this.obtenerModelos();
    }, 1000);
    setTimeout(() => { 
    this.equiposForm.controls['nomMod'].setValue(data.modelo.toString().trim());
    }, 1500);
    let fechaA: any;
    if( data.fechaInstalacion != null || data.fechaInstalacion != undefined ) {
      let date: any = data.fechaInstalacion.toString().split('T');
      fechaA = date[0];
    }
    this.arrIp = [];
    this.arrIp = {
      "serieEquipo": data.serieEquipo,
      "ipEquipo":    data.ipEquipo
    }
    this.listaIps = [];
    this.listaIps.push(this.arrIp);
    this.equiposForm.controls['ipmaquina'].setValue(data.ipEquipo);
    this.equiposForm.controls['serieEquipo'].setValue(data.serieEquipo);
    let capacidadIni = (data.capacidadIni) ? data.capacidadIni : 0;
    this.equiposForm.controls['capacidadIni'].setValue(capacidadIni);
    let capacidadIniSobres = (data.capacidadIniSobres) ? data.capacidadIniSobres : 0;
    this.equiposForm.controls['capacidadIniSobres'].setValue(capacidadIniSobres);
    this.equiposForm.controls['fechaInstalacion'].setValue(fechaA);
    this.ipeditar = this.arrIp.ipEquipo;
    this.equiposForm.controls['capacidadAsegurada'].setValue(data.capacidadAsegurada);
    this._action_butto  = 'Editar';
    this._cancel_button = true;
    this.viewForm       = true;
  }

  editarEquipos() {
    this.modeloEquipos = {
      id:                 this.idEquipo,
      codigoTiendaidFk:   this.equiposForm.controls['codigoTiendaidFk'].value,
      tipo:               this.equiposForm.controls['tipomaq'].value,
      marca:              this.equiposForm.controls['nomMarc'].value,
      modelo:             this.equiposForm.controls['nomMod'].value,
      serieEquipo:        this.equiposForm.controls['serieEquipo'].value,
      active:             'A',
      capacidadIni:       this.equiposForm.controls['capacidadIni'].value?.toString().replace(/[^0-9.]*/g, ''),
      capacidadIniSobres: this.equiposForm.controls['capacidadIniSobres'].value?.toString().replace(/[^0-9.]*/g, ''),
      fechaInstalacion:   this.equiposForm.controls['fechaInstalacion'].value,
      ipEquipo :          this.ipeditar,
      capacidadAsegurada: this.equiposForm.controls['capacidadAsegurada'].value?.toString().replace(/[^0-9.]*/g, ''),
      tiempoSincronizacion: new Date()
    }
    this.equiposerv.actualizarEquipo(this.idEquipo, this.modeloEquipos).subscribe({
      next: (x) => Toast.fire({ icon: 'success', title: 'Equipo actualizado' }),
      error: (e) => Toast.fire({ icon: 'error', title: 'No se ha podido actualizar este equipo' }), 
      complete: () => {
        this.obtenerEquipos();
        this.obtenerIps();
        this.limpiar();
      }
    })
  }

  catchDataUserMaq(data:any) {
    this.calwidth          = true;
    this._nombresx         = data.nombres;
    this._cedula           = data.cedula;
    this._telefono         = data.telefono;
    this.idusermaquina     = data.id;
    this.idDatosPersonales = data.idDatosPersonales;
    this.nombreUserMaquina = data.usuario;
    this.observacion       = data.observacion;
    this.cuentasIdFk       = data.cuentasidFk;
    this.ipMachine         = data.ipMachine;
    this.filterEquiposForm.get('_nombres')?.setValue(data.nombres);
    this.filterEquiposForm.get('_cedula')?.setValue(data.cedula);
  }

  async editarUsuarioMaquina(data: any) {
    this.modelUsers = {
      id:           this.idusermaquina,
      Usuario:      this.nombreUserMaquina,
      Contrasenia:  '',
      IpMachine:    this.ipMachine,   
      tiendasidFk:  this.codigoTiendaidFk,
      active:       'A',
      cuentasIdFk:  this.cuentasIdFk,
      observacion:  this.observacion
    }
    this.modelDatosPersonales = {
      id:          this.idDatosPersonales,
      usuarioidFk: this.nombreUserMaquina,
      nombres:     this.filterEquiposForm.get('_nombres')?.value,
      cedula:      this.filterEquiposForm.get('_cedula')?.value,
      apellidos:   '-',
      telefono:    '',
      active:      'A'
    }
    try {
      await this.userservs.actualizarUsuario(this.idusermaquina, this.modelUsers).toPromise();
      Toast.fire({ icon: 'success', title: 'Usuario de máquina se ha actualizado con éxito' });
      await this.actualizarDatosPersonales(this.idDatosPersonales, this.modelDatosPersonales);
      this.limpiarMqU();
    } catch (e) {
      Toast.fire({ icon: 'error', title: 'No hemos podido actualizar el usuario' });
    }
    await this.obtenerUsuariosIpMaquina(data);
  }

  limpiarMqU() {
    this._nombresx  ='';
    this._cedula   = '';
    this._telefono = '';
    this.idusermaquina= '';
    this.idDatosPersonales = '';
    this.nombreUserMaquina = '';
    this.observacion = '';
    this.cuentasIdFk = '';
    this.filterEquiposForm.get('_nombres')?.setValue('');
    this.filterEquiposForm.get('_cedula')?.setValue('');
    this.edit_temporal_user = false;
  }

  actualizarDatosPersonales(id:number, model:any []) { 
    this.userservs.actualizarDatosPersonales(id, model).subscribe({
      next: (x) => {}, 
      error: (e) => {console.error(e)}, 
      complete: () => {}
    })
  }

  obtenerUsuariosIpMaquina(data:any) {
    this.ipmaquinaUserMaq = data.ipEquipo;
    this.codigoTiendaidFk = data.codigoTiendaidFk;
    this.equiposerv.obtenerUsuariosIp(data.ipEquipo).subscribe({
      next: (x) => {
        this.listaUsuariosMaquina = x;
        this.listaUsuariosMaquinaGhost = x;
      }, 
      error: (e) => console.error(e)
    })
  }

  validateInputText(data:any) {
    this.controlInputsService.validateAndCleanInput(data);
  }
  
  validateInputNumber(data: any) {
    this.controlInputsService.validateAndCleanNumberInput(data);
  }

  filterUsuariosMaquinaria() {
    let filter: any = this.filterUserEquiposForm.controls['filterusermaq'].value;
    this.listaUsuariosMaquina = this.listaUsuariosMaquinaGhost.filter((item:any) => 
      item.usuario     .toLowerCase().includes(filter.toLowerCase()) ||
      item.nombres     .toLowerCase().includes(filter.toLowerCase()) ||
      item.nombreTienda.toLowerCase().includes(filter.toLowerCase()) ||
      item.cedula      .toLowerCase().includes(filter.toLowerCase()) ||
      item.telefono    .toLowerCase().includes(filter.toLowerCase()) 
    )
  }

  openDialogUserTemporales(data:any) {
    let arr: any = {
      "idCliente":                   data.idCLiente,
      "nombreCliente":               data.nombreCliente,
      "nombreTienda":                data.nombreTienda,
      "telfAdmin":                   data.telfAdmin,
      "tipoMaquinaria":              data.tipoMaquinaria,
      "nombremarca":                 data.nombremarca,
      "nombremodelo":                data.nombremodelo,
      "id":                          data.id,
      "codigoTiendaidFk":            data.codigoTiendaidFk,
      "capacidadAsegurada":          data.capacidadAsegurada,
      "tipo":                        data.tipo,
      "column1":                     data.column1,
      "modelo":                      data.modelo,
      "serieEquipo":                 data.serieEquipo,
      "active":                      data.active,
      "capacidadIni":                data.capacidadIni,
      "fechaInstalacion":            data.fechaInstalacion,
      "capacidadUsuariosTemporales": 1,
      "capacidadUsuarios":           1,
      "provincia":                   data.provincia,
      "ipEquipo":                    data.ipEquipo,
      "codigoTienda":                data.codigoTienda
    }
    const dialogRef = this.dialog.open( UsuariosTemporalesMaquinaComponent, {
      height: 'auto',
      width:  '80%',
      data: arr,
    });
    dialogRef.afterClosed().subscribe( result => this.obtenerEquipos());
  }

  eliminarEquipos( data:any, i: number ) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se va a desactivar un equipo y no se va a poder monitorear!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor:  '#d33',
      confirmButtonText:  'Sí, desactivar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._show_spinner = true;  
        this.equiposerv.eliminarEquipos( data.id ).subscribe({
          next: (x) => {
            this._show_spinner = false;
            Swal.fire (
              'Desactivado!',
              'El equipo está desactivado',
              'success'
          )}, 
          error: (e) => {
            this._show_spinner = false;
            Swal.fire(
              'Upps!',
              'No hemos podido desactivar este equipo',
              'error'
            )}, 
          complete: () => {
            this.obtenerEquipos();
            this.limpiar();
          } 
        })
      }
    })
  }

  validateDataIP() {
    let x:any = this.equiposForm.controls['ipmaquina'].value;
    this.ipEquipo = x.split('/');
    this.equiposForm.controls['serieEquipo'].setValue(this.ipEquipo[1]);
    this.ipeditar = this.ipEquipo[0];
  }

  filterEquipos() {
    let filter = this.filterForm.controls['filterequip'].value?.toLowerCase();
    const filterFunction = (item: any) => 
      item.serieEquipo.toLowerCase().includes(filter) ||
      item.nombreTienda.toLowerCase().includes(filter) ||
      item.nombremarca.toLowerCase().includes(filter) ||
      item.nombremodelo.toLowerCase().includes(filter) ||
      item.tipoMaquinaria.toLowerCase().includes(filter);
    this.listaEsquipo = this.listaEsquipoGhost.filter((item: any) => 
      filterFunction(item) && (this.isActive || item.active === "A")
    );
  }

  validateTiendas() {
    const codigoCliente = this.equiposForm.controls['codigoClienteidFk'].value;
    if (codigoCliente) {
      this.tiendaservs.obtenerTiendaFiltroCliente(codigoCliente).subscribe({
        next: (tiendas) => this.tiendalista = tiendas,
        error: (e) => console.error(e),
        complete: () => {
          if (this.tiendalista.length > 0) this.equiposForm.controls['codigoTiendaidFk'].setValue(this.tiendalista[0].id);
        },
      });
    }
  }

  obtenerMarcas() {
    this.tipoEquipo = this.equiposForm.controls['tipomaq'].value!;
    (this.tipoEquipo === '009')
      ? this.equiposForm.controls['capacidadIni'].setValue('0') 
      : this.equiposForm.controls['capacidadIniSobres'].setValue('0');
    this.equiposerv.obtenerMarca(this.tipoEquipo).subscribe({
      next: (marcas:any) => {
        this.listaMarcas = marcas.map((marca:any) => {
          return {
            ...marca,
            codmarca: marca.codmarca.trim()
          };
        });
        if (this.listaMarcas.length > 0) {
          this.equiposForm.controls['nomMarc'].setValue(this.listaMarcas[0].codmarca);
          this.obtenerModelos();
        } else {
          this.listaModelos = [];
          this.equiposForm.controls['nomMarc'].setValue('');
        }
      },
      error: (e) => console.error(e)
    });
  }
  
  obtenerModelos() {
    let tipoMaq = this.equiposForm.controls['tipomaq'].value;
    let marca = this.equiposForm.controls['nomMarc'].value;
    this.equiposerv.obtenerModelo(tipoMaq, marca).subscribe({
      next: (modelos: any) => {
        this.listaModelos = modelos.map((modelo:any) => {
          return {
            ...modelo,
            codmodelo: modelo.codmodelo.trim()
          };
        });
        if (this.listaModelos.length > 0) {
          this.equiposForm.controls['nomMod'].setValue(this.listaModelos[0].codmodelo);
        } else {
          this.equiposForm.controls['nomMod'].setValue('');
        }
      },
      error: (e) => console.error(e)
    });
  }

  updateActive(equipo: any){
    Swal.fire({
      title: '¿Desea activar el equipo?',
      text: "Se va a proceder a activar el monitoreo del equipo",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor:  '#d33',
      confirmButtonText:  'Sí, activar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._show_spinner = true;
        this.equiposerv.activarEquipo(equipo.id).subscribe({
          next: (x) => Toast.fire({ icon: 'success', title: 'Equipo activado' }), 
          error: (e) => Toast.fire({ icon: 'error', title: 'No se ha podido activar este equipo' }), 
          complete: () => {
            this._show_spinner = false;
            this.obtenerEquipos();
            this.obtenerIps();
            this.limpiar();
          }
        })
      }
    })
  }

  machineDesactive(){
    this.isActive = !this.isActive;
    if(this.isActive){
      this.listaEsquipo = this.listaEsquipoGhost;
    } else {
      this.listaEsquipo = this.listaEsquipoGhost.filter((element: any) => {
        return element.active === "A";
      });
    }
  }

  getClientSelect() {
    this.clienteserv.ObtenerClienteSelect().subscribe({
      next: (clientes) => this.clientelista = clientes, 
      error: (e) => console.error(e)
    });
  }

  validateFechaInstalacion() {
    const fechaInstalacionControl = this.equiposForm.get('fechaInstalacion');
    if (fechaInstalacionControl) {
      const fechaActual = new Date();
      const fechaSeleccionada = new Date(fechaInstalacionControl.value!);
      if (fechaSeleccionada > fechaActual) {
        const fechaActualISO = fechaActual.toISOString().split('T')[0];
        fechaInstalacionControl.setValue(fechaActualISO);
      }
    }
  }
}