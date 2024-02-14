import { Component, Inject, OnInit } from '@angular/core';
import { EquipoComponent } from '../equipo.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Environments } from 'src/app/components/environments/environments';
import { ServicesSharedService } from 'src/app/components/shared/services-shared/services-shared.service';
import { EquipoService } from '../services/equipo.service';
import { UsuariosService } from '../../usuarios/services/usuarios.service';

import Swal from 'sweetalert2'
import { ControlinputsService } from 'src/app/components/shared/services/controlinputs.service';
import { TiendaService } from '../../tienda/services/tienda.service';
import { FormControl, FormGroup } from '@angular/forms';
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
  selector: 'app-usuarios-temporales-maquina',
  templateUrl: './usuarios-temporales-maquina.component.html',
  styleUrls: ['./usuarios-temporales-maquina.component.scss']
})
export class UsuariosTemporalesMaquinaComponent implements OnInit {

  ipMachine:                    any;
  modelUsers:                   any = [];
  delete:                       any = this.env.apiUrlIcon()+'delete.png';
  accept:                       any = this.env.apiUrlIcon()+'accept.png';
  edit:                         any = this.env.apiUrlIcon()+'edit.png';
  crear:                        any = this.env.apiUrlIcon()+'accept.png';
  cancel:                       any = this.env.apiUrlIcon()+'cancel.png';
  search:                       any = this.env.apiUrlIcon()+'search.png';
  _show_spinner:                boolean = false;
  _create_show:                 boolean = true;
  listaUsuariosTemporales:      any = [];
  listaUsuariosTemporalesGhost: any = [];

  constructor( public dialogRef: MatDialogRef<EquipoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private env: Environments,
    private userservs: UsuariosService,
    private controlInputsService: ControlinputsService,
    private tiendaservs: TiendaService,
    private sharedservs: ServicesSharedService, private eqipserv: EquipoService ) { }


    public filterUsuariosTemporalesForm = new FormGroup({
      filterequip:              new FormControl('')
    })
    
  ngOnInit(): void {
    ////////console.warn(this.data);
    this.obtenerUsuariosTemporales();
    this.obtenerCuentasTienda()
  }

  validateInputText(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target instanceof HTMLInputElement) {
      this.controlInputsService.validateAndCleanInput(target);
    }
  }
  
  validateInputNumber(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target instanceof HTMLInputElement) {
      this.controlInputsService.validateAndCleanNumberInput(target);
    }
  }

  obtenerUsuariosTemporales() {
    this.eqipserv.obtenerUsuariosTemporales(this.data.ipEquipo).subscribe(
      {
        next: (x) => {
          this.listaUsuariosTemporales = x;
          this.listaUsuariosTemporalesGhost = x;
        }, error: (e) => {
          console.error(e);
        }
      }
    )
  }
  actividadSeleccionada: string = '';
  onChangeActividad(event: any, index: number) {
    const actividadInput = <HTMLSelectElement>document.getElementById('cuentasbanc-' + index);
    this.actividadSeleccionada = actividadInput.value;
  }

  arr:any = [];
  aceptarUsuario( usuario: any, index: number) {
    
    const nombresInput   = <HTMLInputElement>document.getElementById('nombres-'  + index);
    const cedulaInput    = <HTMLInputElement>document.getElementById('cedula-'   + index);
    // const telefonoInput  = <HTMLInputElement>document.getElementById('telefono-' + index);
    const actividadInput = <HTMLInputElement>document.getElementById('tipo-'     + index);

    const nombres   = nombresInput.value.trim();
    const cedula    = cedulaInput.value.trim();
    const telefono  = '';
    const actividad = actividadInput.value.trim();

    if (nombres === '' || cedula === '') {
        Toast.fire({ icon: 'warning', title: 'Necesitas llenar todos los campos de la fila en cuestión.', timer: 3000, position: 'bottom' });
        return;
    }


    if ( this.actividadSeleccionada == ""  || this.actividadSeleccionada == null || this.actividadSeleccionada == undefined ) {
      this.actividadSeleccionada = this.listaCuentaTiendasBanc[0].idcuentabancaria;
    }

    this.guardarUsuario(usuario.id, usuario.usuario, nombres, cedula, telefono, actividad, this.actividadSeleccionada );

}


listaCuentaTiendasBanc:any = [];
obtenerCuentasTienda() {
  this.tiendaservs.obtenerCuentasAsignadas(this.data.codigoTienda).subscribe({
    next: (cuentaTiendaBank) => {
      this.listaCuentaTiendasBanc = cuentaTiendaBank;
    }
  })
}

guardarUsuario( id:number, usuario:string, nombres:string, cedula:string, telefono:string, actividad:any, observacion: any ) {

  this.modelUsers = {
    Usuario:      usuario,
    Contrasenia:  null,
    IpMachine:    this.data.ipEquipo,    
    Rol:          this.data.codigoTiendaidFk,
    Nombres:      nombres,
    Apellidos:    ' ',
    Cedula:       cedula,
    Telefono:     '',
    active:       'A',
    cuentasIdFk:   observacion,
    observacion:   actividad
  }

  this._create_show   =  false;
  this._show_spinner = true;
  setTimeout(() => {
  this.userservs.guardarUsuarios(this.modelUsers).subscribe(
    {
      next: (x) => {
        Toast.fire({ icon: 'success', title: 'Usuario temporal guardado con éxito' });
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
        Toast.fire({ icon: 'error', title: 'No hemos podido guardar el usuario temporal' });
      },complete: () => {
        this._show_spinner = false;
        this.eliminarUsuarioTemporal(id);
        this.closeDialog();
        // this.obtenerUsuariosTemporales();
      }
    }
  )
  }, 1000);
}


closeDialog() {
  this.dialogRef.close(true);
}

eliminarUsuarioTemporal(id:number) {
  ////////console.warn(id);
  this.eqipserv.eliminarUsuarioTemporal(id).subscribe({
    next: (x) => {
      ////////console.warn('Actualizado a F');
    }, error: (e) => {
      console.error(e);
    },    
    complete: () => {
      this.obtenerUsuariosTemporales();
    }
  })
}

filterUsuariosTemporales() {
  let filter: any = this.filterUsuariosTemporalesForm.controls['filterequip'].value;
  this.listaUsuariosTemporales = this.listaUsuariosTemporalesGhost.filter((item:any) =>  
    item.usuario.toLowerCase().includes(  filter.toLowerCase()) || item.ipMachineSolicitud.toLowerCase().includes(filter.toLowerCase()  )
  )
}

}
