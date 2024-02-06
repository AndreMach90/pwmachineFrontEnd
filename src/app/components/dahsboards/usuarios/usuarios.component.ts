import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Environments } from '../../environments/environments';

import { TiendaService } from '../tienda/services/tienda.service';
import { MatDialog } from '@angular/material/dialog';
import { ClientesService } from '../cliente/services/clientes.service';
import { ServicesSharedService } from '../../shared/services-shared/services-shared.service';
import { UsuariosService } from './services/usuarios.service';

import Swal from 'sweetalert2'
import { ControlinputsService } from '../../shared/services/controlinputs.service';

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
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})

export class UsuariosComponent implements OnInit {

  add: any = this.env.apiUrlIcon()+'add.png';

  viewForm: boolean = false;
  value!: string;
  delete:any = this.env.apiUrlIcon()+'delete.png';
  edit:any = this.env.apiUrlIcon()+'edit.png';
  crear:any = this.env.apiUrlIcon()+'accept.png';
  cancel:any = this.env.apiUrlIcon()+'cancel.png';
  _show_spinner: boolean = false;
  _edit_btn:                    boolean = false;
  _delete_show:                 boolean = true;
  _edit_show:                   boolean = true;
  _create_show:                 boolean = true;
  _form_create:                 boolean = true;
  _show_rol: boolean = true;
  _form:boolean = true;
  userlista: any = [];

  public sexoLista:             any = [];
  public provinciaLista:        any = [];
  public estadoCivilLista:      any = [];
  public tipoPersonaLista:      any = [];
  public carrerasLista:         any = [];
  public facultadLista:         any = [];
  public capacidadesLista:      any = [];
  public estadoTrabajadorLista: any = [];
  public cantonLista:           any = [];
  public departamentoLista:     any = [];
  public tipoLista:             any = [];
  public moviLista:             any = [];
  public licenciaLista:         any = [];
  public cargoLista:            any = [];
  _contrasenia: boolean = true;
  _action_butto = 'Crear';
  _icon_button: string = 'add';
  _cancel_button: boolean = false;

  public userForm = new FormGroup({
    usuarioidFk:        new FormControl(''),
    usuario:            new FormControl(''),
    usuarioPortaidFk:   new FormControl(''),
    codigoTiendaidFk:   new FormControl(''),
    nombres:            new FormControl(''),
    apellidos:          new FormControl(''),
    cedula:             new FormControl(''),
    contrasenia:        new FormControl(''),
    telefono:           new FormControl(''),
    rol:                new FormControl('')
  });

  constructor( private env: Environments,
               private tiendaservs: TiendaService,
               private controlInputsService: ControlinputsService,
               public  dialog: MatDialog,
               private clienteserv: ClientesService,
               private userservs: UsuariosService,
               private sharedservs: ServicesSharedService ) {


                this.userForm.get('usuarioidFk')?.valueChanges.subscribe((value) => {
                  this._show_tienda = value === 'equipo'; // Mostrar la sección de tiendas si Usuario Equipo está seleccionado
                  this._show_rol = value === 'portal';
                  this.valor = 'equipo';
                  this.verTokenUser = false;
                  this._contrasenia = false;
                  this._form = true;
                });

                // Escuchar cambios en el control 'usuarioPortaidFk' (Usuario Portal)
                this.userForm.get('usuarioPortaidFk')?.valueChanges.subscribe((value) => {
                  this._show_tienda = value === 'equipo'; // Mostrar la sección de tiendas si Usuario Equipo está seleccionado
                  this._show_rol = value == 'portal';
                  this.verTokenUser = true;
                  this.valor = 'portal';
                  this._contrasenia = true;
                  this._form = true;
                });

                this.userForm.get('nombres')?.valueChanges.subscribe(() => {
                  this.generarNombreUsuario();
                });
            
                this.userForm.get('apellidos')?.valueChanges.subscribe(() => {
                  this.generarNombreUsuario();
                });
            
                this.userForm.get('cedula')?.valueChanges.subscribe(() => {
                  this.generarNombreUsuario();
                });

              }

  _show_tienda: boolean = false;
  primary:any;
  secondary:any;
  secondary_a:any;
  secondary_b:any;
  namemodulo:any = '';

  permisonUsers: boolean = false;
  _width_table: string = 'tabledata table-responsive w-100 p-2';
  calwidth: boolean = true;
  widthAutom() {
    switch( this.calwidth ) {
      case true:
        this._width_table = 'tabledata table-responsive w-75 p-2';
        ////////console.warn(this._width_table);
        this.calwidth = false;
        break;
      case false:        
        this._width_table = 'tabledata table-responsive w-100 p-2';
        ////////console.warn(this._width_table);
        this.calwidth = true;
        break;
    }
  }

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
      this.obtenerTiendas();
      this.getDataMaster('ROL');
      this.obtenerUsuario();
      this.obtenerUsuarioPortalWeb();
  }

  validateInputText(data:any) {
    this.controlInputsService.validateAndCleanInput(data);
  }
  
  validateInputNumber(data: any) {
    this.controlInputsService.validateAndCleanNumberInput(data);
  }

  generarNombreUsuario() {
    const nombres = this.userForm.get('nombres')?.value || '';
    const apellidos = this.userForm.get('apellidos')?.value || '';
    const cedula = this.userForm.get('cedula')?.value || '';

    // Obtener el primer carácter de nombres
    const primerCaracterNombres = nombres.charAt(0).toLowerCase();

    // Obtener los 5 primeros caracteres de apellidos
    const primeros5Apellidos = apellidos.slice(0, 5).replace(' ', '_').toLowerCase();

    // Obtener los 4 últimos dígitos de la cédula
    const ultimos4Cedula = cedula.slice(-4);

    // Generar el nombre de usuario
    const nombreUsuario = primerCaracterNombres + primeros5Apellidos + ultimos4Cedula;

    // Establecer el valor en el campo de entrada de nombre de usuario
    this.userForm.get('usuario')?.setValue(nombreUsuario);
  }


  onSubmit() {

    switch(this._action_butto) {
      case 'Crear':
        this.guardarUsuario();
        break;
      case 'Editar':
        this.editarUsuario();
        break;
    }
  }

  securityLevel:any;
  validatePassword() {
    const password:any = this.userForm.controls['contrasenia'].value;    
    // Realizar validaciones
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLengthValid = password.length > 6;

    if (hasUpperCase && hasNumber && isLengthValid) {
      this.securityLevel = 'Alto';
    } else if (hasUpperCase || hasNumber && (password > 4 && password < 7) ) {
      this.securityLevel = 'Medio';
    } else if (password.length < 4) {
      this.securityLevel = 'Bajo';
    }

  }

  idusermaquina:number = 0;
  idDatosPersonales: any = 0;
  nombreUserMaquina:string = '';
  verTokenUser:boolean = true
  catchData(data:any, tipo:string) {
    this.calwidth = true;
    this.widthAutom();
    switch( tipo ) {
      case 'pw':
        this.idusermaquina = data.id;
        this.idDatosPersonales = data.idDatosPersonales;
        this.userForm.controls['nombres']  .setValue(data.nombres);
        this.userForm.controls['apellidos'].setValue(data.apellidos);
        this.userForm.controls['cedula']   .setValue(data.cedula);
        this.userForm.controls['telefono'] .setValue(data.telefono);
        this.userForm.controls['usuarioPortaidFk'].setValue('portal');
        this.userForm.controls['contrasenia'].setValue(data.contrasenia);
        this.verTokenUser = true;
        setTimeout(() => {
          this.userForm.controls['rol'].setValue(data.rol);
        }, 500);
        break;
      case 'mq':
        this.idusermaquina = data.id;
        this.idDatosPersonales = data.idDatosPersonales;
        this.userForm.controls['nombres']  .setValue(data.nombres);
        this.userForm.controls['apellidos'].setValue(data.apellidos);
        this.userForm.controls['cedula']   .setValue(data.cedula);
        this.userForm.controls['telefono'] .setValue(data.telefono);
        this.userForm.controls['contrasenia'].setValue(data.contrasenia);
        this.userForm.controls['usuarioidFk'].setValue('equipo');
        this.nombreUserMaquina = data.usuarioidFk;
        this.verTokenUser = false;
        setTimeout(() => {
          this.userForm.controls['codigoTiendaidFk'].setValue(data.tiendasidFk);
        }, 500);
        break;

    }

    this.viewForm       = true;
    this._action_butto  = 'Editar';
    this._cancel_button = true;

  }

  limpiar() {
    this.userForm.controls['nombres']  .setValue('');
    this.userForm.controls['apellidos'].setValue('');
    this.userForm.controls['cedula']   .setValue('');
    this.userForm.controls['telefono'] .setValue('');
    this.userForm.controls['codigoTiendaidFk'].setValue('');
    this.userForm.controls['contrasenia'].setValue('');
    this.userForm.controls['rol'].setValue('');
    this._action_butto  = 'Crear';
    this._cancel_button = false;
    this._show_rol      = false;
    this._show_tienda   = false;
    this.viewForm       = false;
    this._width_table = 'tabledata table-responsive w-100 p-2';
    this._create_show = true;
  }


  valor:string = "portal";
  calidarTipoPersona() {

    if( this.userForm.controls['usuarioidFk'].value != '' ) {
      this.userForm.controls['usuarioPortaidFk'].setValue('');
    } else if (this.userForm.controls['usuarioPortaidFk'].value == '') {
      this.userForm.controls['usuarioidFk'].setValue('');
    }

  }

  modelUsers:any = [];

  guardarUsuario() {
    if ( this.userForm.controls['usuario'].value == null || this.userForm.controls['usuario'].value == undefined || this.userForm.controls['usuario'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de nombre de usuario vacío' });
    else if ( this.userForm.controls['apellidos'].value == null || this.userForm.controls['apellidos'].value == undefined || this.userForm.controls['apellidos'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de apellido de usuario vacío' });
    else if ( this.userForm.controls['cedula'].value == null || this.userForm.controls['cedula'].value == undefined || this.userForm.controls['cedula'].value == '' ) Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de cedula de usuario vacío' });
    else {
      if ( this.securityLevel == 'Bajo' ) {
        Swal.fire({
          title: 'Contraseña de bajo nivel',
          text: "¿Estas creando una contraseña de bajo nivel, deseas continuar?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, crear!'
        }).then((result) => {
          this.crearUsuario();
        })
      }
      else if (this.securityLevel != 'Bajo') {
        this.crearUsuario();
      }  
  }
  }


  crearUsuario() {
    let xrol:any;
    this._show_spinner = true;
    switch(this.valor) {
      case 'equipo':
        break;
      case 'portal':
        if( this.userForm.controls['contrasenia'].value == null || this.userForm.controls['contrasenia'].value == undefined || this.userForm.controls['contrasenia'].value == '' ) {
          Toast.fire({ icon: 'warning', title: 'No puedes enviar el campo de contraseña vacío' });
        }
        else {
          this._create_show = false;
          xrol = this.userForm.controls['rol'].value;
          this.modelUsers = {
            Usuario: this.userForm.controls['usuario'].value,
            Contrasenia: this.userForm.controls['contrasenia'].value,
            Rol: xrol,
            Nombres:   this.userForm.controls['nombres']      .value?.replace(/[^a-zA-Z ]/g, ''),
            Apellidos: this.userForm.controls['apellidos']    .value?.replace(/[^a-zA-Z ]/g, ''),
            Cedula:    this.userForm.controls['cedula']       .value?.replace(/[^0-9.]*/g, ''),
            Telefono:  this.userForm.controls['telefono']     .value?.replace(/[^0-9.]*/g, ''),
            active: 'A'
          }
          ////////console.warn( 'modelUsers PORTAL' );
          ////////console.warn( this.modelUsers );
          setTimeout(() => {
          this.userservs.guardarUsuariosPortal(this.modelUsers).subscribe({
            next: (x) => {
              Toast.fire({ icon: 'success', title: 'Usuario de Portal guardado con éxito' });
            }, error: (e) => {
              console.error(e);
              Toast.fire({ icon: 'error', title: 'No hemos podido guardar el usuario de Portal' });
              this._show_spinner = false;
            }, complete: () => { 
              this._show_spinner = false;
              this.obtenerUsuarioPortalWeb();
              this.limpiar();
            }
          })
        }, 1000);
        }
        break;
    }
  }

  modelDatosPersonales:any = [];
  editarUsuario() {

    let xrol:any;
    switch(this.valor) {
      case 'portal':
        xrol = this.userForm.controls['rol'].value;
        //console.warn(xrol);
        this.modelUsers = {
          id:          this.idusermaquina,
          usuario:     this.userForm.controls['usuario'].value,
          contrasenia: this.userForm.controls['contrasenia'].value,
          rol:         this.userForm.controls['rol'].value,
          active:      'A'
        }

        this.modelDatosPersonales = {
          id: this.idDatosPersonales,
          UsuarioPortaidFk: this.userForm.controls['usuario'].value,
          nombres: this.userForm.controls['nombres'].value?.replace(/[^a-zA-Z ]/g, ''),
          apellidos: this.userForm.controls['apellidos'].value?.replace(/[^a-zA-Z ]/g, ''),
          cedula: this.userForm.controls['cedula'].value?.replace(/[^0-9.]*/g, ''),
          telefono: this.userForm.controls['telefono'].value?.replace(/[^0-9.]*/g, ''),
          active: 'A'
        }

        //console.warn( 'modelUsers PORTAL' );
        //console.warn( this.modelUsers );
        //console.warn( this.modelDatosPersonales );
        this.userservs.actualizarUsuarioPortal( this.idusermaquina,  this.modelUsers).subscribe({
          next: (x) => {
            Toast.fire({ icon: 'success', title: 'Usuario de Portal actualizado con éxito' });
          }, error: (e) => {
            console.error(e);
            Toast.fire({ icon: 'error', title: 'No hemos podido actualizar el usuario de Portal' });
          }, complete: () => {
            // this.userlista.unshift(this.modelUsers);  
            this.actualizarDatosPersonales(this.idDatosPersonales, this.modelDatosPersonales);
            this.limpiar();
          }
        })

        break;
    }

  }

  

  actualizarDatosPersonales(id:number, model:any []) { 

    this.userservs.actualizarDatosPersonales(id, model).subscribe({
      next: (x) => {
        // //////console.log('SE ACTUALIZAO DATOS PERSONALES');
        this.obtenerUsuario();
        this.obtenerUsuarioPortalWeb();  
      }, error: (e) => {
        console.error(e);
      }
    })

  }


  listaUsuariosMaquina: any = [];
  listaUsuariosMaquinaGhost: any = [];
  obtenerUsuario() {
    this._show_spinner = true;
    this.userservs.obtenerUsuarios().subscribe({
        next: (x) => {
          this.listaUsuariosMaquina = x;
          this.listaUsuariosMaquinaGhost = x;
          ////////console.warn('USUARIOS MAQUINAS');
          ////////console.warn(this.listaUsuariosMaquina);
          this._show_spinner = false;
        }, error: (e) => {
          this._show_spinner = false;
        }
      }
    )
  }

  filterusermaq:any;
  filterUsuariosMaquinaria() {
    this.listaUsuariosMaquina = this.listaUsuariosMaquinaGhost.filter((item:any) => 
      item.nombres.toLowerCase().includes(this.filterusermaq.toLowerCase())      ||
      item.nombreTienda.toLowerCase().includes(this.filterusermaq.toLowerCase()) ||
      item.cedula.toLowerCase().includes(this.filterusermaq.toLowerCase())       ||
      item.telefono.toLowerCase().includes(this.filterusermaq.toLowerCase()) 
    )
  }

  filteruserportal:any;
  filterUsuariosPortalWeb() {
    this.listaUsuariosPortalWeb = this.listaUsuariosPortalWebGhost.filter((item:any) => 
      item.nombres.toLowerCase().includes(this.filteruserportal.toLowerCase())      ||
      item.cedula.toLowerCase().includes(this.filteruserportal.toLowerCase())       ||
      item.apellidos.toLowerCase().includes(this.filteruserportal.toLowerCase())      ||
      item.usuario.toLowerCase().includes(this.filteruserportal.toLowerCase())      ||
      item.telefono.toLowerCase().includes(this.filteruserportal.toLowerCase())     ||
      item.rolNombre.toLowerCase().includes(this.filteruserportal.toLowerCase())     
    )
  }

  eliminarUsuarios(id:number, type:number) {

    switch(type) {
      case 1:
        this.userservs.deleteUsuario(id).subscribe({
          next: (x) => {
            this.obtenerUsuario();
          }, error: (e) => {
            console.error(e);
          }, complete: () => {
            this.limpiar();
          }
        })
        break;
      case 2:

      // //////console.log(id)
      // //////console.log(type)

        this.userservs.deleteUsuarioPortal(id).subscribe({
          next: (x) => {
            this.obtenerUsuarioPortalWeb();
          }, error: (e) => {
            console.error(e);
          },complete: () => {
            this.limpiar();
          }
        })
        break;
    }
  }

  listaUsuariosPortalWeb: any = [];
  listaUsuariosPortalWebGhost: any = [];
  obtenerUsuarioPortalWeb() {
    this._show_spinner = true;
    this.userservs.obtenerUsuariosPortal().subscribe({
      next: (x) => {
        this.listaUsuariosPortalWeb = x;
        this.listaUsuariosPortalWebGhost = x;
        ////////console.warn('USUARIOS PORTAL WEB');
        ////////console.warn(this.listaUsuariosPortalWeb);
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }
    })
  }


  clienteListaGhost: any = [];
  clientelista:any = []
  obtenerCliente() {
    this.clientelista = [];
    this._show_spinner = true;
    this.clienteserv.obtenerCliente()
                    .subscribe({
      next: (cliente) => {
        this.clienteListaGhost = cliente;
        ////////console.warn(this.clientelista);
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
          ////////console.warn(this.clientelista);

        })
      }
    })
  }

  tiendalista:any = [];
  tiendaListaGhost:any = [];
  obtenerTiendas() {
    this.tiendaservs.obtenerTiendas().subscribe(
      {
        next: (tienda) => {
          this.tiendaListaGhost = tienda;
          this.tiendalista = tienda;
        }
      }
    )
  }


  rolLista:any = [];
  getDataMaster(cod:string) {

    ////////console.warn('Codigo maestro: ');
    ////////console.warn(cod);

    this.sharedservs.getDataMaster(cod).subscribe({
      next: (data) => {
        switch(cod) {
        case 'ROL':
          this.rolLista = data;
          // //////console.log(this.rolLista);
          break;
        }
      }
    })
  }

}
