import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Environments } from '../../environments/environments';
import { TiendaService } from '../tienda/services/tienda.service';
import { MatDialog } from '@angular/material/dialog';
import { ClientesService } from '../cliente/services/clientes.service';
import { ServicesSharedService } from '../../shared/services-shared/services-shared.service';
import { EquipoService } from './services/equipo.service';
import Swal from 'sweetalert2'
import { UsuariosTemporalesMaquinaComponent } from './usuarios-temporales-maquina/usuarios-temporales-maquina.component';
import { IndexedDbService } from '../../shared/services/indexeddb/indexed-db.service';
import { ControlinputsService } from '../../shared/services/controlinputs.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Q } from '@angular/cdk/keycodes';
import { UsuariosService } from '../usuarios/services/usuarios.service';

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

  modelDatosPersonales:any = [];
  idusermaquina:any;
  nombreUserMaquina:any;
  idDatosPersonales:any;
  actividad:any;
  observacion:any;
  cuentasIdFk:any;
  ipMachine:any;

  _cancel_button_us: boolean = true;
  _cedula:   any;
  _nombresx:  any;
  _telefono: any;

  edit_temporal_user:boolean = false;

  add: any = this.env.apiUrlIcon()+'add.png';
  private usuarioTemporalHub: HubConnection;
  viewForm: boolean = false;
  primary:      any;
  secondary:    any;
  secondary_a:  any;
  secondary_b:  any;
  namemodulo:   string = '';

  delete: any = this.env.apiUrlIcon()+'delete.png';
  edit:   any = this.env.apiUrlIcon()+'edit.png';
  crear:  any = this.env.apiUrlIcon()+'accept.png';
  cancel: any = this.env.apiUrlIcon()+'cancel.png';
  search: any = this.env.apiUrlIcon()+'search.png';
  users: any = this.env.apiUrlIcon()+'usuarios.png';
  _width_table: string = 'tabledata table-responsive w-100 p-2';

  tiendaListaGhost:any = [];
  // filterequip:     any = [];

  listaUsuariosMaquina:      any = [];
  listaUsuariosMaquinaGhost: any = [];
  _edit_btn:    boolean = false;
  _delete_show: boolean = true;
  _edit_show:   boolean = true;
  _create_show: boolean = true;
  _form_create: boolean = true;

  _action_butto_us = 'Editar';
  _action_butto = 'Crear';
  _show_spinner: boolean = false;
  _icon_button: string = 'add';
  _cancel_button: boolean = false;

  equiposlista:any = [];
  tiendalista:any = [];

  private urlHub: any = this.env.apiUrlHub();
  constructor( private env: Environments,
               private clienteserv: ClientesService,
               private tiendaservs: TiendaService,
               public dialog: MatDialog,
               private controlInputsService: ControlinputsService,
               private equiposerv: EquipoService,
               private userservs: UsuariosService,
               private sharedservs: ServicesSharedService,
               private indexedDbService: IndexedDbService ) {

                this.usuarioTemporalHub = new HubConnectionBuilder()
                  .withUrl(this.urlHub+'usuarioTemporal')
                  .build();
                this.usuarioTemporalHub.on("SendUsuarioTemporal", message => {
                  this.ObtenerUsuarioTemporalHub(message);
                });

               }

               ObtenerUsuarioTemporalHub(data:any) {
                //////////console.warn(data);

                this.listaEsquipo.filter((element:any)=> {
                  if( element.ipEquipo == data.ipMachineSolicitud) {
                    element.capacidadUsuariosTemporales ++;
                    //////////console.warn(element);
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
    filterequip:              new FormControl('')
  })

  public filterUserEquiposForm = new FormGroup({
    filterusermaq:              new FormControl('')
  })

  public filterEquiposForm = new FormGroup({
    _nombres:              new FormControl(''),
    _cedula:              new FormControl(''),
  })

  permisonUsers:boolean = true;
  ngOnInit(): void {
    this.obtenerCliente();
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
      this.obtenerEquipos(1, 'void');
      this.obtenerTiendas();
      this.getDataMaster('MQT');
      this.obtenerIps();

      this.usuarioTemporalHub.start().then( ()=> {
        //////////console.warn('Conexion fue establecida con el canal de usuario temporal del equipo');         
      }).catch( e => {
        console.error('ALGO HA PASADO CON PING');
        console.error(e);
      })

  }

  catchDataUserMaq(data:any) {
    this.calwidth = true;
    // this.widthAutom();
    //////////console.warn(data);
    this._nombresx  = data.nombres;
    this._cedula   = data.cedula;
    this._telefono = data.telefono;
    this.idusermaquina= data.id;
    this.idDatosPersonales = data.idDatosPersonales;
    this.nombreUserMaquina = data.usuario;
    this.observacion = data.observacion;
    this.cuentasIdFk = data.cuentasidFk;
    this.ipMachine = data.ipMachine;
  }


  modelUsers: any = [];
  editarUsuarioMaquina() {
    this.modelUsers = {
      id:           this.idusermaquina,
      Usuario:      this.nombreUserMaquina,
      Contrasenia:  '',
      IpMachine:    this.ipMachine,   
      tiendasidFk:  this.codigoTiendaidFk,
      active: 'A',
      cuentasIdFk:  this.cuentasIdFk,
      observacion:  this.observacion
    }
    this.modelDatosPersonales = {
      id:          this.idDatosPersonales,
      usuarioidFk: this.nombreUserMaquina,
      nombres:     this._nombresx,
      cedula:      this._cedula,
      apellidos:   '-',
      telefono:    '',
      active:      'A'
    }
    
    this.userservs.actualizarUsuario(this.idusermaquina, this.modelUsers).subscribe({
      next: (x) => {
        Toast.fire({ icon: 'success', title: 'Usuario de máquina se ha actualizado con éxito' });
      }, error: (e) => {
        console.error(e);
        Toast.fire({ icon: 'error', title: 'No hemos podido actualizar el usuario' });
      }, complete: () => {
        this.actualizarDatosPersonales(this.idDatosPersonales, this.modelDatosPersonales);
        this.limpiarMqU();
      }
    })
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
    // this.ipMachine = '';
    this.edit_temporal_user = false;
  }

  actualizarDatosPersonales(id:number, model:any []) { 

    this.userservs.actualizarDatosPersonales(id, model).subscribe({
      next: (x) => {

      }, error: (e) => {
        console.error(e);
      }, complete: () => {
        this.obtenerUsuariosIpMaquina(this.ipMachine);
      }
    })

  }

  ipmaquinaUserMaq: any;
  codigoTiendaidFk: any;
  obtenerUsuariosIpMaquina(data:any) {

    this.ipmaquinaUserMaq = data.ipEquipo;
    this.codigoTiendaidFk = data.codigoTiendaidFk;
    //////////console.warn(this.ipmaquinaUserMaq)
    //////////console.warn(this.codigoTiendaidFk)

    this.equiposerv.obtenerUsuariosIp(data.ipEquipo).subscribe({
      next: (x) => {
        this.listaUsuariosMaquina = x;
        this.listaUsuariosMaquinaGhost = x;
        ////console.table('listaUsuariosMaquina');
        ////console.table(this.listaUsuariosMaquina);
      } 
    })
  }

  calwidth: boolean = true;
  widthAutom() {
    switch( this.calwidth ) {
      case true:
        this._width_table = 'tabledata table-responsive w-75 p-2';
        //////////console.warn(this._width_table);
        this.calwidth = false;
        break;
      case false:        
        this._width_table = 'tabledata table-responsive w-100 p-2';
        //////////console.warn(this._width_table);
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

  obtenerTiendas() {
    this.tiendaservs.obtenerTiendas().subscribe({
      next: (tienda) => {
        this.tiendaListaGhost = tienda;
        ////console.log(this.tiendaListaGhost)
      }
    })
  }


  filterUsuariosMaquinaria() {
    let filter: any = this.filterUserEquiposForm.controls['filterusermaq'].value;
    this.listaUsuariosMaquina = this.listaUsuariosMaquinaGhost.filter((item:any) => 
    // //console.log( item )
      item.usuario     .toLowerCase().includes(filter.toLowerCase()) ||
      item.nombres     .toLowerCase().includes(filter.toLowerCase()) ||
      item.nombreTienda.toLowerCase().includes(filter.toLowerCase()) ||
      item.cedula      .toLowerCase().includes(filter.toLowerCase()) ||
      item.telefono    .toLowerCase().includes(filter.toLowerCase()) 
    )
  }

  onSubmit() {
    switch(this._action_butto) {
      case 'Crear':
        this.guardarEquipos();
        break;
      case 'Editar':
        this.editarEquipos()
        break
    }
  }

  validateTiendas() {
    this.tiendalista = [];

    //console.log(this.tiendaListaGhost)
    //console.log(this.equiposForm.controls['codigoClienteidFk'].value)

    this.tiendaListaGhost.filter( (tienda:any) =>{
      if( tienda.codigoClienteidFk == this.equiposForm.controls['codigoClienteidFk'].value ) {
        let arr = {
            "cantidadMaquinaria": tienda.cantidadMaquinaria,
            "nombreCliente":      tienda.nombreCliente,
            "ruc":                tienda.ruc,
            "telefono":           tienda.telefono,
            "nombreAdmin":        tienda.nombreAdmin,
            "telfAdmin":          tienda.telfAdmin,
            "direccion":          tienda.direccion,
            "nombreProvincia":    tienda.nombreProvincia,
            "id":                 tienda.id,
            "codigoTienda":       tienda.codigoTienda,
            "codigoClienteidFk":  tienda.codigoClienteidFk,
            "nombreTienda":       tienda.nombreTienda,
            "emailAdmin":         tienda.emailAdmin,
            "codProv":            tienda.codProv,
            "idCentroProceso":    tienda.idCentroProceso,
            "fecreate":           tienda.fecreate,
            "active":             tienda.active
        }
        
        this.tiendalista.push(arr);
      }

      // //////////console.warn('<<<<<<<<this.tiendalista>>>>>>>>');
      // //////////console.warn(this.tiendalista);

    })
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
          capacidadIniSobres: this.equiposForm.controls['capacidadIniSobres'].value?.toString().replace(/[^0-9.]*/g, ''),
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
          capacidadIniSobres: this.equiposForm.controls['capacidadIniSobres'].value?.toString().replace(/[^0-9.]*/g, ''),
          estadoPing: 0,
          tiempoSincronizacion: new Date()
        }
      }
      //////////console.warn( this.modeloEquipos );
      this.equiposerv.actualizarEquipo(this.idEquipo, this.modeloEquipos).subscribe({
        next: (x) => {
          Toast.fire({ icon: 'success', title: 'Equipo actualizado' });
        }, error: (e) => {
          console.error(e);
          Toast.fire({ icon: 'error', title: 'No se ha podido actualizar este equipo' });
        }, complete: () => {
          this.obtenerEquipos(1, 'void');
          this.obtenerIps();
          this.limpiar();
        }
      })
    }
  }

  openDialogUserTemporales(data:any) {

    let arr: any = {
        "idCliente": data.idCLiente,
        "nombreCliente": data.nombreCliente,
        "nombreTienda": data.nombreTienda,
        "telfAdmin": data.telfAdmin,
        "tipoMaquinaria": data.tipoMaquinaria,
        "nombremarca": data.nombremarca,
        "nombremodelo": data.nombremodelo,
        "id": data.id,
        "codigoTiendaidFk": data.codigoTiendaidFk,
        "capacidadAsegurada": data.capacidadAsegurada,
        "tipo": data.tipo,
        "column1": data.column1,
        "modelo": data.modelo,
        "serieEquipo": data.serieEquipo,
        "active": data.active,
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

    dialogRef.afterClosed().subscribe( result => {
        this.obtenerEquipos(1, 'void');
      }
    );
  }

  obtenerUsuariosMaquinarias(ip:string) {
    //////////console.warn(ip);
  }

  modeloEquipos: any = [];
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
        capacidadIniSobres: this.equiposForm.controls['capacidadIniSobres'].value?.toString().replace(/[^0-9.]*/g, ''),
        estadoPing: 0,
        tiempoSincronizacion: tiempoSincronizacion
      }

      //////////console.warn( this.modeloEquipos );
      setTimeout(() => {
      this.equiposerv.guardarEquipo(this.modeloEquipos).subscribe(
        {
          next: (x) => {
            Toast.fire({ icon: 'success', title: 'Equipo guardado' });
          }, error: (e) => {
            console.error(e);
            this._show_spinner = false;
            Toast.fire({ icon: 'error', title: 'No se ha podido guardar este equipo' });
          }, complete: () => {
            this._show_spinner = false;
            this.obtenerEquipos(1, 'void');
            this.obtenerIps();
            this.limpiar();
          }
        }
      )
    }, 1000);
    }
  }

  
  clienteListaGhost: any = [];
  clientelista:any = []
  obtenerCliente() {
    //console.log('Obteniendo cliente!  ')

    this.clientelista = [];
    this._show_spinner = true;
    this.clienteserv.obtenerCliente()
                    .subscribe({
      next: (cliente) => {
        this.clienteListaGhost = cliente;
        this._show_spinner = false;
      }, error: (e) => {
        this._show_spinner = false;
        console.error(e);
      }, complete: () => {
        this.clienteListaGhost.filter((element:any)=>{
          
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
        //console.warn(this.clientelista);
      }
    })
  }

  listaEsquipo:any = [];
  listaEsquipoGhost:any = [];

  listaStorageMonitoreo: any = [];

  obtenerEquipos( tp:number, ctienda:string ) {
    this.equiposerv.obtenerEquipo(tp, ctienda).subscribe({
      next: (equipo) => {
        this.listaEsquipo = equipo;
        //////////console.warn('Lista de equipos')
        ////console.table(this.listaEsquipo);

        this.listaEsquipoGhost = equipo;
        this.listaEsquipo.filter( (element:any) => {
          let arr = {
            ip: element.ipEquipo,
            ping: element.estadoPing
          }

          this.listaStorageMonitoreo.push(arr);

        })
        
        // this.indexedDbService.crearIndexedDB('equiposDB', this.listaStorageMonitoreo);

      }
    })
  }


  idEquipo: number = 0;
  ipeditar: any;
  arrIp:any = [];
  disabledIpEdit: boolean = true;
  marca:any
  modelo:any
  idCliente: number = 0;
  count: number = 0;
  catchData(data:any) {
    this.widthAutom();
    /** Deshabilita el ip maquina para la edicion*/
    this.equiposForm.controls['ipmaquina'].disable();
    /** Guarda el id cliente */
    this.idCliente = data.idCliente;
    // //alertthis.idCliente)
    /** Guarda la marca */
    this.marca = data.marca.toString().trim();
    /** Guarda el modelo */
    this.modelo = data.modelo.toString().trim();    
    /** Guarda el id equipo */
    this.idEquipo = data.id;
    /** Asigna el cliente por medio de su id */
    this.equiposForm.controls['codigoClienteidFk'].setValue(this.idCliente.toString());
    /** llama a las atiendas */
    this.validateTiendas();
    /** Asigna la tienda por medio de su id */
    this.equiposForm.controls['codigoTiendaidFk'].setValue(data.codigoTiendaidFk);    
    for ( let x = 0; x < 2; x++  ) {
      /** Asigna el tipo de maquina */
      this.equiposForm.controls['tipomaq'].setValue(data.tipo);
      /** Asigna la marca */
      this.equiposForm.controls['nomMarc'].setValue(this.marca);
      /** Obtiene las marcas */
      this.obtenerMarcas();
      /** Asigna el modelo */
      this.equiposForm.controls['nomMod'].setValue(this.modelo);
      this.count ++;
    }




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
      title: 'Estás seguro?',
      text: "Esta acción es irreversible y podría provocar perdida de datos en otros procesos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor:  '#d33',
      confirmButtonText:  'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._show_spinner = true;  
        this.equiposerv.eliminarEquipos( data.id ).subscribe({
          next: (x) => {
            this._show_spinner = false;
            Swal.fire (
              'Deleted!',
              'Equipo eliminado',
              'success'
            )
          }, error: (e) => {
            console.error(e);
            this._show_spinner = false;
            Swal.fire(
              'Upps!',
              'No hemos podido eliminar este equipo',
              'error'
            )
          }, complete: () => {
            this.obtenerEquipos(1,'void');
            this.limpiar();
          } 
          })
        }
    })
  }

  listaIps:any = [];
  obtenerIps() {
    this.equiposerv.obtenerIPEquipos().subscribe({
      next: (x) => {
        this.listaIps = x;
        //////////console.warn('listaIps');
        //////////console.warn(this.listaIps);
      }
    })
  }

  a:any;
  validateDataIP() {
    let x:any = this.equiposForm.controls['ipmaquina'].value;
    this.a = x.split('/');
    this.equiposForm.controls['serieEquipo'].setValue(this.a[1]);
    this.ipeditar = this.a[0];
    //////////console.warn(this.a);
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
    this.ipeditar = '';
    this.equiposForm.controls['ipmaquina'].enable()
    this.obtenerIps();
    this.viewForm = false;
    this._width_table = 'tabledata table-responsive w-100 p-2';
    this._create_show = true;
  }


  listaMarcas:any = [];
  show_modelos: boolean = false;
  obtenerMarcas() {
    let x:any = this.equiposForm.controls['tipomaq'].value;
    this.equiposerv.obtenerMarca(x).subscribe({
      next: (x) => {
        this.listaMarcas = x;
        //////////console.warn(this.listaMarcas);
      }, error: (e) => {
        console.error(e);
      }, complete: () => {
        this.show_modelos = true;
        setTimeout(() => {
          //////////console.warn('OBTENIENDO MODELOS 1')
          this.obtenerModelos();
          //////////console.warn('OBTENIENDO MODELOS 2')
        }, 500);
      }
    })
  }
  
  listaModelos: any = [];
  obtenerModelos() {
    let xtipo:any = this.equiposForm.controls['tipomaq'].value;
    let xmarca = this.equiposForm.controls['nomMarc'].value;
    this.equiposerv.obtenerModelo(xtipo, xmarca).subscribe({
      next:(x) => {
        this.listaModelos = x;
        ////console.table(this.listaModelos);
      }
    })
  }

  tipomaqlista:any = [];
  listaCompleta: any = [];
  getDataMaster(cod:string) {
    this.sharedservs.getDataMaster(cod).subscribe({
      next: (data) => {
        switch(cod) {
        case 'MQT':
          this.listaCompleta = data;
          this.tipomaqlista = this.listaCompleta.filter((item:any) => 
            item.nombre === "DEPOSITARIO DE BILLETES" || item.nombre === "DEPOSITARIO DE MONEDAS"
          );
          // ////////console.log(this.tipomaqlista);
          break;
        }
      }
    })
  }

}
