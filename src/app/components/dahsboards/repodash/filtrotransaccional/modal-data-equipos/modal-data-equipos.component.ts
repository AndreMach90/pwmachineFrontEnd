import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EquipoService } from '../../../equipo/services/equipo.service';
import { Environments } from 'src/app/components/environments/environments';
import { ModeldataComponent } from 'src/app/components/shared/modeldata/modeldata.component';

@Component({
  selector: 'app-modal-data-equipos',
  templateUrl: './modal-data-equipos.component.html',
  styleUrls: ['./modal-data-equipos.component.scss']
})
export class ModalDataEquiposComponent implements OnInit {

  filterEqui:               string = '';
  listaEsquipo:                any = [];
  listaEsquipoGhost:           any = [];
  listaEsquipoGhostTienda:     any = [];
  equiposSeleccionados:        any = [];
  choiceEquipos:               boolean = false;
  result:                      any = [];
  fecInicio:                   any;
  fecFin:                      any;
  modelFilterTranEqipos:       any = [];

  constructor( public dialog: MatDialog,
               private equiposerv: EquipoService,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private env: Environments,
               public dialogRef: MatDialogRef<ModeldataComponent>) {}


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
            //console.log(this.listaEsquipoGhost);
            //console.log(this.data.codigocliente);
          },
          error:    (e) => {
            console.error(e);
          },
          complete: ()  => {

            if( this.data.codigocliente != null || this.data.codigocliente != undefined ) {
              this.listaEsquipoGhost.filter( (element:any) => {
                // if( element.idCliente !== null || element.idCliente !== undefined ) {
                  if( element.idCliente == this.data.codigocliente ) {
                    if (this.data.equiposExistentes == null || this.data.equiposExistentes.length == 0 ) {
                      this.listaEsquipo.push(element);
                    }
                    else if ( this.data.equiposExistentes.length > 0 ) {
                      this.listaEsquipo = []
                      this.result.filter( (j:any) => {
                        if( j.nserie !== element.machine_Sn ) {
                          //console.log(j.nserie);
                          //console.log(element);
                          this.listaEsquipo.push(element);
                        }
                      });


                      // this.listaEsquipoGhost.filter( (j:any) => {
                      //   //console.log(j)
                      // })

                      // this.listaEsquipo = this.listaEsquipoGhost.filter( (x:any) => {
                      //   return !this.result.some( (j:any) => j.nserie === x.machine_Sn && x.idCliente == 34 );
                      // });
                    }
                  } 

                  // else {
                  //   //console.log('2')
                  //   if( element.idCliente == this.data.codigocliente ) {
                  //     this.listaEsquipo = this.listaEsquipoGhost.filter( (x:any) => {
                  //       return !this.result.some( (element:any) => element.nserie === x.machine_Sn );
                  //     });
                  //   }
                  // }
                  // else {
                  //   alert('53')
                  //   if (this.data.equiposExistentes == null || this.data.equiposExistentes.length == 0 ) {
                  //     // alert('63')
                  //     this.listaEsquipo = this.listaEsquipoGhost;
                  //   } else {
                  //     alert('73')
                  //     this.listaEsquipo = this.listaEsquipoGhost.filter( (x:any) => {
                  //       return !this.result.some((element:any) => element.nserie === x.machine_Sn);
                  //     });
                  //   }
                  // }
                // }
              })
            }
  
            else {
              // alert('Sin cliente 1')
              if (this.data.equiposExistentes == null || this.data.equiposExistentes.length == 0 ) {
                // alert('Sin cliente 2')
                this.listaEsquipo = this.listaEsquipoGhost;
              } else {
                // alert('Sin cliente 3')
                this.listaEsquipo = this.listaEsquipoGhost.filter( (x:any) => {
                  return !this.result.some((element:any) => element.nserie === x.machine_Sn);
                });
              }
            }

            this.listaEsquipo.filter( ( element:any ) => {
              if( element.conteo_A == null ) {
                element.conteo_A = 0;
              }
              else if ( element.conteo_M == null ) {
                element.conteo_M = 0;
              }
              else if ( element.conteo_R == null ) {
                element.conteo_R = 0;
              }

              element.totalTransac = element.conteo_A + element.conteo_M;

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
    // switch( this.data.acreditado ) {
    //   case 1:
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
        // }
      //   break;
      // case 2:
      //   break;
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
