
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EquipoService } from '../../../equipo/services/equipo.service';
import { Environments } from 'src/app/components/environments/environments';
import { ModeldataComponent } from 'src/app/components/shared/modeldata/modeldata.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-data-equipos',
  templateUrl: './modal-data-equipos.component.html',
  styleUrls: ['./modal-data-equipos.component.scss']
})

export class ModalDataEquiposComponent implements OnInit {
  
  localidadesEncontradas:   any     = [];
  listaEsquipo:             any     = [];
  listaEsquipoGhost:        any     = [];
  listaEsquipoGhostTienda:  any     = [];
  equiposSeleccionados:     any     = [];
  choiceEquipos:            boolean = false;
  result:                   any     = [];
  fecInicio:                any;
  fecFin:                   any;
  modelFilterTranEqipos:    any     = [];

  constructor( public dialog: MatDialog,
               private equiposerv: EquipoService,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private env: Environments,
               public dialogRef: MatDialogRef<ModeldataComponent>) {}
               
               
               public equipoCliForm = new FormGroup({
                filterEqui:   new FormControl('')
               })

  ngOnInit(): void {
    this.obtenerEquiposTran();
    this.result = this.data.equiposExistentes;
    console.warn('/*/*/*/*/*/*/*/*/*');
    console.warn(this.result);
    console.warn('/*/*/*/*/*/*/*/*/*');
  }

  totalResagadasAutomaticas: number = 0;
  totalResagadasManuales:    number = 0;
  totalManuales:             number = 0;
  totalAutomaticas:          number = 0;
  SumatotalTransac:          number = 0;
  SumatotalTransacResag:     number = 0;
  sumatoriaResagadasTransac( objeto:any ) {
    this.totalResagadasAutomaticas = 0;
    this.totalResagadasManuales    = 0;
    this.totalManuales = 0;
    this.totalAutomaticas = 0;
    objeto.filter( ( x:any ) => { 
      this.totalResagadasAutomaticas += x.conteo_AR;
      this.totalResagadasManuales    += x.conteo_MR;
      this.totalManuales             += x.conteo_M;
      this.totalAutomaticas          += x.conteo_A;
    })
    this.SumatotalTransac = this.totalManuales + this.totalAutomaticas;
    this.SumatotalTransacResag = this.totalResagadasAutomaticas + this.totalResagadasManuales;
  }

  obtenerEquiposTran() {
    let xi: number = 0;
    if ( this.data.acreditado == 1 ) xi = 2
    else xi = 1
    this.modelFilterTranEqipos = {
      fechaIni : this.data.fecchaIni,
      fechaFin : this.data.fechaFin
    }

    this.equiposerv.obtenerEquipoConteoTran(xi, this.modelFilterTranEqipos).subscribe(
      {
        next: (equipo) => {
          this.listaEsquipoGhost = equipo;
        },
        error: (e) => {
          console.error(e);
        },
        complete: ()  => {
          /** Reparando esta sección */            
          if (this.data.codigocliente !== null && this.data.codigocliente !== undefined) {
            if (this.data.equiposExistentes == null || this.data.equiposExistentes.length == 0 ) {
              this.listaEsquipo = this.listaEsquipoGhost.filter((equiposCliente: any) => equiposCliente.idCliente === this.data.codigocliente);
            } else {
              this.listaEsquipo = this.listaEsquipoGhost.filter( (equiposCliente:any) =>  equiposCliente.idCliente === this.data.codigocliente && equiposCliente.machine_Sn);
              this.listaEsquipo = this.listaEsquipo.filter( (x:any) => {
                return !this.result.some( (element:any) => element.nserie === x.machine_Sn);
              });
            }
          }  
          else {
            if (this.data.equiposExistentes == null || this.data.equiposExistentes.length == 0 ) {
              this.listaEsquipo = this.listaEsquipoGhost;
            } else {
              this.listaEsquipo = this.listaEsquipoGhost.filter( (x:any) => {
                return !this.result.some((element:any) => element.nserie === x.machine_Sn);
              });
            }
          }
          //console.log(this.listaEsquipo);
          this.localidadesEncontradas = [];

          // Recorremos la lista de equipos para crear localidadesEncontradas
          this.listaEsquipo.forEach((element: any) => {
              element.localidad = element.localidad.toString().trim()
              if (element.conteo_A == null || element.conteo_A == undefined) {
                  element.conteo_A = 0;
              } else if (element.conteo_M == null || element.conteo_M == undefined) {
                  element.conteo_M = 0;
              } else if (element.conteo_R == null || element.conteo_R == undefined) {
                  element.conteo_R = 0;
              } else if (element.conteo_AR == null || element.conteo_AR == undefined) {
                  element.conteo_AR = 0;
              } else if (element.conteo_MR == null || element.conteo_MR == undefined) {
                  element.conteo_MR = 0;
              } else if (element.localidad == null || element.localidad == undefined) {
                  element.localidad = 'No asignado';
                  element.bgloc = 'bg-secondary text-light '
              } else if (element.localidad != null || element.localidad != undefined) {
                  element.bgloc = 'bg-primary text-light'
              } else if (element.nombreTienda == null || element.nombreTienda == undefined) {
                  element.nombreTienda = 'No asignado';
              }
            
              // Verificamos si la localidad ya existe en localidadesEncontradas
              let localidadIndex = this.localidadesEncontradas.findIndex((x: any) => x.loc === element.localidad);
              if (localidadIndex === -1) {
                  // Si no existe, la agregamos junto con sus propiedades
                  this.localidadesEncontradas.push({ loc: element.localidad, bgloc: element.bgloc, equiposTrans: [] });
              }
              // Luego, siempre agregamos los equipos a la matriz equiposTrans correspondiente
              this.localidadesEncontradas[localidadIndex !== -1 ? localidadIndex : this.localidadesEncontradas.length - 1].equiposTrans.push(element);
          });

          this.sumatoriaResagadasTransac(this.listaEsquipo);
          
        }
      }
    )
  }

  // Variable para almacenar los equipos seleccionados
selectedEquipos: any[] = [];

// Función para seleccionar/deseleccionar todos los equipos
selectAll(event: any, localidad: any) {
  const checked = event.target.checked;
  if (checked) {
    localidad.equiposTrans.forEach((equipo: any, index: number) => {
      let checkbox = document.getElementById(equipo.localidad.toString().trim() + '-' + index) as HTMLInputElement;
      checkbox.checked = true;
      this.addToSelectedEquipos(equipo);
    });
  } else {

    localidad.equiposTrans.forEach((equipo: any, index: number) => {
      let checkbox = document.getElementById(equipo.localidad.toString().trim() + '-' + index) as HTMLInputElement;
      checkbox.checked = false;
      this.removeFromSelectedEquipos(equipo);
    });

  }

  // //console.warn(this.equiposSeleccionados)

}

// Función para agregar un equipo a la lista de equipos seleccionados
addToSelectedEquipos(equipo: any) {
  if (!this.equiposSeleccionados.includes(equipo)) {
    this.equiposSeleccionados.push(equipo);
  }
  //console.warn(this.equiposSeleccionados);
}

// Función para remover un equipo de la lista de equipos seleccionados
removeFromSelectedEquipos(equipo: any) {
  this.equiposSeleccionados = this.equiposSeleccionados.filter( ( selectedEquipo: any ) => selectedEquipo !== equipo );
  //console.warn(this.equiposSeleccionados)
}

selectedEquiposControl = new FormControl(false);
toggleSelection(equipo: any, localidad: any) {
  if (this.selectedEquiposControl.value) {
    this.addToSelectedEquipos(equipo);
  } else {
    this.removeFromSelectedEquipos(equipo);
  }
}

  seleccionarTodosEquipos(event: any) {
    if (event.target && event.target.checked !== undefined) {
      const seleccionado = event.target.checked;  
      if (seleccionado) {
        this.choiceEquipos = true;
        this.equiposSeleccionados = this.listaEsquipo.map((equipo: any) => {
          if ( equipo.conteo_M > 0 || equipo.conteo_A > 0 || equipo.conteo_AR > 0 || equipo.conteo_MR > 0 ) {
            equipo.checkTran = true;
            return { nserie: equipo.machine_Sn, ipequipo: equipo.ipEquipo, transaccionesResagadas: equipo.transaccionesResagados };
          } else if ( equipo.conteo_M == 0 && equipo.conteo_A == 0 && equipo.conteo_AR == 0 && equipo.conteo_MR == 0 ) {
            equipo.checkTran = false;
            return null;
          } else {
            equipo.checkTran = false;
            return null;
          }
        });
        this.equiposSeleccionados = this.equiposSeleccionados.filter((equipo:any) => equipo !== null);
        
      } else {
        this.equiposSeleccionados = [];
        this.listaEsquipo.filter((element:any) => element.checkTran = false );
        this.choiceEquipos = false;
      }
    }
  }

  seleccionarEquipo(equipo: any, event: any) {

    if (event.target && event.target.checked !== undefined) {
      const seleccionado = event.target.checked;
      if (seleccionado) {
        const existe = this.equiposSeleccionados.some(
          (e: any) => e.nserie === equipo.machine_Sn
        );  
        if (!existe) {
          this.equiposSeleccionados.push({
            nserie: equipo.machine_Sn,
            ipequipo: equipo.ipEquipo,
            transaccionesResagadas: equipo.transaccionesResagados
          });
        }
      } else {
        this.equiposSeleccionados = this.equiposSeleccionados.filter(
          (e: any) => e.nserie !== equipo.machine_Sn
        );  
      }
    }
  }  

  filterEquipo () {

    let filterEqui: any = this.equipoCliForm.controls['filterEqui'].value;
    this.listaEsquipoGhost.filter( (equip: any) => { if (  equip.nombreTienda == null ) equip.nombreTienda = '' } );
    this.listaEsquipo = this.listaEsquipoGhost.filter( (item:any) => 
      item.machine_Sn.toLowerCase()  .includes(filterEqui.toLowerCase()) ||
      item.localidad.toLowerCase()   .includes(filterEqui.toLowerCase()) ||
      item.nombreTienda.toLowerCase().includes(filterEqui.toLowerCase())
    );

    this.sumatoriaResagadasTransac(this.listaEsquipo);

  }

  closeDialog() {
    // selectedEquipos
    this.dialogRef.close(this.equiposSeleccionados);
  }
  
}
