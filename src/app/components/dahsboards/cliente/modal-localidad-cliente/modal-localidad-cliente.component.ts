import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteComponent } from '../cliente.component';
import { Environments } from 'src/app/components/environments/environments';
import { ControlinputsService } from 'src/app/components/shared/services/controlinputs.service';
import { ModalClienteService } from './services/modal-cliente.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

@Component(
  {
    selector: 'app-modal-localidad-cliente',
    templateUrl: './modal-localidad-cliente.component.html',
    styleUrls: ['./modal-localidad-cliente.component.scss'] 
  }
)

export class ModalLocalidadClienteComponent implements OnInit {

  modelSaveLocalidades: any = [];
  _show_spinner: boolean = false;
  listaLocalidades:      any = [];
  listaLocalidadesGhost: any = [];

  listaCheckLocalidad:   any = [];

  public filterForm = new FormGroup(
    {
      filterCli:   new FormControl('')
    }
  )

  constructor( public dialogRef: MatDialogRef<ClienteComponent>,
               private loc: ModalClienteService,
               @Inject(MAT_DIALOG_DATA) public data: any, private env: Environments ) { }

    ngOnInit(): void {
      this.obtenerLocalidades(this.data.codigoCliente)
    }

    obtenerLocalidades(codcli:any) {
      this._show_spinner = true;
      this.loc.obtenerLocalidades(codcli).subscribe({
        next: ( localidad ) => {
          this.listaLocalidadesGhost = localidad;
        }, complete: () => {
          this._show_spinner = false;
        }, error:(e) => {
          console.error(e);
          this._show_spinner = false;
        }
      })
    }

    guardarLocalidad() {    
      this._show_spinner = true;
      this.modelSaveLocalidades = {
        cliente: this.data.codigoCliente,
        localidades: this.listaCheckLocalidad
      }
  
      this.loc.guardarLocalidades( this.modelSaveLocalidades ).subscribe({
        next: (x) => {
          this._show_spinner = false;
        }, error: (e) => {
          console.error(e)
          Toast.fire({
            icon: "error",
            title: "Algo ha sucedido al momento de asignar las localidades"
          });
          this._show_spinner = false;
        }, complete: () => {
          Toast.fire({
            icon: "success",
            title: "Localidades asignadas"
          });
          this.dialogRef.close(this.modelSaveLocalidades);
        }
      })
  
    }

    toggleLocalidad( locCodigo: string ) {

      if (this.listaCheckLocalidad.includes(locCodigo.trim())) {
        this.listaCheckLocalidad = this.listaCheckLocalidad.filter((codigo:any) => codigo !== locCodigo.trim());
      } else {
        this.listaCheckLocalidad.push(locCodigo.trim());
      }

    }

    filterCliente () {

      let filter: any = this.filterForm.controls['filterCli'].value;  
      this.listaLocalidades = this.listaLocalidadesGhost.filter( (item:any) => 
        item.nombre.toLowerCase().includes(filter.toLowerCase())
      );

      if ( filter.length == 0 ) {
        this.listaLocalidades = []
      }

    }


}