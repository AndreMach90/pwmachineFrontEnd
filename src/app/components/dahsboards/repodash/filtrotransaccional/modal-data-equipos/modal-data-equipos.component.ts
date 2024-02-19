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
export class 
ModalDataEquiposComponent implements OnInit {

  filterEqui:               string  = '';
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
      //console.log(this.data.acreditado);
      this.obtenerEquiposTran();
      this.result = this.data.equiposExistentes;
      //console.log('this.result');
      //console.log(this.result);
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
            console.log(this.listaEsquipoGhost);
            //console.log(this.data.codigocliente);
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
                  return !this.result.some((element:any) => element.nserie === x.machine_Sn);
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

            this.listaEsquipo.filter( ( element:any ) => {
              
              if( element.conteo_A == null || element.conteo_A == undefined ) {
                element.conteo_A = 0;
              }
              
              else if ( element.conteo_M == null  || element.conteo_M == undefined ) {
                element.conteo_M = 0;
              }
              
              else if ( element.conteo_R == null  || element.conteo_R == undefined ) {
                element.conteo_R = 0;
              }
              
              else if ( element.conteo_AR == null || element.conteo_AR == undefined ) {
                element.conteo_AR = 0;
              }

              else if ( element.conteo_MR == null || element.conteo_MR == undefined ) {
                element.conteo_R = 0;
              }

              element.totalTransac = element.conteo_A + element.conteo_M + element.conteo_AR + element.conteo_MR;

            })

            //console.log(this.listaEsquipo);

          }
        }
      )

    }

    seleccionarTodosEquipos(event: any) {
      if (event.target && event.target.checked !== undefined) {
        const seleccionado = event.target.checked;
    
        if (seleccionado) {
          this.choiceEquipos = true;    
          this.equiposSeleccionados = this.listaEsquipo.map((equipo: any) => {
            if (equipo.conteo_M > 0 || equipo.conteo_A > 0) {
              equipo.checkTran = true;
              return { nserie: equipo.machine_Sn, ipequipo: equipo.ipEquipo };
            } else if (equipo.conteo_M == 0 && equipo.conteo_A == 0) {
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
            ipequipo: equipo.ipEquipo
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
    this.listaEsquipoGhost.filter( (equip: any) => { if (  equip.nombreTienda == null ) equip.nombreTienda = '' } );
    this.listaEsquipo = this.listaEsquipoGhost.filter( (item:any) => item.machine_Sn.toLowerCase().includes(this.filterEqui.toLowerCase()) || item.nombreTienda.toLowerCase().includes(this.filterEqui.toLowerCase()) );
  }

  closeDialog() {
    this.dialogRef.close(this.equiposSeleccionados);
  }

}
