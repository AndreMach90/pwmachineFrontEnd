import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';
import { TransaccionesTiendaService } from '../../monitoreo-equipos/modal/services/transacciones-tienda.service';
import { ServicesSharedService } from 'src/app/components/shared/services-shared/services-shared.service';
import * as ExcelJS from 'exceljs';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfigExcelComponent } from './modal-config-excel/modal-config-excel.component';
import { Router } from '@angular/router';
import { MonitoreoService } from '../../monitoreo-equipos/services/monitoreo.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filtrotransaccional',
  templateUrl: './filtrotransaccional.component.html',
  styleUrls: ['./filtrotransaccional.component.scss']
})

export class FiltrotransaccionalComponent implements OnInit, OnChanges {
  @Output() listaTransaccionesEmitGrafica:  EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() listaTransaccionesEmitTabla:    EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() typeFilter:                     EventEmitter<any> = new EventEmitter<any>();
  @Output() modBusqueda:                    EventEmitter<any> = new EventEmitter<any>();
  @Input() listenNserie!:                   any;

  diasEncontrar:            number  = 31;
  sumatoriaTotales:         number = 0;
  manual_Deposito_Coin_100: number = 0;
  manual_Deposito_Coin_50:  number = 0;
  manual_Deposito_Coin_20:  number = 0;
  manual_Deposito_Coin_10:  number = 0;
  manual_Deposito_Coin_5:   number = 0;
  manual_Deposito_Coin_1:   number = 0;
  deposito_Bill_100:        number = 0;
  deposito_Bill_50:         number = 0;
  deposito_Bill_20:         number = 0;
  deposito_Bill_10:         number = 0;
  deposito_Bill_5:          number = 0;
  deposito_Bill_2:          number = 0;
  deposito_Bill_1:          number = 0;
  sumatoriaNoRecollect:     number = 0;

  delete:                   any = this.env.apiUrlIcon() + 'delete.png';
  edit:                     any = this.env.apiUrlIcon() + 'edit.png';
  crear:                    any = this.env.apiUrlIcon() + 'accept.png';
  cancel:                   any = this.env.apiUrlIcon() + 'cancel.png';
  search:                   any = this.env.apiUrlIcon() + 'search.png';
  calendar:                 any = this.env.apiUrlIcon() + 'calendar.png';
  excel:                    any = this.env.apiUrlIcon() + 'excel.png';
  configblack:              any = this.env.apiUrlIcon() + 'configblack.png';

  arrlistatran:                 any = [];
  listaTrsansaccionesTabla:     any = [];
  listaTrsansaccionesTablaGhost:any = [];
  listaTransacciones:           any = [];
  listaTransaccionesGhost:      any = [];

  calendar_show:      boolean = false;
  _show_spinner:      boolean = false;
  _cancel_button:     boolean = false;
  _edit_btn:          boolean = false;
  _delete_show:       boolean = true;
  _edit_show:         boolean = true;
  _create_show:       boolean = true;
  _form_create:       boolean = true;
  dis_execel_export:  boolean = true;
  disButton:          boolean = true;
  
  _action_butto:      string = 'Crear';
  _icon_button:       string = 'add';
  dias_estimados:     string = '';
  nombreTienda:       string = '';

  selectedTime:       any;
  primary:            any;
  secondary:          any;
  secondary_a:        any;
  secondary_b:        any;
  tienda:             any;
  cliente:            any;
  filterTransacc:     any;

  public filterTransaccForm = new FormGroup({
    filterTransacc: new FormControl('')
  })

  public filterDateForm = new FormGroup({
    startDate: new FormControl(),
    endDate:   new FormControl()
  })

  constructor( private env: Environments, 
               private monitoreoServs: MonitoreoService,
               public dialog: MatDialog,
               private transacciones: TransaccionesTiendaService,
               private router: Router ) {}

  ngOnInit(): void {
    if ( this.listaTransacciones.length == 0 ) this.dis_execel_export = true;
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes) {
      this.obtenerTransac(this.listenNserie);
      this.obtenerTransacTabla(this.listenNserie);
      this.dis_execel_export = false;
    }
  }

  /** Obtiene la data de las Transacciones para la Gráfica transaccional */
  obtenerTransac(id: any) {
    this.transacciones.obtenerTransaccionesTienda(id, 2).subscribe({
      next: (tran:any) => {
        this.listaTransacciones      = tran;
        this.listaTransacciones = this.listaTransacciones.map((element: any) => {
          if (element.tipoCuenta === null) {
            element.tipoCuenta = "";
          }
          if (element.nombanco === null) {
            element.nombanco = "";
          }
          return element;
        });
        this.listaTransaccionesGhost = this.listaTransacciones;
      },
      error: (e) => { // console.error(e); },
      complete: () => {
        this.listaTransaccionesEmitGrafica.emit(this.listaTransacciones.reverse());
        this.sumatoriaTotal();
        if(this.listaTransacciones.length !== 0){
          if( this.listaTransacciones[0].nombreCliente == undefined || this.listaTransacciones[0].nombreCliente == null ) this.listaTransacciones[0].nombreCliente = '';
          if( this.listaTransacciones[0].nombreTienda == undefined  || this.listaTransacciones[0].nombreTienda == null )  this.listaTransacciones[0].nombreTienda  = '';
          this.cliente = this.listaTransacciones[0].nombreCliente;
          this.tienda  = this.listaTransacciones[0].nombreTienda;
        }
      }
    });
  }

  /** Obtiene la data de las Transacciones para la Tabla transaccional */
  obtenerTransacTabla(id:any) {
    this.listaTrsansaccionesTablaGhost= [];
    this.listaTrsansaccionesTabla = [];
    this.transacciones.obtenerTransaccionesTienda(id, 2).subscribe({
        next: (transactab:any) => {
          this.listaTrsansaccionesTablaGhost = transactab;
        },
        error: (e) => { // console.error(e); },
        complete: () => {
          this.sumatoriaNoRecollect = 0;
          this.listaTrsansaccionesTablaGhost.filter((element:any) => {
            let xdate = element.fechaTransaccion.toString().split('T');
            element.hora = xdate[1].slice(0,8);
            if( element.fechaRecoleccion == null && element.tipoTransaccion !== 'Recolección' ) {
              this.sumatoriaNoRecollect += element.total;
            }
            if( element.acreditada == 'A' ) element.colorRow = '#D8F1EC';
            if( element.acreditada == 'E' ) element.colorRow = '#F1F090';
            if( element.acreditada == 'N' ) element.colorRow = '#F1E3D8';
            if( element.acreditada == 'R' ) element.colorRow = '#F1C590';
            this.listaTrsansaccionesTabla.push(element);
          })
          this.monitoreoServs.obtenerValorUnico(id).subscribe( (x:any) => {
            if ( x[0].total == null || x[0].total == undefined ) localStorage.setItem('valor_validador', (0).toString());
              localStorage.setItem('valor_validador', x[0].total.toFixed(2).toString());
            }
          );
          this.listaTransaccionesEmitTabla.emit(this.listaTrsansaccionesTabla);
          this.sumatoriaTotal();
        }
      }
    );
  }

  /** Navega hacia la nueva vista */
  navigateDatexport() {
    this.router.navigate(['datexport']);
  }
  
  /** Filtro de transacciones tanto para la gráfica como para la tabla de transacciones */
  filterTransaccos() {
    let filtertTrans: any = this.filterTransaccForm.controls['filterTransacc'].value;
    this.listaTransacciones = this.listaTransaccionesGhost.filter( (item:any) => 
      item.machine_Sn             .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.nombreCliente          .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.tipoTransaccion        .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.usuarios_idFk          .toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.tipoCuenta             .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.nombanco               .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.establecimiento        .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.codigoEstablecimiento  .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.transaccion_No         .toString().toLowerCase().includes(filtertTrans.toLowerCase())
    )
    this.listaTrsansaccionesTabla = this.listaTransaccionesGhost.filter((item:any) => 
      item.machine_Sn           .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.nombreCliente        .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.tipoTransaccion      .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.usuarios_idFk        .toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.tipoCuenta           .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.nombanco             .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.establecimiento      .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.codigoEstablecimiento.toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.transaccion_No       .toString().toLowerCase().includes(filtertTrans.toLowerCase())      
    )
    this.listaTransaccionesEmitGrafica.emit(this.listaTransacciones);
    this.listaTransaccionesEmitTabla.emit(this.listaTrsansaccionesTabla);
    this.sumatoriaTotal();
  }

  validarRangoDeFechas() {
    let startDate: any = this.filterDateForm.controls['startDate'].value;
    let endDate: any = this.filterDateForm.controls['endDate'].value;
    const fechaInicio = new Date(startDate);
    const fechaFin = new Date(endDate);
    if (fechaFin < fechaInicio) {
      this.dias_estimados = 'La fecha final no puede ser menor a la fecha inicial';
      this.disButton = true;
      setInterval(()=>this.dias_estimados='', 2000);
    } else {
      const diferenciaEnDias = Math.abs( (fechaFin.getTime() - fechaInicio.getTime() ) / (1000 * 60 * 60 * 24));
      if ( diferenciaEnDias > this.diasEncontrar ) {
        this.dias_estimados = 'El rango de fechas no puede ser mayor a un mes';
        this.disButton = true;
      } else {
        this.dias_estimados = `Diferencia: ${diferenciaEnDias} días`;
        this.disButton = false;
      }
    }
  }

  goRangeDates(calendarShow:boolean) {
    this.typeFilter.emit(calendarShow);
    if( calendarShow ) {
      this.listaTransaccionesEmitGrafica.emit(this.listaTransacciones);
      this.listaTransaccionesEmitTabla.emit(this.listaTrsansaccionesTabla);
    }
  }

  filterByDateRange() {
    this._show_spinner = true;
    const fechaFin = new Date(this.filterDateForm.controls['endDate'].value);
    fechaFin.setDate(fechaFin.getDate() + 1);
    let modelRange:any = {
      "tipo":        "1",
      "Machine_Sn":  this.listenNserie,
      "FechaInicio": this.filterDateForm.controls['startDate'].value,
      "FechaFin":    fechaFin
    }
    this.transacciones.filtroTransaccionesRango(modelRange).subscribe({
      next: (x) => {
        this.listaTransacciones = x;
        this.listaTrsansaccionesTabla = x;
        this.listaTransaccionesGhost = x;
        this.listaTransaccionesEmitGrafica.emit(this.listaTransacciones.reverse());
        this.listaTransaccionesEmitTabla.emit(this.listaTrsansaccionesTabla);
        this.modBusqueda.emit( true );
      }, error: (e) => { // console.error(e); }
      , complete: () => { this._show_spinner = false; }
    })
    this.sumatoriaTotal();
  }

  openDialogConfiguracionExcel(data:any): void {
    const dialogRef = this.dialog.open( ModalConfigExcelComponent, {
        height: 'auto',
        width:  '90%',
        data:   this.listaTrsansaccionesTabla, 
      }
    );
    dialogRef.afterClosed().subscribe( result => { });
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transacciones');
    const table: any = document.querySelector('.table');
    const headers: any = [];
    const data:    any = [];
    const rows = table.querySelectorAll('tbody > tr');

    table.querySelectorAll('thead th').forEach((header: any) => {
      headers.push(header.textContent.trim());
    });
  
    rows.forEach((row: any) => {
      const rowData: any = [];
      row.querySelectorAll('td').forEach((cell: any) => {
        rowData.push(cell.textContent.trim());
      });
      data.push(rowData);
    });
      
    const numericColumnsIni = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
    const numericColumns    = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,26];
    const titleRow = worksheet.addRow(['Transacciones del equipo: ' + this.listenNserie + ' - ' + new Date().toLocaleDateString()]);
    titleRow.getCell(1).font = { bold: true, size: 17, color: { argb: "8F8F8F" } };
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2929AB' },
      };
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.border = {
        top:    { style: 'thin',  color: { argb: '000000' } },
        bottom: { style: 'thick', color: { argb: '8989E9' } },
        left:   { style: 'thin',  color: { argb: '000000' } },
        right:  { style: 'thin',  color: { argb: '000000' } },
      };
    });
  
    data.forEach((rowData: any) => {
      const row: any = [];
      rowData.forEach((cell: any, columnIndex: number) => {
        if (numericColumns.includes(columnIndex)) {
          let x = cell.toString();
          let y = x.replace(',', '');
          let j = Number(y);
          if( columnIndex == 26 ) {
            j.toFixed(2);
          }  
          row.push(Number(j));
        } else {
          row.push(cell);
        }
      });
      worksheet.addRow(row);
    });
  
    worksheet.columns.forEach( (column:any) => {
      if( column.number === 1 ) column.width = 15
      else if (column.number == 3) column.width = 22
      else if (column.number == 4) column.width = 22
      else if (column.number == 7) column.width = 13
      else if (column.number == 8) column.width = 15
      else if (column.number == 12) column.width = 20
      else if (column.number == 13) column.width = 20
    })

    // Formatea las celdas que contienen números
    worksheet.columns.forEach((column: any) => {
      if (numericColumns.includes(column.number - 1)) {
        column.eachCell((cell: any) => {
          cell.numFmt = '#,##0';
        });
        if (column.number === 27) {
          column.width = 20;
          column.eachCell((cell: any) => {
            ////// console.log('Encontrado indice 27');
            cell.numFmt = '#,##0.00';
          });
        }
      }
    });
  
    // Genera el archivo Excel y descárgalo
    workbook.xlsx.writeBuffer().then((buffer) => {
      let dateData = new Date();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.listenNserie + '_' + 'Transacciones' + '_' + dateData.getDate() + '-' + (dateData.getMonth() + 1) + '-' + dateData.getFullYear() + 'T' + dateData.getHours() + 'H' + dateData.getMinutes() + 'm' + '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  
  sumatoriaTotal() {   
    this.sumatoriaTotales         = 0;
    this.manual_Deposito_Coin_100 = 0;
    this.manual_Deposito_Coin_50  = 0;
    this.manual_Deposito_Coin_20  = 0;
    this.manual_Deposito_Coin_10  = 0;
    this.manual_Deposito_Coin_5   = 0;
    this.manual_Deposito_Coin_1   = 0;
    this.deposito_Bill_100        = 0;
    this.deposito_Bill_50         = 0;
    this.deposito_Bill_20         = 0;
    this.deposito_Bill_10         = 0;
    this.deposito_Bill_5          = 0;
    this.deposito_Bill_2          = 0;
    this.deposito_Bill_1          = 0;

    this.listaTransacciones.filter( (element:any) => { 
      this.sumatoriaTotales          += element.total; 
      this.manual_Deposito_Coin_100  += element.manual_Deposito_Coin_100; 
      this.manual_Deposito_Coin_50   += element.manual_Deposito_Coin_50; 
      this.manual_Deposito_Coin_20   += element.manual_Deposito_Coin_25; 
      this.manual_Deposito_Coin_10   += element.manual_Deposito_Coin_10; 
      this.manual_Deposito_Coin_5    += element.manual_Deposito_Coin_5; 
      this.manual_Deposito_Coin_1    += element.manual_Deposito_Coin_1; 
      this.deposito_Bill_100         += element.deposito_Bill_100; 
      this.deposito_Bill_50          += element.deposito_Bill_50; 
      this.deposito_Bill_20          += element.deposito_Bill_20; 
      this.deposito_Bill_10          += element.deposito_Bill_10; 
      this.deposito_Bill_5           += element.deposito_Bill_5; 
      this.deposito_Bill_2           += element.deposito_Bill_2; 
      this.deposito_Bill_1           += element.deposito_Bill_1; 
    })
  }
}