import { Component, OnInit } from '@angular/core';
import { HistoriaAcreditacionService } from './services/historia-acreditacion.service';
import { Environments } from '../../environments/environments';
import * as ExcelJS from 'exceljs';
import Swal from 'sweetalert2'
import { TransaccionesTiendaService } from '../../dahsboards/monitoreo-equipos/modal/services/transacciones-tienda.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '../services/shared.service';

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
  selector: 'app-historial-acreditacion',
  templateUrl: './historial-acreditacion.component.html',
  styleUrls: ['./historial-acreditacion.component.scss']
})

export class HistorialAcreditacionComponent implements OnInit {

  listaAcreditadas:any = [];
  _show_spinner: boolean = false;
  fechaIni:any;
  fechaFin:any;
  delete:                  any  = this.env.apiUrlIcon() + 'delete.png';
  edit:                    any  = this.env.apiUrlIcon() + 'edit.png';
  crear:                   any  = this.env.apiUrlIcon() + 'accept.png';
  cancel:                  any  = this.env.apiUrlIcon() + 'cancel.png';
  search:                  any  = this.env.apiUrlIcon() + 'search.png';
  calendar:                any  = this.env.apiUrlIcon() + 'calendar.png';
  excel:                   any  = this.env.apiUrlIcon() + 'excel.png';
  configblack:             any  = this.env.apiUrlIcon() + 'configblack.png';
  menuicon:                any  = this.env.apiUrlIcon() + 'menu.png';
  descargar:               any  = this.env.apiUrlIcon() + 'descargar.png';

  dataExportarExcel: any     = [];
  _transaction_show: boolean = false;
  modelConsult: any      = [];
  listaAcreditadasOk:any = [];

  public exportdateform = new FormGroup(
    {
      dateini:              new FormControl(''),
      datefin:              new FormControl('')
    }
  )

  constructor( private hcred: HistoriaAcreditacionService,
    private tokenGen: SharedService,
    private env: Environments, private transacciones: TransaccionesTiendaService ) {}

  ngOnInit(): void {
    this.obtenerPreAcreditacion();
  }

  obtenerPreAcreditacion() {
    this.hcred.obtenerPreAcreditacion().subscribe((x:any)=>{
      this.listaAcreditadas = x;
      //console.warn(this.listaAcreditadas);
    })
  }

  obtenerEquiposAcreditados( data:any ) {
    this.fechaIni = data.fechaIni;
    this.fechaFin = data.fechaFin;
    this.hcred.obtenerEquiposAcreditados( data.nombreArchivo ).subscribe({
      next: (x) => {
        this.dataExportarExcel = x;
      }
    })
  }

  transaccionesModel:any = []
  obtenerTransacTabla(data:any) {
    this.hcred.obtenerEquiposAcreditados( data.nombreArchivo ).subscribe({
      next: (x) => {
        this.dataExportarExcel = x;
        //console.log('this.dataExportarExcel');
        //console.log( this.dataExportarExcel );
      }, complete: () => {
        this.obtenerTransaccionesEquipos(data.nombreArchivo);
      }
    })
  }

  // obtenerTransaccionesEquipos(nombreArchivo:any) {
    
  //   this.transacciones.obtenerTransaccionesTienda(nombreArchivo, 1).subscribe({
  //     next: (y:any) => {
  //       this.transaccionesModel = [];
  //       this.dataExportarExcel.filter( (element:any) => {
  //         // //console.log(element.machineSn);
  //         y.filter( (elementTra:any) => {
  //           let arr = {
  //             "F.Transacciones":       new Date(elementTra.fechaTransaccion),
  //             "fecha":                 elementTra.fecha,
  //             "Hora":                  elementTra.hora,
  //             "Nombre Cliente":        elementTra.nombreCliente,
  //             "Nombre Tienda":         elementTra.nombreTienda,
  //             "N. Transacción":        elementTra.machine_Sn + '-' + elementTra.transaccion_No,
  //             "N. Serie":              elementTra.machine_Sn,
  //             "Usuario":               elementTra.usuarios_idFk,
  //             "Establecimiento":       elementTra.establecimiento,
  //             "Cod. Establecimiento":  elementTra.codigoEstablecimiento,
  //             "Nombre del Banco":      elementTra.nombanco,
  //             "Tipo de cuenta":        elementTra.tipoCuenta,
  //             "N. Cuenta":             elementTra.numerocuenta,
  //             "$1.00":                 elementTra.deposito_Bill_1,
  //             "$2.00":                 elementTra.deposito_Bill_2,
  //             "$5.00":                 elementTra.deposito_Bill_5,
  //             "$10.00":                elementTra.deposito_Bill_10,
  //             "$20.00":                elementTra.deposito_Bill_20,
  //             "$50.00":                elementTra.deposito_Bill_50,
  //             "$100.00":               elementTra.deposito_Bill_100,
  //             "$0.01":                 elementTra.manual_Deposito_Coin_1,
  //             "T$0.01":                elementTra.manual_Deposito_Coin_1 * 0.01,
  //             "$0.05":                 elementTra.manual_Deposito_Coin_5,
  //             "T$0.05":                elementTra.manual_Deposito_Coin_5 * 0.05,
  //             "$0.10":                 elementTra.manual_Deposito_Coin_10,
  //             "T$0.10":                elementTra.manual_Deposito_Coin_10 * 0.10,
  //             "$0.25":                 elementTra.manual_Deposito_Coin_25,
  //             "T$0.25":                elementTra.manual_Deposito_Coin_25 * 0.25,
  //             "$0.50":                 elementTra.manual_Deposito_Coin_50,
  //             "T$0.50":                elementTra.manual_Deposito_Coin_50 * 0.50,
  //             "$0.100":                elementTra.manual_Deposito_Coin_100,
  //             "Total":                 elementTra.total,
  //             "totalRecoleccion":      elementTra.totalRecoleccion,
  //             "Tipo de transacción":   elementTra.tipoTransaccion,
  //             "fechaRecoleccion":      elementTra.fechaRecoleccion,
  //           }

  //           if ( element.machineSn == elementTra.machine_Sn ) {
  //             // this.transaccionesModel.push(arr);
  //             element.transacciones.push(arr);
  //           }  

  //         })
  //       })         
        
  //       //console.log('==========================');
  //       //console.log(this.dataExportarExcel);
  //       //console.log('==========================');

  //     }
  //   })
  // }

  obtenerTransaccionesEquipos(nombreArchivo: any) {
    this.transacciones.obtenerTransaccionesTienda(nombreArchivo, 1).subscribe({
      next: (y: any) => {
  
        this.dataExportarExcel.forEach((element: any) => {
          element.transacciones = []; // Reinicia el array de transacciones
  
          y.filter((elementTra: any) => {
            let arr = {
              "F.Transacciones":       new Date(elementTra.fechaTransaccion),
              "fecha":                 elementTra.fecha,
              "Hora":                  elementTra.hora,
              "Nombre Cliente":        elementTra.nombreCliente,
              "Nombre Tienda":         elementTra.nombreTienda,
              "N. Transacción":        elementTra.machine_Sn + '-' + elementTra.transaccion_No,
              "N. Serie":              elementTra.machine_Sn,
              "Usuario":               elementTra.usuarios_idFk,
              "Establecimiento":       elementTra.establecimiento,
              "Cod. Establecimiento":  elementTra.codigoEstablecimiento,
              "Nombre del Banco":      elementTra.nombanco,
              "Tipo de cuenta":        elementTra.tipoCuenta,
              "N. Cuenta":             elementTra.numerocuenta,
              "$1.00":                 elementTra.deposito_Bill_1,
              "$2.00":                 elementTra.deposito_Bill_2,
              "$5.00":                 elementTra.deposito_Bill_5,
              "$10.00":                elementTra.deposito_Bill_10,
              "$20.00":                elementTra.deposito_Bill_20,
              "$50.00":                elementTra.deposito_Bill_50,
              "$100.00":               elementTra.deposito_Bill_100,
              "$0.01":                 elementTra.manual_Deposito_Coin_1,
              "T$0.01":                elementTra.manual_Deposito_Coin_1 * 0.01,
              "$0.05":                 elementTra.manual_Deposito_Coin_5,
              "T$0.05":                elementTra.manual_Deposito_Coin_5 * 0.05,
              "$0.10":                 elementTra.manual_Deposito_Coin_10,
              "T$0.10":                elementTra.manual_Deposito_Coin_10 * 0.10,
              "$0.25":                 elementTra.manual_Deposito_Coin_25,
              "T$0.25":                elementTra.manual_Deposito_Coin_25 * 0.25,
              "$0.50":                 elementTra.manual_Deposito_Coin_50,
              "T$0.50":                elementTra.manual_Deposito_Coin_50 * 0.50,
              "$0.100":                elementTra.manual_Deposito_Coin_100,
              "Total":                 elementTra.total,
              "totalRecoleccion":      elementTra.totalRecoleccion,
              "Tipo de transacción":   elementTra.tipoTransaccion,
              "fechaRecoleccion":      elementTra.fechaRecoleccion,
            };
  
            if (element.machineSn == elementTra.machine_Sn) {
              element.transacciones.push(arr);
            }
          });
  
          // Ordena las transacciones por element.machineSn
          element.transacciones.sort((a: any, b: any) => {
            const snA = a['N. Serie'];
            const snB = b['N. Serie'];
  
            if (snA < snB) return -1;
            if (snA > snB) return 1;
            return 0;
          });
        });  
        // //console.log('==========================');
        // //console.log(this.dataExportarExcel);
        // //console.log('==========================');
      }, complete: () => {
        this.exportarExcel(nombreArchivo);
      }, error: (e) => {
        console.error(e);
      }
    });
  }

  actualizarEquiposAcreditados( data:any, i:any ) {
    Swal.fire({
      title: "¿Deseas acreditar estas transacciones?",
      text: "Esta acción es irreversible para estas transacciones.",
      icon: "question",
      showCancelButton:   true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor:  "#d33",
      confirmButtonText:  "Sí, acreditar",
      cancelButtonText:   "No a creditar todabía"
    }).then((result) => {
      if (result.isConfirmed) {
        this._show_spinner = true;
        this.hcred.actualizarEquiposAcreditados(data.nombreArchivo).subscribe({
          next: (x) => {
            Toast.fire({ icon: 'success', title: 'Las transacciones han cambiado de estado a acreditado.', position: 'center' });
          }, error: (e) => {
            Toast.fire({ icon: 'error', title: 'Algo ha ocurrido, y no se ha podido actualizar.' });
            this._show_spinner = false;
            console.error(e);
          }, complete: () => {
            this.listaAcreditadas.splice(i,1);
            this._show_spinner = false;
          }
        })
      }
    });
  }

  exportarExcel( nombreArchivo:any ): void {

    const workbook = new ExcelJS.Workbook();
    let res:number = 0;
    let clientes:string = '';
    let tiendas: string = '';
    let establecimiento:string = '';
    let codestablecimiento:string = '';
    let equipos: string = '';
    let usuario: string = '';
    let $1:    number = 0;
    let $2:    number = 0;
    let $5:    number = 0;
    let $10:   number = 0;
    let $20:   number = 0;
    let $50:   number = 0;
    let $100:  number = 0;
    let $001:  number = 0;
    let $005:  number = 0;
    let $010:  number = 0;
    let $025:  number = 0;
    let $050:  number = 0;
    let $0100: number = 0;

    const worksheet = workbook.addWorksheet('TodasTransacciones');
    this.dataExportarExcel.forEach( (equipo: any) => {
      // const nserie = equipo.nserie || 'NoNserie'; // Si equipo.nserie es undefined, usa 'NoNserie'
      // const worksheet = workbook.addWorksheet(`Transacciones_${nserie}`); 
      const headers = this.getHeaderRow();
      const numericColumns = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

    // Agrega encabezados de columna solo si es la primera iteración
    if ( this.dataExportarExcel.indexOf(equipo) === 0 ) {
      worksheet.addRow(['Transacciones - '  + new Date().toLocaleDateString()]);
      worksheet.addRow(headers);
    }
  
    // Agrega datos
    equipo.transacciones.forEach((transaccion: any, i: number) => {
    const row: any = [];
    const filteredHeaders = this.getHeaderRow();

    filteredHeaders.forEach((header: any, columnIndex: number) => {
        
        const cellValue = transaccion[header] || '';        
        if (numericColumns.includes(columnIndex)) {
            let x = cellValue.toString();
            let y = x.replace(',', '');
            let j = Number(y);
            row.push(Number(j));
        }

        else { row.push(cellValue); }

    });

    worksheet.addRow(row);

    let datenow =  new Date();
    let timenow =  new Date().getHours().toString()   + ':'
                 + new Date().getMinutes().toString() + ':'
                 + new Date().getSeconds().toString();

    if (i === equipo.transacciones.length - 1) {
        res   = 0;
        $1    = 0;
        $2    = 0;
        $5    = 0;
        $10   = 0;
        $20   = 0;
        $50   = 0;
        $100  = 0;
        $001  = 0;
        $005  = 0;
        $010  = 0;
        $025  = 0;
        $050  = 0;
        $0100 = 0;
        equipo.transacciones.filter( (x:any) => {
          res                += x.Total;
          clientes            = x["Nombre Cliente"];
          tiendas             = x["Nombre Tienda"];
          equipos             = x["N. Serie"];
          usuario             = x["Usuario"];
          establecimiento     = x["Establecimiento"];
          codestablecimiento  = x["Cod. Establecimiento"];
          $1                 += x["$1.00"];
          $2                 += x["$2.00"];
          $5                 += x["$5.00"];
          $10                += x["$10.00"];
          $20                += x["$20.00"];
          $50                += x["$50.00"];
          $100               += x["$100.00"];
          $001               += x["T$0.01"];
          $005               += x["T$0.05"];
          $010               += x["T$0.10"];
          $025               += x["T$0.25"];
          $050               += x["T$0.50"];
          $0100              += x["$0.100"];
        } 
        );

        /** Aquí cree la fila de saldos */
        const totalRow = worksheet.addRow(
          [datenow, timenow, clientes,tiendas,'   ***   ',
           equipos,usuario,establecimiento,codestablecimiento,
           '    ','    ','    ',$1*1,
           $2*2,$5*5,$10*10,$20*20,$50*50,$100*100,
           $001.toFixed(2),$005.toFixed(2),
           $010.toFixed(2),$025.toFixed(2),
           $050.toFixed(2),$0100*1, res, 'Total']);

        for (let col = 1; col <= 27; col++) {
          totalRow.getCell( col ).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'F0F0F0' },
          };
          totalRow.getCell(col).border = {
            top:    {
                      style: 'thin',
                      color: { argb: '000000' }
                    },
            left:   {
                      style: 'thin',
                      color: { argb: '000000' }
                    },
            bottom: { 
                      style: 'thin',
                      color: { argb: '000000' }
                    },
            right:  { 
                      style: 'thin',
                      color: { argb: '000000' }
                    },
          };
        }
      }
    });
  
    worksheet.columns.forEach((column: any) => {
        if (numericColumns.includes(column.number - 1)) {
          column.eachCell((cell: any) => {
            cell.numFmt = '#,##0';
        });
        if (column.number === 26) {
          column.width = 20;
          column.eachCell((cell: any) => {
            cell.numFmt = '#,##0.00';
          });
        }
      }
      });
  
      const titleRow = worksheet.getRow(1);
      titleRow.getCell(1).font = { 
        bold: true, 
        size: 17, 
        color: { argb: '8F8F8F' }
      };
  
      const headerRow = worksheet.getRow(2);
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
  
      worksheet.columns.forEach( (column: any) => {
        if      (column.number === 1)  column.width = 15;
        else if (column.number === 3)  column.width = 25;
        else if (column.number === 4)  column.width = 22;
        else if (column.number === 5)  column.width = 15;
        else if (column.number === 7)  column.width = 13;
        else if (column.number === 8)  column.width = 26;
        else if (column.number === 10) column.width = 22;
        else if (column.number === 27) column.width = 22;
      });
    });

      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        a.click();
        window.URL.revokeObjectURL(url);
        setTimeout(() => {
          this.dataExportarExcel = [];
          this.dataExportarExcel = [];
          //console.log('this.dataExportarExcel limpiada!')
          //console.log(this.dataExportarExcel)
        }, 1000);
      });

  }

  getHeaderRow(): string[] {    
    const headers = Object.keys(this.dataExportarExcel[0].transacciones[0]);
    return headers.filter(header => header !== 'T$0.01' && header !== 'T$0.05' && header !== 'T$0.10' && header !== 'T$0.25' && header !== 'T$0.50' &&  header !== 'observacion' && header !== 'fechaRecoleccion' && header !== 'totalRecoleccion' && header !== 'color' && header !== 'fecha' );
  }

  eliminarAcreditaciones(data:any, i:any) {
    Swal.fire({
      title:              "¿Deseas eliminar este proceso?",
      text:               "Esta acción es irreversible para estas transacciones.",
      icon:               "question",
      showCancelButton:   true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor:  "#d33",
      confirmButtonText:  "Sí, cancelar",
      cancelButtonText:   "No cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.hcred.cancelarEquiposAcreditados(data.nombreArchivo).subscribe({
            next: (x) => {
              Toast.fire({ icon: 'success', title: 'Proceso de acreditación cancelado.', position: 'center' });
            },error: (e) => {
              Toast.fire({ icon: 'error', title: 'Algo ha ocurrido, y no se ha podido eliminar.' });
              console.error(e);
            }, complete: () => {
              this.listaAcreditadas.splice(i,1);
            }
          }
        )
      }
    });    
  }

  validateDataExistDate() {
    if( this.exportdateform.controls['datefin'].value != undefined || this.exportdateform.controls['datefin'].value != null || this.exportdateform.controls['datefin'].value != '') {
      this._transaction_show = true;
    }
  }

  onSubmitDate() {
    // Obtén la fecha de this.exportdateform.controls['datefin'].value
    const fechaFinValue = this.exportdateform.controls['datefin'].value;
  
    if (fechaFinValue) {
      // La fecha no es nula, procede a la manipulación de la fecha
      const fechaFin = new Date(fechaFinValue);
  
      // Suma un día a la fecha
      fechaFin.setDate(fechaFin.getDate() + 1);
  
      // Actualiza this.modelConsult con la nueva fecha
      this.modelConsult = {
        FechaIni: this.exportdateform.controls['dateini'].value,
        FechaFin: fechaFin.toISOString() // Convierte la fecha a formato ISO (opcional)
      };
  
      // Realiza la consulta con la nueva fecha
      this.hcred.obtenerAcreditadasTran(this.modelConsult).subscribe({
        next: (x) => {
          //console.log(x);
          this.listaAcreditadasOk = x;
        }
      });
    } else {
      // La fecha es nula, manejar este caso según tus requisitos
      console.error("La fecha de 'datefin' es nula.");
    }
  }
  

}
