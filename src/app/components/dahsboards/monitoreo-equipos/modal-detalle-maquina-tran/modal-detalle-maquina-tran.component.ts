import { Component, Inject, OnInit } from '@angular/core';
import { MonitoreoEquiposComponent } from '../monitoreo-equipos.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Environments } from 'src/app/components/environments/environments';
import { TransaccionesTiendaService } from '../modal/services/transacciones-tienda.service';
import { ServicesSharedService } from 'src/app/components/shared/services-shared/services-shared.service';
import { MonitoreoService } from '../services/monitoreo.service';

@Component({
  selector: 'app-modal-detalle-maquina-tran',
  templateUrl: './modal-detalle-maquina-tran.component.html',
  styleUrls: ['./modal-detalle-maquina-tran.component.scss']
})
export class ModalDetalleMaquinaTranComponent implements OnInit {

  ngOnInit(): void {
    this.obtenerDetalleEquipos(this.data.idEquipo)
  }

  constructor(public dialogRef: MatDialogRef<MonitoreoEquiposComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private env: Environments,
    private transacciones: TransaccionesTiendaService, private sharedservs: ServicesSharedService, private monitoreo: MonitoreoService) {}

    listaDetalleequipoManual: any = [];
    listaDetalleequipoTransa: any = [];

    totalBilletesCantidadM: number = 0;
    totalBilletesMontoM:    number = 0;
    totalMonedasCantidadM:  number = 0;
    totalMonedasMontoM:     number = 0;

    totalBilletesCantidadT: number = 0;
    totalBilletesMontoT:    number = 0;
    totalMonedasCantidadT:  number = 0;
    totalMonedasMontoT:     number = 0;

    primaryLista:any =[];
    
    obtenerDetalleEquipos( id:any ) {
      this.monitoreo.obtenerDetalleEquipos(id).subscribe({
        next:(x) => {
          this.primaryLista = x;
          this.primaryLista.filter((element:any)=>{

            if(element.tipo == 'Manual') {
              this.listaDetalleequipoManual.push(element);
            }
            else if ( element.tipo == 'Deposito' ) {
              this.listaDetalleequipoTransa.push(element);
            }
 
          })
          //////////// console.warn(this.listaDetalleequipoManual);
        }, error: (e) => {
          // console.error(e);
        }, complete: () => {
          // Inicializar las variables
          this.totalBilletesCantidadM = 0;
          this.totalBilletesMontoM = 0;
          this.totalMonedasCantidadM = 0;
          this.totalMonedasMontoM = 0;

          this.totalBilletesCantidadT = 0;
          this.totalBilletesMontoT = 0;
          this.totalMonedasCantidadT = 0;
          this.totalMonedasMontoT = 0;

          // Recorrer la lista y realizar las sumatorias
          this.listaDetalleequipoManual.forEach((detalle:any) => {

            if( detalle.tipo == 'Manual') {
              this.totalBilletesCantidadM += detalle.depositoCant100 + detalle.depositoCant50 + detalle.depositoCant20 +
                detalle.depositoCant10 + detalle.depositoCant5 + detalle.depositoCant2 + detalle.depositoCant1;
  
              this.totalBilletesMontoM += detalle.depositoMont100 + detalle.depositoMont50 + detalle.depositoMont20 +
                detalle.depositoMont10 + detalle.depositoMont5 + detalle.depositoMont2 + detalle.depositoMont1;
  
              this.totalMonedasCantidadM += detalle.depositoCantCoin100 + detalle.depositoCantCoin50 + detalle.depositoCantCoin25 +
                detalle.depositoCantCoin10 + detalle.depositoCantCoin5 + detalle.depositoCantCoin1;
  
              this.totalMonedasMontoM += detalle.depositoMontCoin100 + detalle.depositoMontCoin50 + detalle.depositoMontCoin25 +
                detalle.depositoMontCoin10 + detalle.depositoMontCoin5 + detalle.depositoMontCoin1;
            }

            

          });

          this.listaDetalleequipoTransa.forEach((detalle:any) => {
            if ( detalle.tipo == 'Deposito' ) {
              this.totalBilletesCantidadT += detalle.depositoCant100 + detalle.depositoCant50 + detalle.depositoCant20 +
                detalle.depositoCant10 + detalle.depositoCant5 + detalle.depositoCant2 + detalle.depositoCant1;
  
              this.totalBilletesMontoT += detalle.depositoMont100 + detalle.depositoMont50 + detalle.depositoMont20 +
                detalle.depositoMont10 + detalle.depositoMont5 + detalle.depositoMont2 + detalle.depositoMont1;
  
              this.totalMonedasCantidadT += detalle.depositoCantCoin100 + detalle.depositoCantCoin50 + detalle.depositoCantCoin25 +
                detalle.depositoCantCoin10 + detalle.depositoCantCoin5 + detalle.depositoCantCoin1;
  
              this.totalMonedasMontoT += detalle.depositoMontCoin100 + detalle.depositoMontCoin50 + detalle.depositoMontCoin25 +
                detalle.depositoMontCoin10 + detalle.depositoMontCoin5 + detalle.depositoMontCoin1;
            }
          })
        }
      })
    }


}
