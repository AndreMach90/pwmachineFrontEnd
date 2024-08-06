import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  tiendaListaGhost:          any = [];
  listaUsuariosMaquina:      any = [];
  listaUsuariosMaquinaGhost: any = [];
  equiposlista:              any = [];
  tiendalista:               any = [];
  selectedClientId:          any = [];

  modelUsers:                any = [];
  modeloEquipos:             any = [];
  clienteListaGhost:         any = [];
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
  actividad:            any;
  observacion:          any;
  cuentasIdFk:          any;
  ipMachine:            any;
  _cedula:              any;
  _nombresx:            any;
  _telefono:            any;
  primary:              any;
  secondary:            any;
  secondary_a:          any;
  secondary_b:          any;
  ipmaquinaUserMaq:     any;
  codigoTiendaidFk:     any;
  ipeditar:             any;
  marca:                any;
  modelo:               any;
  a:                    any;

  isActive:           boolean = false;
  show_modelos:       boolean = false;
  edit_temporal_user: boolean = false;
  viewForm:           boolean = false;
  _show_spinner:      boolean = false;
  _cancel_button:     boolean = false;
  _edit_btn:          boolean = false;
  _cancel_button_us:  boolean = true;
  _delete_show:       boolean = true;
  _edit_show:         boolean = true;
  _create_show:       boolean = true;
  _form_create:       boolean = true;
  permisonUsers:      boolean = true;
  calwidth:           boolean = true;
  disabledIpEdit:     boolean = true;

  idEquipo:           number = 0;
  idCliente:          number = 0;
  count:              number = 0;

  namemodulo:         string = '';
  _icon_button:       string = 'add';
  _action_butto_us           = 'Editar';
  _action_butto              = 'Crear';
  
  add:            any = this.env.apiUrlIcon()+'add.png';
  delete:         any = this.env.apiUrlIcon()+'delete.png';
  edit:           any = this.env.apiUrlIcon()+'edit.png';
  crear:          any = this.env.apiUrlIcon()+'accept.png';
  cancel:         any = this.env.apiUrlIcon()+'cancel.png';
  search:         any = this.env.apiUrlIcon()+'search.png';
  users:          any = this.env.apiUrlIcon()+'usuarios.png';
  _width_table:   string = 'tabledata table-responsive w-100 p-2';

  constructor( private env: Environments,
    private clienteserv: ClientesService,
    private tiendaservs: TiendaService,
    public dialog: MatDialog,
    private controlInputsService: ControlinputsService,
    private equiposerv: EquipoService,
    private userservs: UsuariosService,
    private sharedservs: ServicesSharedService) {
    this.usuarioTemporalHub = new HubConnectionBuilder()
      .withUrl(this.urlHub+'usuarioTemporal')
      .build();
    this.usuarioTemporalHub.on("SendUsuarioTemporal", message => {
      console.log("Usuarios temporal",message);
      this.ObtenerUsuarioTemporalHub(message);
    });
  }

  ObtenerUsuarioTemporalHub(data:any) {
    this.listaEsquipo.filter((element:any)=> {
      if( element.ipEquipo == data.ipMachineSolicitud) {
        element.capacidadUsuariosTemporales ++;
      }
    })
  }

  public equiposForm = new FormGroup({
    tipomaq:              new FormControl(''), 
    codigoTiendaidFk:     new FormControl(''), 
    serieEquipo:          new FormControl(''), 
    capacidadIni:         new FormControl(''), 
    fechaInstalacion:     new FormControl(''),
    nomMarc:              new FormControl(''),
    nomMod:               new FormControl(''),
    nomModipmaquina:      new FormControl(''),
    ipmaquina:            new FormControl({ value: '', disabled: false }),
    capacidadAsegurada:   new FormControl(''),
    capacidadIniSobres:   new FormControl(''),
    codigoClienteidFk:    new FormControl('')
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
    this.primary     = this.env.appTheme.colorPrimary;
    this.secondary   = this.env.appTheme.colorSecondary_C;
    this.secondary_a = this.env.appTheme.colorSecondary_A;
    this.secondary_b = this.env.appTheme.colorSecondary_B;
    this.obtenerEquipos();
    this.getDataMaster();
    this.obtenerIps();
    this.usuarioTemporalHub.start().then(()=>{})
      .catch( e => console.error('Algo ha pasado con el usuario temporal...', e))
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
        console.log("Estos son los usuarios",x);
        this.listaUsuariosMaquina = x;
        this.listaUsuariosMaquinaGhost = x;
      }, 
      error: (e) => console.error(e)
    })
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

  onSubmit() {
    if (this._action_butto === 'Crear') this.guardarEquipos();
    if (this._action_butto === 'Editar') this.editarEquipos();
  }

  editarEquipos() {
    if ( this.equiposForm.controls['codigoTiendaidFk'].value == undefined || this.equiposForm.controls['codigoTiendaidFk'].value == null || this.equiposForm.controls['codigoTiendaidFk'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo tienda vacío' });
    else if ( this.equiposForm.controls['tipomaq'].value     == undefined || this.equiposForm.controls['tipomaq'].value == null || this.equiposForm.controls['tipomaq'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de tipo de máquina vacío' });
    else if ( this.equiposForm.controls['nomMarc'].value     == undefined || this.equiposForm.controls['nomMarc'].value == null || this.equiposForm.controls['nomMarc'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de marca vacío' });
    else if ( this.equiposForm.controls['nomMod'].value      == undefined || this.equiposForm.controls['nomMod'].value == null || this.equiposForm.controls['nomMod'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de modelo vacío' });
    else if ( this.equiposForm.controls['serieEquipo'].value == undefined || this.equiposForm.controls['serieEquipo'].value == null || this.equiposForm.controls['serieEquipo'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de número de serie vacío' });
    else {
      if ( this.a ) {
        this.modeloEquipos = {
          id: this.idEquipo,
          codigoTiendaidFk:   this.equiposForm.controls['codigoTiendaidFk'].value,
          tipo:               this.equiposForm.controls['tipomaq'].value,
          marca:              this.equiposForm.controls['nomMarc'].value,
          modelo:             this.equiposForm.controls['nomMod'].value,
          serieEquipo:        this.equiposForm.controls['serieEquipo'].value,
          active:             'A',
          capacidadIni:       this.equiposForm.controls['capacidadIni'].value?.toString().replace(/[^0-9.]*/g, ''),
          fechaInstalacion:   this.equiposForm.controls['fechaInstalacion'].value,
          ipEquipo :          this.a[0],
          capacidadAsegurada: this.equiposForm.controls['capacidadAsegurada'].value?.toString().replace(/[^0-9.]*/g, ''),
          capacidadIniSobres: 5,
          estadoPing: 0,
          tiempoSincronizacion: new Date()
        }  
      }
      else {
        this.modeloEquipos = {
          id: this.idEquipo,
          codigoTiendaidFk:   this.equiposForm.controls['codigoTiendaidFk'].value,
          tipo:               this.equiposForm.controls['tipomaq'].value,
          marca:              this.equiposForm.controls['nomMarc'].value,
          modelo:             this.equiposForm.controls['nomMod'].value,
          serieEquipo:        this.equiposForm.controls['serieEquipo'].value,
          active:             'A',
          capacidadIni:       this.equiposForm.controls['capacidadIni'].value?.toString().replace(/[^0-9.]*/g, ''),
          fechaInstalacion:   this.equiposForm.controls['fechaInstalacion'].value,
          ipEquipo :          this.ipeditar,
          capacidadAsegurada: this.equiposForm.controls['capacidadAsegurada'].value?.toString().replace(/[^0-9.]*/g, ''),
          capacidadIniSobres: 5,
          estadoPing:         0,
          tiempoSincronizacion: new Date()
        }
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

  guardarEquipos() {
    if ( this.equiposForm.controls['codigoTiendaidFk'].value == undefined || this.equiposForm.controls['codigoTiendaidFk'].value == null || this.equiposForm.controls['codigoTiendaidFk'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo tienda vacío' });
    else if ( this.equiposForm.controls['tipomaq'].value     == undefined || this.equiposForm.controls['tipomaq'].value          == null || this.equiposForm.controls['tipomaq'].value          == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de tipo de máquina vacío' });
    else if ( this.equiposForm.controls['nomMarc'].value     == undefined || this.equiposForm.controls['nomMarc'].value          == null || this.equiposForm.controls['nomMarc'].value          == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de marca vacío' });
    else if ( this.equiposForm.controls['nomMod'].value      == undefined || this.equiposForm.controls['nomMod'].value           == null || this.equiposForm.controls['nomMod'].value           == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de modelo vacío' });
    else if ( this.equiposForm.controls['serieEquipo'].value == undefined || this.equiposForm.controls['serieEquipo'].value      == null || this.equiposForm.controls['serieEquipo'].value      == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de número de serie vacío' });
    else if ( this.equiposForm.controls['ipmaquina'].value   == undefined || this.equiposForm.controls['ipmaquina'].value        == null || this.equiposForm.controls['ipmaquina'].value      == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de ipmaquina vacío' });
    else {
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
        capacidadIni:       this.equiposForm.controls['capacidadIni'].value?.toString().replace(/[^0-9.]*/g, ''),
        fechaInstalacion:   this.equiposForm.controls['fechaInstalacion'].value,
        ipEquipo:           this.a[0],
        capacidadAsegurada: this.equiposForm.controls['capacidadAsegurada'].value?.toString().replace(/[^0-9.]*/g, ''),
        capacidadIniSobres: 5,
        estadoPing:         0,
        tiempoSincronizacion: tiempoSincronizacion
      }
      setTimeout(() => {
        this.equiposerv.guardarEquipo(this.modeloEquipos).subscribe({
            next: (x) => Toast.fire({ icon: 'success', title: 'Equipo guardado' }), 
            error: (e) => {
              this._show_spinner = false;
              Toast.fire({ icon: 'error', title: 'No se ha podido guardar este equipo' });
            }, 
            complete: () => {
              this._show_spinner = false;
              this.obtenerEquipos();
              this.obtenerIps();
              this.limpiar();
            }
          }
        )
      }, 1000);
    }
  }

  obtenerEquipos() {
    this.equiposerv.obtenerEquipo().subscribe({
      next: (equipo: any) => {
        this.listaEsquipo = equipo;
        if(this.isActive){
          this.listaEsquipoGhost = this.listaEsquipo;
        }else{
          this.listaEsquipo = this.listaEsquipo.filter((element: any) => {
            return element.active === "A";
          });
          this.listaEsquipoGhost = this.listaEsquipo;
        }
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
    this.equiposForm.controls['serieEquipo'].setValue(data.serieEquipo);
    this.equiposForm.controls['capacidadIni'].setValue(data.capacidadIni);
    this.equiposForm.controls['fechaInstalacion'].setValue(fechaA);
    this.ipeditar = this.arrIp.ipEquipo;
    this.equiposForm.controls['ipmaquina'].setValue(this.arrIp.ipEquipo);
    this.equiposForm.controls['capacidadAsegurada'].setValue(data.capacidadAsegurada);
    this.equiposForm.controls['capacidadIniSobres'].setValue(data.capacidadIniSobres);
    this._action_butto  = 'Editar';
    this._cancel_button = true;
    this.viewForm       = true;
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

  obtenerIps() {
    this.equiposerv.obtenerIPEquipos().subscribe({
      next: (x) => this.listaIps = x, 
      error: (e) => console.error(e)
    })
  }

  validateDataIP() {
    let x:any = this.equiposForm.controls['ipmaquina'].value;
    this.a = x.split('/');
    this.equiposForm.controls['serieEquipo'].setValue(this.a[1]);
    this.ipeditar = this.a[0];
  }

  filterEquipos() {
    let filter: any = this.filterForm.controls['filterequip'].value;
    this.listaEsquipo = this.listaEsquipoGhost.filter( (item:any) =>
      item.serieEquipo.toLowerCase().includes(filter.toLowerCase())    ||
      item.nombreTienda.toLowerCase().includes(filter.toLowerCase())   ||
      item.nombremarca.toLowerCase().includes(filter.toLowerCase())    ||
      item.nombremodelo.toLowerCase().includes(filter.toLowerCase())   ||
      item.tipoMaquinaria.toLowerCase().includes(filter.toLowerCase())
    )
  }

  limpiar() {
    this.equiposForm.controls['codigoClienteidFk'].setValue('');
    this.equiposForm.controls['codigoTiendaidFk'].setValue('');
    this.equiposForm.controls['tipomaq'].setValue('');
    this.equiposForm.controls['nomMarc'].setValue('');
    this.equiposForm.controls['nomMod'].setValue('');
    this.equiposForm.controls['serieEquipo'].setValue('');
    this.equiposForm.controls['capacidadIni'].setValue('');
    this.equiposForm.controls['fechaInstalacion'].setValue('');
    this.equiposForm.controls['ipmaquina'].setValue('');
    this.equiposForm.controls['ipmaquina'].setValue('');
    this.equiposForm.controls['capacidadIniSobres'].setValue('');
    this.equiposForm.controls['capacidadAsegurada'].setValue('');
    this.listaMarcas    = [];
    this.listaModelos   = [];
    this.show_modelos   = false;
    this._action_butto  = 'Crear';
    this._cancel_button = false;
    this.ipeditar       = '';
    this.equiposForm.controls['ipmaquina'].enable()
    this.obtenerIps();
    this.viewForm       = false;
    this._width_table   = 'tabledata table-responsive w-100 p-2';
    this._create_show   = true;
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
    let tipoMaq = this.equiposForm.controls['tipomaq'].value!;
    this.equiposerv.obtenerMarca(tipoMaq).subscribe({
      next: (marcas:any) => {
        this.listaMarcas = marcas.map((marca:any) => {
          return {
            ...marca,
            codmarca: marca.codmarca.trim()
          };
        });
        this.show_modelos = this.listaMarcas.length > 0;
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

  getDataMaster() {
    this.sharedservs.getTipoEquipo().subscribe({
      next: (data) => this.tipomaqlista = data, 
      error: (e) => console.error(e)
    })
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
    this.obtenerEquipos();
  }

  getClientSelect() {
    this.clienteserv.ObtenerClienteSelect().subscribe({
      next: (clientes) => this.clientelista = clientes, 
      error: (e) => console.error(e)
    });
  }
}