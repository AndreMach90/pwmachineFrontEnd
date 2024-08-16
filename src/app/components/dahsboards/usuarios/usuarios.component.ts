import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Environments } from '../../environments/environments'; 
import { MatDialog } from '@angular/material/dialog';
import { ServicesSharedService } from '../../shared/services-shared/services-shared.service';
import { UsuariosService } from './services/usuarios.service';
import Swal from 'sweetalert2';
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
  crear:any = this.env.apiUrlIcon()+'accept.png';
  edit:any = this.env.apiUrlIcon()+'edit.png';
  delete:any = this.env.apiUrlIcon()+'delete.png';
  cancel:any = this.env.apiUrlIcon()+'cancel.png';
  _width_table: string = 'tabledata table-responsive w-100 p-2';
  calwidth:                     boolean = true;
  _create_show:                 boolean = true;
  _show_spinner:                boolean = false;
  viewForm:                     boolean = false;
  permisonUsers:                boolean = false;
  idusermaquina:                number = 0;
  _action_butto:                string = 'Crear';
  securityLevel:                any;
  filteruserportal:             any;
  idDatosPersonales:            any = 0;
  modelUsers:                   any = [];
  modelDatosPersonales:         any = [];
  listaUsuariosPortalWeb:       any = [];
  listaUsuariosPortalWebGhost:  any = [];
  rolLista:                     any = [];
  
  public userForm = new FormGroup({
    usuario:            new FormControl(''),
    nombres:            new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    apellidos:          new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    cedula:             new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    contrasenia:        new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    telefono:           new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    rol:                new FormControl('', [Validators.required, this.noWhitespaceValidator()])
  });

  constructor( private env: Environments,
    private controlInputsService: ControlinputsService,
    public  dialog: MatDialog,
    private userservs: UsuariosService,
    private sharedservs: ServicesSharedService ) {
    this.userForm.get('nombres')?.valueChanges.subscribe(() => this.generarNombreUsuario());
    this.userForm.get('apellidos')?.valueChanges.subscribe(() => this.generarNombreUsuario());
    this.userForm.get('cedula')?.valueChanges.subscribe(() => this.generarNombreUsuario());
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
    this.getDataMaster('ROL');
    this.obtenerUsuarioPortalWeb();
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }
    this._action_butto === 'Crear' ? this.guardarUsuario() : this.editarUsuario();
  }

  widthAutom() {
    this._width_table = this.calwidth ? 'tabledata table-responsive w-75 p-2' : 'tabledata table-responsive w-100 p-2';
    this.calwidth = !this.calwidth;
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
    const primerCaracterNombres = nombres.charAt(0).toLowerCase(); //Primer carácter de nombres
    const primeros5Apellidos = apellidos.slice(0, 5).replace(' ', '_').toLowerCase(); //5 primeros caracteres de apellidos
    const ultimos4Cedula = cedula.slice(-4); //4 últimos dígitos de la cédula
    const nombreUsuario = primerCaracterNombres + primeros5Apellidos + ultimos4Cedula;
    this.userForm.get('usuario')?.setValue(nombreUsuario);
  }

  validatePassword() {
    const password:any = this.userForm.controls['contrasenia'].value;    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLengthValid = password.length > 6;
    if (hasUpperCase && hasNumber && isLengthValid) this.securityLevel = 'Alto';
    if (hasUpperCase || hasNumber && (password > 4 && password < 7) ) this.securityLevel = 'Medio';
    if (password.length < 4) this.securityLevel = 'Bajo';
  }

  catchData(data:any) {
    this.calwidth = true;
    this.widthAutom();
    this.idusermaquina = data.id;
    this.idDatosPersonales = data.idDatosPersonales;
    this.userForm.controls['nombres']  .setValue(data.nombres);
    this.userForm.controls['apellidos'].setValue(data.apellidos);
    this.userForm.controls['cedula']   .setValue(data.cedula);
    this.userForm.controls['telefono'] .setValue(data.telefono);
    this.userForm.controls['contrasenia'].setValue(data.contrasenia);
    this.userForm.controls['rol'].setValue(data.rol);
    this.viewForm       = true;
    this._action_butto  = 'Editar';
  }

  limpiar() {
    this._width_table = 'tabledata table-responsive w-100 p-2';
    this.userForm.controls['nombres']  .setValue('');
    this.userForm.controls['apellidos'].setValue('');
    this.userForm.controls['cedula']   .setValue('');
    this.userForm.controls['telefono'] .setValue('');
    this.userForm.controls['contrasenia'].setValue('');
    this.userForm.controls['rol'].setValue('');
    this._action_butto  = 'Crear';
    this.viewForm       = false;
    this._create_show   = true;
    this.resetFormGroup(this.userForm);
  }

  guardarUsuario() {
    if (this.securityLevel === 'Bajo') {
      Swal.fire({
        title: 'Contraseña de bajo nivel',
        text: "¿Estás creando una contraseña de bajo nivel, deseas continuar?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, crear!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.crearUsuario();
        }
      });
    } else {
      this.crearUsuario();
    }
  }

  crearUsuario() {
    this._show_spinner = true;
    this._create_show = false;
    this.modelUsers = {
      Usuario: this.userForm.controls['usuario'].value,
      Contrasenia: this.userForm.controls['contrasenia'].value,
      Rol: this.userForm.controls['rol'].value,
      Nombres:   this.userForm.controls['nombres'].value?.replace(/[^a-zA-Z ]/g, ''),
      Apellidos: this.userForm.controls['apellidos'].value?.replace(/[^a-zA-Z ]/g, ''),
      Cedula:    this.userForm.controls['cedula'].value?.replace(/[^0-9.]*/g, ''),
      Telefono:  this.userForm.controls['telefono'].value?.replace(/[^0-9.]*/g, ''),
      active: 'A'
    }
    setTimeout(() => {
      this.userservs.guardarUsuariosPortal(this.modelUsers).subscribe({
        next: (x) => Toast.fire({ icon: 'success', title: 'Usuario de Portal guardado con éxito' }), 
        error: (e) => {
          Toast.fire({ icon: 'error', title: 'No hemos podido guardar el usuario de Portal' });
          this._show_spinner = false;
        }, 
        complete: () => { 
          this._show_spinner = false;
          this.obtenerUsuarioPortalWeb();
          this.limpiar();
        }
      })
    }, 1000);
  }

  editarUsuario() {
    this.modelUsers = {
      id:          this.idusermaquina,
      usuario:     this.userForm.controls['usuario'].value,
      contrasenia: this.userForm.controls['contrasenia'].value,
      rol:         this.userForm.controls['rol'].value,
      active:      'A'
    };
    this.modelDatosPersonales = {
      id: this.idDatosPersonales,
      UsuarioPortaidFk: this.userForm.controls['usuario'].value,
      nombres: this.userForm.controls['nombres'].value?.replace(/[^a-zA-Z ]/g, ''),
      apellidos: this.userForm.controls['apellidos'].value?.replace(/[^a-zA-Z ]/g, ''),
      cedula: this.userForm.controls['cedula'].value?.replace(/[^0-9.]*/g, ''),
      telefono: this.userForm.controls['telefono'].value?.replace(/[^0-9.]*/g, ''),
      active: 'A'
    };
    this.userservs.actualizarUsuarioPortal( this.idusermaquina,  this.modelUsers).subscribe({
      next: (x) => Toast.fire({ icon: 'success', title: 'Usuario de Portal actualizado con éxito' }), 
      error: (e) => Toast.fire({ icon: 'error', title: 'No hemos podido actualizar el usuario de Portal' }), 
      complete: () => {
        this.actualizarDatosPersonales(this.idDatosPersonales, this.modelDatosPersonales);
        this.limpiar();
      }
    });
  }

  actualizarDatosPersonales(id:number, model:any []) { 
    this.userservs.actualizarDatosPersonales(id, model).subscribe({
      next: (x) => this.obtenerUsuarioPortalWeb(), 
      error: (e) => console.error(e)
    })
  }

  filterUsuariosPortalWeb() {
    const filterText = this.filteruserportal.toLowerCase();
    this.listaUsuariosPortalWeb = this.listaUsuariosPortalWebGhost.filter((item: any) => 
      ['nombres', 'cedula', 'apellidos', 'usuario', 'telefono', 'rolNombre'].some(key =>
        item[key].toLowerCase().includes(filterText)
      )
    );
  }

  eliminarUsuarios(id:number) {
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
        this.userservs.deleteUsuarioPortal(id).subscribe({
          next: (x) => Swal.fire('Eliminado!', 'Usuario eliminado', 'success'),
          error: (e) => {
            console.error(e);
            Swal.fire('Upps!', 'No hemos podido eliminar esta usuario', 'error');
          },
          complete: () => {
            this._show_spinner = false;
            this.obtenerUsuarioPortalWeb();
            this.limpiar();
          },
        });
      }
    });
  }

  obtenerUsuarioPortalWeb() {
    this._show_spinner = true;
    this.userservs.obtenerUsuariosPortal().subscribe({
      next: (x) => {
        console.log("usuarioPortalweb",x);
        this.listaUsuariosPortalWeb = x;
        this.listaUsuariosPortalWebGhost = x;
      }, 
      error: (e) => console.log(e),
      complete: () => this._show_spinner = false
    })
  }

  getDataMaster(cod:string) {
    this.sharedservs.getDataMaster(cod).subscribe({
      next: (data) => this.rolLista = data,
      error: (e) => console.log(e)
    })
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
