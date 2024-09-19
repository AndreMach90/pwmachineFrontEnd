import { Component, Inject, OnInit } from '@angular/core';
import { ModeldataComponent } from '../modeldata/modeldata.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Environments } from '../../environments/environments';
import { EquipoService } from '../../dahsboards/equipo/services/equipo.service';
import * as ExcelJS from 'exceljs';
import { format } from 'date-fns';

@Component({
  selector: 'app-modal-descarga-excel',
  templateUrl: './modal-descarga-excel.component.html',
  styleUrls: ['./modal-descarga-excel.component.scss']
})
export class ModalDescargaExcelComponent implements OnInit {
  listaConsolidados: any = [];
  transaccionesDentroDeRango: any = [];
  RezagadasTran: any = [];
  localidadDentroRango: any = [];
  localidadFueraRango: any = [];
  numericColumns: any = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
  headerExcel: any = ['Localidad', 'Fecha', 'Hora', 'Cliente', 'Tienda', 'N. Trans.', 'N. Serie Equipo',
    'Usuario', 'Establecimiento', 'Actividad', 'Cod. Establ.', 'Nom. Banco', 'T. Cuenta',
    'Cta. Bancaria', '$1', '$2', '$5', '$10', '$20', '$50', '$100', '$0.01', '$0.05', '$0.10',
    '$0.25', '$0.50', '$1.00', 'Total', 'T. T.'];

  constructor(public dialog: MatDialog,
    private equiposerv: EquipoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private env: Environments,
    public dialogRef: MatDialogRef<ModeldataComponent>) { }

    ngOnInit(): void {
      this.transaccionesDentroDeRango = this.data[0].DentroRango;
      this.RezagadasTran = this.data[0].FueraRango;   
      this.encontrarLocalidadesDentroRango();
      this.encontrarLocalidadesFueraRango();

      // console.warn('Datos del MODAL DIALOG');
      // console.warn(this.data);

    }

    encontrarLocalidadesDentroRango() {
      this.localidadDentroRango = [];
    
      // Usamos un Set para eliminar duplicados
      const localidadesUnicas = new Set();
    
      // Filtramos las localidades y las agregamos al Set
      this.transaccionesDentroDeRango.forEach((x: any) => {
        localidadesUnicas.add(x.localidad);
      });
    
      // Convertimos el Set de nuevo a un array
      this.localidadDentroRango = Array.from(localidadesUnicas);
    
      // console.warn(this.localidadDentroRango);
    }


    encontrarLocalidadesFueraRango() {
      this.localidadFueraRango = [];
    
      // Usamos un Set para eliminar duplicados
      const localidadesUnicas = new Set();
    
      // Filtramos las localidades y las agregamos al Set
      this.RezagadasTran.forEach((x: any) => {
        localidadesUnicas.add(x.localidad);
      });
    
      // Convertimos el Set de nuevo a un array
      this.localidadFueraRango = Array.from(localidadesUnicas);
      // console.warn(this.localidadFueraRango);
      
    }
   
    async exportToExcel(): Promise<void> {

      let di: any = this.data[0].FechaIni;
      let df: any = this.data[0].FechaFin;
      let hi: any = this.data[0].HoraIni;
      let hf: any = this.data[0].HoraFin;
      const inicio = new Date(di);
      const fin = new Date(df);
      let formatNumber: any;
      // this.transaccionesRecoleccionesSolo();
  
      // Crear un objeto para agrupar las localidades con sus equipos y transacciones
      const localidadesMap: { [key: string]: any[] } = {};
  
      // Iterar sobre los datos para agrupar por localidad
      this.transaccionesDentroDeRango.forEach((item: any) => {
        const localidad = item.localidad;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        if (!localidadesMap[localidad]) {
          localidadesMap[localidad] = [];
        }
        localidadesMap[localidad].push(item);
      });
  
      // Agrupar los consolidados por localidad
      const consolidadosMap: { [key: string]: any[] } = {};
      this.listaConsolidados.forEach((item: any) => {
        const localidad = item.localidad;
        if (!consolidadosMap[localidad]) {
          consolidadosMap[localidad] = [];
        }
        consolidadosMap[localidad].push(item);
      });
  
      // Iterar sobre las localidades para crear un archivo por cada una
      for (const [localidad, items] of Object.entries(localidadesMap)) {
        const workbook = new ExcelJS.Workbook();
        const transaccionesSheet = workbook.addWorksheet(`Base ${localidad}`);  
        // Agregar encabezados de columnas para transacciones
        const transaccionesHeaderRow = transaccionesSheet.addRow(this.headerExcel);  
        // Aplicar estilos al encabezado
        transaccionesHeaderRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0000FF' }, // Fondo azul
          };
          cell.font = {
            color: { argb: 'FFFFFFFF' }, // Letras blancas
            bold: true,
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
  
        // Iterar sobre los equipos dentro de la localidad
        items.forEach((item: any) => {
          if (item.transacciones) {
            item.transacciones.forEach((transaccion: any) => {
              let row = transaccionesSheet.addRow(this.bodyExcel(item, transaccion));
              this.numericColumns.forEach((colIndex: any) => {
                formatNumber = (colIndex === 28) ? '#,##0.00' : '#,##0';
                row.getCell(colIndex).numFmt = formatNumber;
              });
            });
          }
        });
  
        // Crear la hoja para los consolidados
        const consolidadosSheet = workbook.addWorksheet('Consolidado');
        // Añadir título
        const titleRow = consolidadosSheet.addRow(['DETALLE DE ACREDITACIONES FORTICASH']);
        titleRow.font = { bold: true, size: 17 };
        titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
        consolidadosSheet.mergeCells('A1:G1');
        titleRow.getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD3D3D3' },
        };
  
        // Fila de separación
        consolidadosSheet.addRow([]);
  
        // Fecha "Desde"
        const desdeRow = consolidadosSheet.addRow(['Desde:', inicio]);
        desdeRow.getCell(1).font = { bold: true };
        desdeRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
  
        // Fecha "Hasta"
        const hastaRow = consolidadosSheet.addRow(['Hasta:', fin]);
        hastaRow.getCell(1).font = { bold: true };
        hastaRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
  
        // Hora "Corte"
        const CorteRow = consolidadosSheet.addRow(['Corte:', hi + ' - ' + hf]);
        CorteRow.getCell(1).font = { bold: true };
        CorteRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
  
        // Fila de separación
        consolidadosSheet.addRow([]);
  
        const localidadRow = consolidadosSheet.addRow(['Localidad:', localidad.toUpperCase()]);
        localidadRow.getCell(1).font = { bold: true };
        localidadRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
  
        // Fila de separación
        consolidadosSheet.addRow([]);
  
        // Verificar si hay datos de consolidados para la localidad actual
        if (consolidadosMap[localidad]) {
          const consolidadosHeaders = ['Tienda', 'N. Serie Equipo', 'Establecimiento', 'Cta. Bancaria', 'Código Establecimiento', 'Actividad', 'Total'];
          const consolidadosHeaderRow = consolidadosSheet.addRow(consolidadosHeaders);
          // Establecer el ancho de las columnas 'A', 'B' y 'C'
          consolidadosSheet.getColumn('A').width = 40;
          consolidadosSheet.getColumn('B').width = 25;
          consolidadosSheet.getColumn('C').width = 25;
          consolidadosSheet.getColumn('D').width = 25;
          consolidadosSheet.getColumn('E').width = 25;
          consolidadosSheet.getColumn('G').width = 18;
          // Aplicar estilos al encabezado
          consolidadosHeaderRow.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '6F6F6C' }, // Fondo gris oscuro
            };
            cell.font = {
              color: { argb: 'FFFFFF' }, // Letras blancas
              bold: true,
            };
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center'
            };
          });
  
          let currentTienda = '';
          let currentTotal = 0;
          let totalGeneral = 0;
  
          // Agregar filas de datos
          consolidadosMap[localidad].forEach((item: any, index: number, array: any[]) => {
            if (item.nombreTienda !== currentTienda && currentTienda !== '') {
              // Añadir la fila de total para la tienda anterior
              const totalRow = consolidadosSheet.addRow(['', '', '', '', '', '', currentTotal]);
              consolidadosSheet.mergeCells(`A${totalRow.number}:F${totalRow.number}`);
              totalRow.getCell('A').value = `Total de ${currentTienda}`;
              totalRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (colNumber >= 1 && colNumber <= 7) {
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFD700' },
                  };
                  if (colNumber === 1) {
                    cell.font = { bold: true };
                    cell.alignment = { horizontal: 'left' };
                  }
                  if (colNumber === 7) {
                    cell.alignment = { horizontal: 'right' };
                  }
                }
              });
              totalGeneral += currentTotal;
              currentTotal = 0;
            }
  
            currentTienda = item.nombreTienda;
            currentTotal += item.total;
  
            const rowValues = [
              item.nombreTienda,
              item.machine_Sn,
              item.establecimiento,
              item.numerocuenta,
              item.codigoEstablecimiento,
              item.observacion,
              item.total
            ];
  
            const row = consolidadosSheet.addRow(rowValues);
  
            row.getCell(1).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'E8E8E8' },
            };
  
            row.getCell(1).font = {
              color: { argb: '3E3E3E' },
            };
  
            if (index === array.length - 1) {
              const totalRow = consolidadosSheet.addRow(['', '', '', '', '', '', currentTotal]);
              consolidadosSheet.mergeCells(`A${totalRow.number}:F${totalRow.number}`);
              totalRow.getCell('A').value = `Total de ${currentTienda}`;
              totalRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (colNumber >= 1 && colNumber <= 7) {
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFD700' },
                  };
                  if (colNumber === 1) {
                    cell.font = { bold: true };
                    cell.alignment = { horizontal: 'left' };
                  }
                  if (colNumber === 7) {
                    cell.alignment = { horizontal: 'right' };
                  }
                }
              });
              totalGeneral += currentTotal;
            }
          });
  
          // Añadir la fila de total general
          const totalGeneralRow = consolidadosSheet.addRow(['', '', '', '', '', '', totalGeneral]);
          consolidadosSheet.mergeCells(`A${totalGeneralRow.number}:F${totalGeneralRow.number}`);
          totalGeneralRow.getCell('A').value = 'Total General:';
          totalGeneralRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber >= 1 && colNumber <= 7) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFADD8E6' }, // Fondo celeste
              };
              if (colNumber === 1) {
                cell.font = { bold: true };
                cell.alignment = { horizontal: 'left' }; // Alineación a la izquierda
              }
              if (colNumber === 7) {
                cell.alignment = { horizontal: 'right' };
              }
            }
          });
        } else {
          // Si no hay datos de consolidados, agregar un mensaje
          consolidadosSheet.addRow(['No hay datos consolidados para esta localidad.']);
        }
        const buffer = await workbook.xlsx.writeBuffer();
        // Descargar el archivo Excel con el nombre de la localidad
        this.downloadExcelFile(buffer, `transacciones_${localidad}.xlsx`);
      }
    }
   


    private downloadExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(data);
      downloadLink.href = url;
      downloadLink.download = fileName;
      downloadLink.click();
      window.URL.revokeObjectURL(url);
      downloadLink.remove();
    }

    
  bodyExcel = (item: any, transaccion: any) => {
    return [item.localidad,
    format(new Date(transaccion.fechaTransaccion), 'dd-MM-yyyy'),
    transaccion.hora,
    transaccion.nombreCliente,
    transaccion.nombreTienda,
    transaccion.machine_Sn + '-' + transaccion.transaccion_No,
    transaccion.machine_Sn,
    transaccion.usuarios_idFk,
    transaccion.establecimiento,
    transaccion.observacion,
    transaccion.codigoEstablecimiento,
    transaccion.nombanco,
    transaccion.tipoCuenta,
    transaccion.numerocuenta,
    +transaccion.deposito_Bill_1,
    +transaccion.deposito_Bill_2,
    +transaccion.deposito_Bill_5,
    +transaccion.deposito_Bill_10,
    +transaccion.deposito_Bill_20,
    +transaccion.deposito_Bill_50,
    +transaccion.deposito_Bill_100,
    +transaccion.manual_Deposito_Coin_1,
    +transaccion.manual_Deposito_Coin_5,
    +transaccion.manual_Deposito_Coin_10,
    +transaccion.manual_Deposito_Coin_25,
    +transaccion.manual_Deposito_Coin_50,
    +transaccion.manual_Deposito_Coin_100,
    +transaccion.total,
    transaccion.tipoTransaccion
    ]
  }




}
