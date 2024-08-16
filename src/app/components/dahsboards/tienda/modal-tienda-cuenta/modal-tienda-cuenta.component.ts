import { Component, Inject, OnInit } from '@angular/core';
import { TiendaComponent } from '../tienda.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Environments } from 'src/app/components/environments/environments';
import { ClientesService } from '../../cliente/services/clientes.service';
import { TiendaService } from '../services/tienda.service';

@Component({
  selector: 'app-modal-tienda-cuenta',
  templateUrl: './modal-tienda-cuenta.component.html',
  styleUrls: ['./modal-tienda-cuenta.component.scss'],
})

export class ModalTiendaCuentaComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TiendaComponent>,
    private tiendaservs: TiendaService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private env: Environments,
    private clienteserv: ClientesService,
  ) {}

  cuentaslista: any = [];
  cuentasGhost: any = [];
  selectedAccounts: any = [];
  filterTransacc: any;
  nombreCliente: string = '';
  selectAll = false;
  delete: any = this.env.apiUrlIcon() + 'delete.png';
  edit: any = this.env.apiUrlIcon() + 'edit.png';
  crear: any = this.env.apiUrlIcon() + 'accept.png';
  cancel: any = this.env.apiUrlIcon() + 'cancel.png';
  add: any = this.env.apiUrlIcon() + 'add.png';

  ngOnInit(): void {
    this.nombreCliente = this.data.nombreCliente;
    this.obtenerCuentaBancariaCliente();
    console.log(this.data);
  }

  obtenerCuentaBancariaCliente() {
    this.cuentaslista = [];
    let id: any = this.data.idCLiente;
    this.clienteserv.obtenerCuentaCliente(id).subscribe({
      next: (cuentas: any) => {
        this.cuentaslista = cuentas.filter((cuenta: any) => {
          return !this.data.res.some(
            (resItem: any) => resItem.idcuentabancaria === cuenta.id
          );
        });
        this.cuentasGhost = cuentas;
      },
      error: (e) => console.error(e),
    });
  }

  filterTransaccos() {
    this.cuentaslista = this.cuentasGhost.filter(
      (item: any) => item.nombanco.toLowerCase().includes(this.filterTransacc.toLowerCase()) ||
        item.numerocuenta.toString().toLowerCase().includes(this.filterTransacc.toLowerCase())
    );
  }

  selectAllAccounts() {
    this.cuentaslista.forEach((cuenta: any) => {
      cuenta.selected = this.selectAll;
    });
  }

  closeDialog(type: number) {
    switch (type) {
      case 1:
        this.dialogRef.close(null);
        break;
      case 2:
        if (!this.selectAll) {
          this.selectedAccounts.filter((element: any) => {
            let arr: any = {
              idtienda: this.data.codigoTiendaEdicion,
              idcuentabancaria: element.id,
              fcrea: new Date(),
            };
            this.guardarCuentasBancarias(arr);
          });
          this.dialogRef.close(this.selectedAccounts);
        } else if (this.selectAll) {
          this.cuentaslista.filter((element: any) => {
            let arr: any = {
              idtienda: this.data.codigoTiendaEdicion,
              idcuentabancaria: element.id,
              fcrea: new Date(),
            };
            this.guardarCuentasBancarias(arr);
          });
          this.dialogRef.close(this.cuentaslista);
        }
        break;
    }
  }

  accountSelected(cuenta: any) {
    this.selectAll = false;
    this.selectedAccounts = this.cuentaslista.filter((c: any) => c.selected);
  }

  guardarCuentasBancarias(arr: any[]) {
    this.tiendaservs.guardarCuentAsigna(arr).subscribe({
      next: (x) => console.log('Cuenta guardada'),
      error: (e) => console.error(e)
    });
  }
}
