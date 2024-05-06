import { Component, Inject, OnInit } from '@angular/core';
import { TiendaComponent } from '../tienda.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Environments } from 'src/app/components/environments/environments';
import { TransaccionesTiendaService } from '../../monitoreo-equipos/modal/services/transacciones-tienda.service';
import { ServicesSharedService } from 'src/app/components/shared/services-shared/services-shared.service';
import { ClientesService } from '../../cliente/services/clientes.service';
import { TiendaService } from '../services/tienda.service';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-modal-tienda-cuenta',
  templateUrl: './modal-tienda-cuenta.component.html',
  styleUrls: ['./modal-tienda-cuenta.component.scss']
})
export class ModalTiendaCuentaComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<TiendaComponent>,
               private tiendaservs: TiendaService,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private env: Environments,
               private clienteserv: ClientesService,
               private transacciones: TransaccionesTiendaService,
               private sharedservs: ServicesSharedService ) {}

  nombreCliente: string = '';
  delete:any = this.env.apiUrlIcon()+'delete.png';
  edit:any = this.env.apiUrlIcon()+'edit.png';
  crear:any = this.env.apiUrlIcon()+'accept.png';
  cancel:any = this.env.apiUrlIcon()+'cancel.png';
  add:any = this.env.apiUrlIcon()+'add.png';
  ngOnInit(): void {
    this.nombreCliente = this.data.nombreCliente;
    this.obtenerCuentaBancariaCliente();
  }

  cuentaslista: any = [];
  cuentasGhost: any = [];
  obtenerCuentaBancariaCliente() {
    this.cuentaslista = [];
    let id: any = this.data.idCLiente;
    ////////console.warn(id);
    this.clienteserv.obtenerCuentaCliente(id).subscribe({
      next: ( cuentas:any ) => {
        // //alertthis.data.type);
        switch(this.data.type) {
          case 1:
            this.cuentaslista = cuentas.filter((cuenta:any) => {
              return !this.data.res.some((resItem:any) => resItem.idcuentabancaria === cuenta.id);
            });
            break;
          case 0:
            this.cuentaslista = cuentas.filter((cuenta:any) => {
              return !this.data.res.some((resItem:any) => resItem.id === cuenta.id);
            });
            break;
        }
        this.cuentasGhost = cuentas;
      }, error:(e) => {
         console.error(e); 
        },
         complete: () => { }
    })
  }

  filterTransacc:any;
  filterTransaccos() {
    this.cuentaslista = this.cuentasGhost.filter((item:any) => 
      item.nombanco.toLowerCase().includes(this.filterTransacc.toLowerCase())   ||
      item.numerocuenta.toString().toLowerCase().includes(this.filterTransacc.toLowerCase())
    )
  }

  selectAll = false;
  selectAllAccounts() {
    
    this.cuentaslista.forEach((cuenta:any) => {
      cuenta.selected = this.selectAll;
    });

    // //////console.log(this.selectAll);

  }

  guardarCuentasTiendas(arr:any[]) {
    if( this.data.type == 1 ) {
      this.tiendaservs.guardarCuentAsigna(arr).subscribe({
        next:(x) =>
        {
          //////console.log('cuenta guardada');
        },
        error: (e) => {
          console.error(e);
        }, 
        complete: () => {
          // this.limpiar();
        }
      });
    }
  }



  closeDialog( type:number ) {

    switch(type) {
      case 1:
        this.dialogRef.close(null);
        break;
      case 2:
        if(!this.selectAll) {
          this.selectedAccounts.filter( (element:any) => {
          
            let arr:any = {
              idtienda:         this.data.codigoTiendaEdicion,
              idcuentabancaria: element.id,
              fcrea:            new Date()
            }
            this.guardarCuentasBancarias(arr);
          })
          
          this.dialogRef.close(this.selectedAccounts);
    
        } 
        else if (this.selectAll){
          this.cuentaslista.filter( (element:any) => {
            
            let arr:any = {
              idtienda:         this.data.codigoTiendaEdicion,
              idcuentabancaria: element.id,
              fcrea:            new Date()
            }        
            
            this.guardarCuentasBancarias(arr);
    
          })
          
          this.dialogRef.close(this.cuentaslista);
        }
        break;
    }
    

  }

  selectedAccounts:any = [];
  accountSelected(cuenta:any) {
    this.selectAll = false;
    this.selectedAccounts = this.cuentaslista.filter((c:any) => c.selected);
    // //////console.log('Cuentas seleccionadas:', this.selectedAccounts);
  }

  guardarCuentasBancarias(arr:any[]) {

    //console.warn(this.data.type);

    if( this.data.type == 1 ) {
    this.tiendaservs.guardarCuentAsigna(arr).subscribe({
    next:(x) =>
    { 
      //console.log('cuenta guardada');
    },
    error: (e) => {
      console.error(e);
    }, 
    complete: () => {
      // this.limpiar();
    }
  });
}
  }

}
