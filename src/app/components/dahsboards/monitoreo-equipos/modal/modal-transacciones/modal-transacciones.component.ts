import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MonitoreoEquiposComponent } from '../../monitoreo-equipos.component';
import { Environments } from 'src/app/components/environments/environments';
import { TransaccionesTiendaService } from '../services/transacciones-tienda.service';
import { ServicesSharedService } from 'src/app/components/shared/services-shared/services-shared.service';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { argv } from 'process';
import { setInterval } from 'timers/promises';



@Component({
  selector: 'app-modal-transacciones',
  templateUrl: './modal-transacciones.component.html',
  styleUrls: ['./modal-transacciones.component.scss']
})
export class ModalTransaccionesComponent implements OnInit {


  startDate: Date = new Date()
  endDate: Date = new Date();

  delete: any = this.env.apiUrlIcon()+'delete.png';
  edit:   any = this.env.apiUrlIcon()+'edit.png';
  crear:  any = this.env.apiUrlIcon()+'accept.png';
  cancel: any = this.env.apiUrlIcon()+'cancel.png';
  search: any = this.env.apiUrlIcon()+'search.png';
  calendar: any = this.env.apiUrlIcon()+'calendar.png';
  excel:  any = this.env.apiUrlIcon()+'excel.png';

  _edit_btn:                    boolean = false;
  _delete_show:                 boolean = true;
  _edit_show:                   boolean = true;
  _create_show:                 boolean = true;
  _form_create:                 boolean = true;
  calendar_show: boolean = false;
  _action_butto = 'Crear';
  _show_spinner: boolean = false;
  _icon_button: string = 'add';
  _cancel_button: boolean = false;

  primary:any;
  secondary:any;
  secondary_a:any;
  secondary_b:any;

  home:any;

  constructor(public dialogRef: MatDialogRef<MonitoreoEquiposComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private env: Environments,
    private transacciones: TransaccionesTiendaService, private sharedservs: ServicesSharedService) {}

    nombreTienda: string = '';
  ngOnInit(): void {
    this.startDate = new Date();
    this.endDate = new Date();
    // this.home = library.add(icon('shopware'));

    //////console.warn ('MODAL');
    //////console.warn (this.data);

    //////console.warn ( this.excel )

    this.primary        =  this.env.appTheme.colorPrimary;
    this.secondary      = this.env.appTheme.colorSecondary_C;
    this.secondary_a    = this.env.appTheme.colorSecondary_A;
    this.secondary_b    = this.env.appTheme.colorSecondary_B;
    this.nombreTienda   = this.data.nombreTienda;
    this.obtenerTransac(this.data.id)

  }

  listaTransacciones: any = [];
  listaTransaccionesGhost: any = [];
  obtenerTransac(id:number) {
    this.transacciones.obtenerTransaccionesTienda(id, 1).subscribe({
      next:( tran ) => {
        this.listaTransacciones = tran;
        this.listaTransaccionesGhost = tran;
        //////console.warn(this.listaTransaccionesGhost);
      }, error: (e) => {
        console.error(e);
      }, complete: () => {
        this.sumatoriaTotal();
      }
    })

  }

  filterTransacc:any;
  filterTransaccos() {
    this.listaTransacciones = this.listaTransaccionesGhost.filter((item:any) => 
      item.machine_Sn.toLowerCase().includes(this.filterTransacc.toLowerCase())   ||
      item.nombreCliente.toLowerCase().includes(this.filterTransacc.toLowerCase())    ||
      item.tipoTransaccion.toLowerCase().includes(this.filterTransacc.toLowerCase()) ||
      item.usuarios_idFk.toLowerCase().includes(this.filterTransacc.toLowerCase()) ||
      item.machine_Sn.toLowerCase().includes(this.filterTransacc.toLowerCase()) ||
      item.transaccion_No.toString().toLowerCase().includes(this.filterTransacc.toLowerCase())      
    )

    this.sumatoriaTotal();

  }

  filterByDateRange() {
    if (this.startDate && this.endDate) {
      if (this.startDate.toDateString() === this.endDate.toDateString()) {
        // Estás buscando una fecha específica
        this.listaTransacciones = this.listaTransacciones.filter((item: any) => {
          const transacDate = new Date(item.fechaTransaccion);
          return (
            transacDate.getDate() === this.startDate.getDate() &&
            transacDate.getMonth() === this.startDate.getMonth() &&
            transacDate.getFullYear() === this.startDate.getFullYear()
          );
        });
      } else {
        // Estás buscando un rango de fechas
        this.listaTransacciones = this.listaTransacciones.filter((item: any) => {
          const transacDate = new Date(item.fechaTransaccion);
          return transacDate >= this.startDate && transacDate <= this.endDate;
        });
      }
    } else {
      // Handle the case where either startDate or endDate is not selected
      // Puedes mostrar un mensaje de error o volver a cargar todas las transacciones
    }
  
    this.sumatoriaTotal();
  }
  
  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transacciones');
    
    // Obtén la tabla HTML y las cabeceras
    const table: any = document.querySelector('.table');
    const headers: any = [];
    table.querySelectorAll('thead th').forEach((header: any) => {
      headers.push(header.textContent.trim());
    });
    
    // Obtén los datos de la tabla
    const data:any = [];
    const rows = table.querySelectorAll('tbody > tr');
    rows.forEach((row: any) => {
      const rowData: any = [];
      row.querySelectorAll('td').forEach((cell: any) => {

        rowData.push(cell.textContent.trim());
        
      });
      data.push(rowData);
    });
    // Agrega el título encima de la cabecera
    const titleRow = worksheet.addRow(['Transacciones del día: ' + new Date().toLocaleDateString()]);
    titleRow.getCell(1).font = { bold: true, size: 17, color: { argb: "8F8F8F" } };
    
    // Aplica un estilo a la fila de cabecera (por ejemplo, color de fondo azul)
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2929AB' },
      };
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } }, 
        bottom: { style: 'thick', color: { argb: '8989E9' } }, 
        left: { style: 'thin', color: { argb: '000000' } }, 
        right: { style: 'thin', color: { argb: '000000' } },
      };
    });
  
    // titleRow.forEach((cell) => {
      
    // });
  
    // Agrega los datos a la hoja de cálculo
    data.forEach((rowData:any) => {
      worksheet.addRow(rowData);
    });
    
    // Genera el archivo Excel y descárgalo
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Transacciones.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  


  sumatoriaTotales: number = 0;
  manual_Deposito_Coin_100: number = 0;
  manual_Deposito_Coin_50: number = 0;
  manual_Deposito_Coin_20: number = 0;
  manual_Deposito_Coin_10: number = 0;
  manual_Deposito_Coin_5: number = 0;
  manual_Deposito_Coin_1: number = 0;
  deposito_Bill_100: number = 0;
  deposito_Bill_50: number = 0;
  deposito_Bill_20: number = 0;
  deposito_Bill_10: number = 0;
  deposito_Bill_5: number = 0;
  deposito_Bill_2: number = 0;
  deposito_Bill_1: number = 0;
  sumatoriaTotal() {   
    this.sumatoriaTotales = 0;
    this.manual_Deposito_Coin_100 = 0;
    this.manual_Deposito_Coin_50 = 0;
    this.manual_Deposito_Coin_20 = 0;
    this.manual_Deposito_Coin_10 = 0;
    this.manual_Deposito_Coin_5 = 0;
    this.manual_Deposito_Coin_1 = 0;
    this.deposito_Bill_100 = 0;
    this.deposito_Bill_50 = 0;
    this.deposito_Bill_20 = 0;
    this.deposito_Bill_10 = 0;
    this.deposito_Bill_5 = 0;
    this.deposito_Bill_2 = 0;
    this.deposito_Bill_1 = 0;

    this.listaTransacciones.filter( (element:any) => {     


      //////console.warn(element.manual_Deposito_Coin_10);
      // if(element.manual_Deposito_Coin_10 == null) element.manual_Deposito_Coin_10 = 0;
 
        this.sumatoriaTotales += element.total; 
        this.manual_Deposito_Coin_100 += element.manual_Deposito_Coin_100; 
        this.manual_Deposito_Coin_50 += element.manual_Deposito_Coin_50; 
        this.manual_Deposito_Coin_20 += element.manual_Deposito_Coin_25; 
        this.manual_Deposito_Coin_10 += element.manual_Deposito_Coin_10; 
        this.manual_Deposito_Coin_5 += element.manual_Deposito_Coin_5; 
        this.manual_Deposito_Coin_1 += element.manual_Deposito_Coin_1; 
        this.deposito_Bill_100 += element.deposito_Bill_100; 
        this.deposito_Bill_50 += element.deposito_Bill_50; 
        this.deposito_Bill_20 += element.deposito_Bill_20; 
        this.deposito_Bill_10 += element.deposito_Bill_10; 
        this.deposito_Bill_5 += element.deposito_Bill_5; 
        this.deposito_Bill_2 += element.deposito_Bill_2; 
        this.deposito_Bill_1 += element.deposito_Bill_1; 
    })

  }
  

  
}
