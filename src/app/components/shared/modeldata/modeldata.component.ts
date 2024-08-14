import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ClientesService } from '../../dahsboards/cliente/services/clientes.service';
import { TiendaService } from '../../dahsboards/tienda/services/tienda.service';
import { TransaccionesTiendaService } from '../../dahsboards/monitoreo-equipos/modal/services/transacciones-tienda.service';
import { MatDialog } from '@angular/material/dialog';
import { Environments } from '../../environments/environments';
import { ModalDataEquiposComponent } from '../../dahsboards/repodash/filtrotransaccional/modal-data-equipos/modal-data-equipos.component';
import { MenuItem } from 'primeng/api';
import { interval } from 'rxjs';
import { Router } from '@angular/router';
import { takeWhile, finalize } from 'rxjs/operators';
import * as ExcelJS from 'exceljs';
import Swal from 'sweetalert2'
import { format } from 'date-fns';
import { ConsolidadoService } from './services/consolidado.service';
import { MonitoreoIndividualService } from '../../dahsboards/monitorear-equipo/services/monitoreo-individual.service';

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
  selector: 'app-modeldata',
  templateUrl: './modeldata.component.html',
  styleUrls: ['./modeldata.component.scss']
})

export class ModeldataComponent implements OnInit {
  @Output() moduleChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('dateini') dateini: ElementRef | undefined;
  @ViewChild('datefin') datefin: ElementRef | undefined;
  @ViewChild('horaini') horaini: ElementRef | undefined;
  @ViewChild('horafin') horafin: ElementRef | undefined;

  cantidadTransacciones:      number = 0;
  listamaquinasTemporales:    any = [];
  RezagadasTran:              any = [];
  transaccionesDentroDeRango: any = [];
  cantidadRezagadas:          number = 0;
  sumtran:                    number = 0;
  dini:                       any;
  dfin:                       any;
  disbutton_obtener:          boolean = false;
  totalSubstract:             number = 0;
  _cancel_button:             boolean = false;
  barprogress:                boolean = false;
  modelTransaccionesAc:       any = [];
  countTransaction:           number = 0;
  porcentaje:                 number = 0;
  validExportExcel:           boolean = false;
  tran:                       any = [];
  listaDatosTransaccionesAcreditar:any = [];
  maquinasEscogidasDialog:    any   = [];
  transaccionesAutomaticas:   any[] = [];
  transaccionesManuales:      any[] = [];
  colorguia:                  boolean = false;
  items:                      MenuItem[] | undefined;
  clienteListaGhost:          any = [];
  clientelista:               any = [];
  mostrarCiclo:               boolean = false;
  listaDataExportExcelNewFormat: any = [];
  _transaction_show:             boolean = false;
  checked:                       boolean = false;
  delete:                        any     = this.env.apiUrlIcon() + 'delete.png';
  edit:                          any     = this.env.apiUrlIcon() + 'edit.png';
  crear:                         any     = this.env.apiUrlIcon() + 'accept.png';
  cancel:                        any     = this.env.apiUrlIcon() + 'cancel.png';
  search:                        any     = this.env.apiUrlIcon() + 'search.png';
  calendar:                      any     = this.env.apiUrlIcon() + 'calendar.png';
  excel:                         any     = this.env.apiUrlIcon() + 'excel.png';
  configblack:                   any     = this.env.apiUrlIcon() + 'configblack.png';
  menuicon:                      any     = this.env.apiUrlIcon() + 'menu.png';
  transaccionesRecolecciones:    any     = [];
  dataTablefilter:               any     = [];
  sumatoriaTransacciones:        number  = 0;
  indices_show:                  boolean = false;
  checktiendas:                  boolean = false;
  choicetiendas:                 boolean = false;
  _show_spinner:                 boolean = false;
  transac:                       FormGroup;
  dataExportarExcel:             any     = [];
  dataExportarExcelGhost:        any     = [];
  idcliente:                     number  = 0;
  tiendalista:                   any     = [];
  tiendaListaGhost:              any     = [];
  reportVisible:                 boolean = true;
  dis_exp_excel:                 boolean = true;
  conttransaccion:               boolean = false;

  listaEquipo:        any = [];
  listaEquipoGhost:   any = [];
  listaCuadreEquipos: any = [];
  cantCuadrada:       number = 0;

  show_cuadre:                boolean = false;
  modelConsolidadoSend:       any = [];
  listaConsolidados:          any = [];
  listaConsolidadosRezagadas: any = [];

  procesados: number = 0;  
  listaCuadradas: any = [];
  listaRepetidas: any = [];
  listaResagadas: any = [];
  idCli: number = 0;

  maquinasEscogidasDialogGhost: any = [];
  _show_fecha: boolean = false;
  numericColumns: any = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
  headerExcel: any = ['Localidad', 'Fecha', 'Hora', 'Cliente', 'Tienda', 'N. Trans.', 'N. Serie Equipo',
    'Usuario', 'Establecimiento', 'Actividad', 'Cod. Establ.', 'Nom. Banco', 'T. Cuenta',
    'Cta. Bancaria', '$1', '$2', '$5', '$10', '$20', '$50', '$100', '$0.01', '$0.05', '$0.10',
    '$0.25', '$0.50', '$1.00', 'Total', 'T. T.'];
  dias_estimados:     string = '';
  disButton:          boolean = true;
  diasEncontrar:      number  = 31;
  val:number = 0;
  
  public filterTransaccForm = new FormGroup ({
    filterTransacc: new FormControl('')
  })

  public exportdateform = new FormGroup (
    {
      dateini:              new FormControl(''),
      datefin:              new FormControl(''),
      horaini:              new FormControl(''),
      horafin:              new FormControl(''),
      ciclo:                new FormControl(false),
      indices:              new FormControl(false),
      acreditada:           new FormControl(false),
      spriv:                new FormControl(true),
      codigoClienteidFk:    new FormControl(),
      codigoTiendaidFk:     new FormControl()
    }
  )

  constructor( private formBuilder: FormBuilder,
    private mequipo:       MonitoreoIndividualService,
    private clienteserv:   ClientesService,
    private tiendaservs:   TiendaService,
    public  router:        Router,
    private transacciones: TransaccionesTiendaService,
    private consolidado:   ConsolidadoService,
    public  dialog:        MatDialog,
    private env:           Environments ) {

      this.transac = this.formBuilder.group({
        manualTransactions:    true,
        automaticTransactions: true,
        recolecciones:         false
      });

    }

  ngOnInit(): void {
    this.validateSesion();
    this.obtenerCliente();
    this.menuAction();
  }

  visibleDataTable() {
    switch ( this.exportdateform.controls['spriv'].value ) {
      case true:
        this.reportVisible = false;
        break;
      case false:
        this.reportVisible = true;
        break;
    }
  }

  onSubmitHora() {}
  onSubmitDate() {}

  submitTransacFilter() {}

  validateSesion() {
    let xtoken:any = sessionStorage.getItem('token');
    if (xtoken == null || xtoken == undefined || xtoken == '') this.router.navigate(['login']);
  }

  closeSession() {
    sessionStorage.removeItem('token');
    let xtoken:any = sessionStorage.getItem('token');
    if( xtoken == undefined || xtoken == null || xtoken == '' ) this.router.navigate(['login']);
  }

  filtrarTransaccionesFueraDeRango(): void {
    // Tomamos las fechas para concatenarla para más después
    let di: any = this.exportdateform.controls['dateini'].value;
    let df: any = this.exportdateform.controls['datefin'].value;
    let hi: any = this.exportdateform.controls['horaini'].value;
    let hf: any = this.exportdateform.controls['horafin'].value;

    let inicio = new Date(di);
    let fin    = new Date(df);

    // Dividir las horas en horas y minutos
    const [inicioHoras, inicioMinutos] = hi.split(':').map(Number);
    const [finHoras, finMinutos] = hf.split(':').map(Number);

    // Establecems la hora y minutos en las fechas de inicio y fin
    inicio.setHours(inicioHoras, inicioMinutos, 0, 0);
    fin.setHours(finHoras, finMinutos, 0, 0);

    // Añadir un día a la fecha de inicio y fin
    inicio.setDate(inicio.getDate() + 1);
    fin.setDate(fin.getDate() + 1);
  
    this.RezagadasTran = [];
    this.dataExportarExcel.forEach((machine: any) => {      
      const transaccionesFueraDeRango = machine.transacciones.filter((transaccion: any) => {
        const fechaTransaccion = new Date(transaccion.fechaTransaccion);
        return fechaTransaccion < inicio || fechaTransaccion > fin;
      });
      if (transaccionesFueraDeRango.length > 0) {
        this.RezagadasTran.push({
          machine_Sn: machine.machine_Sn,
          localidad: machine.localidad,
          transacciones: transaccionesFueraDeRango
        });
      }
    });
    this.exportToExcelRezagadas();
  }

  obtenerEquipos(idcli: any) {

    if (idcli) {
      this.listaCuadradas = [];
      this.listaRepetidas = [];
      this.listaResagadas = [];
      this.clientelista.filter( (cli:any) => { if( idcli == cli.codigoCliente ) this.idCli = cli.id; });

      this.mequipo.obtenerEquiposCliente(idcli).subscribe({
        next: (x: any) => {
          this.listaEquipo = x;
          this.listaEquipoGhost = x;
          // Agregar una propiedad cuadreData por defecto a cada equipo
          this.listaEquipo.forEach((equipo: any) => {
            equipo.cuadreData = { diferencia: null, icon_data: '', color_data: '' };
          });
        },
        error: (e) => {
          console.error(e);
        },
        complete: () => {
          let cuadrePromises: Promise<any>[] = this.listaEquipo.map((x: any) => {
            return new Promise((resolve, reject) => {
              this.obtenerCuadreEquipos(x.serieEquipo.toString().trim(), resolve, reject);
            });
          });
  
          Promise.all(cuadrePromises).then(() => {
            this.listaCuadreEquipos.filter((x: any) => {
              if (x.cuadreData.resultado == 1) {
                x.cuadreData.icon_data = 'cancel';
                x.cuadreData.color_data = 'red';
                x.cuadreData.msj_data = 'Transacciones repetidas';
                this.listaRepetidas.push(x);
              } else if (x.cuadreData.resultado == 0) {
                x.cuadreData.icon_data = 'done';
                x.cuadreData.color_data = 'green';
                x.cuadreData.msj_data = 'Transacciones cuadradas';
                this.listaCuadradas.push(x);
                // this.listaCuadradas = x.length;
              } else if (x.cuadreData.resultado == 2) {
                x.cuadreData.icon_data = 'cancel';
                x.cuadreData.color_data = 'red';
                x.cuadreData.msj_data = 'Transacciones faltantes';
                this.listaResagadas.push(x);
              }
              this.procesados++;
            });
          }).catch((error) => {
            console.error("Error en obtenerCuadreEquipos:", error);
          });
        }
      });
    }
  }
  
  obtenerCuadreEquipos(machineSn: string, resolve: any, reject: any) {
    this._show_spinner = true;
    this.transacciones.obtenerCuadre(machineSn).subscribe({
      next: (x: any) => {
        // Encuentra el equipo correspondiente y actualiza su cuadreData
        let equipo = this.listaEquipo.find((equipo: any) => equipo.serieEquipo.trim() === machineSn);
        if (equipo) {
          equipo.cuadreData = x;
        }
        this.listaCuadreEquipos.push({
          machineSn: machineSn,
          cuadreData: x
        });
      },
      complete: () => {
        this._show_spinner = false;
        this._show_fecha = true;
        resolve();
      },
      error: (e) => {
        this._show_spinner = false;
        console.error(e);
        reject(e);
      }
    });
  }
  
  obtenerConsolidado( type: number ) {
    let di: any = this.exportdateform.controls['dateini'].value;
    let df: any = this.exportdateform.controls['datefin'].value;

    let hi: any = this.exportdateform.controls['horaini'].value;
    let hf: any = this.exportdateform.controls['horafin'].value;

    let inicio = new Date(di);
    let fin = new Date(df);

    // Dividir las horas en horas y minutos
    const [inicioHoras, inicioMinutos] = hi.split(':').map(Number);
    const [finHoras, finMinutos] = hf.split(':').map(Number);

    // Establecer la hora y minutos en las fechas de inicio y fin
    inicio.setHours(inicioHoras, inicioMinutos, 0, 0);
    fin.setHours(finHoras, finMinutos, 0, 0);

    // Convertir las fechas a UTC
    const inicioUTC = new Date(Date.UTC(inicio.getFullYear(), inicio.getMonth(), inicio.getDate(), inicio.getHours(), inicio.getMinutes()));
    const finUTC = new Date(Date.UTC(fin.getFullYear(), fin.getMonth(), fin.getDate(), fin.getHours(), fin.getMinutes()));

    // Añadir un día a la fecha de inicio y fin en UTC
    inicioUTC.setUTCDate(inicioUTC.getUTCDate() + 1);
    finUTC.setUTCDate(finUTC.getUTCDate() + 1);

    let maquinas: any = [];
    this.dataExportarExcel.filter((x: any) => {
      maquinas.push(x.machine_Sn);
    });

    this.modelConsolidadoSend = {
      equipos: maquinas,
      fechaIni: inicioUTC.toISOString(),
      fechaFin: finUTC.toISOString(),
      tipo: type
    };

    switch( type ) {
      case 1:
        this.consolidado.obtenerConsolidado(this.modelConsolidadoSend).subscribe({
          next: (x) => this.listaConsolidados = x,
          error: (e) => console.log(e),
          complete: () => this.filtrarTransaccionesDentroDeRango(),
        });
        break;
      case 2:
        this.consolidado.obtenerConsolidado(this.modelConsolidadoSend).subscribe({
          next: (x) => this.listaConsolidadosRezagadas = x,
          error: (e) => console.log(e),
          complete: () => this.filtrarTransaccionesFueraDeRango(),
        });
        break;
    }
  }

  exportarToExcelComplete() {
    this.obtenerConsolidado(1);
    this.obtenerConsolidado(2);
    this.exportToExcelConsolidadoGeneral();
    let dt: any = new Date();
    this._show_spinner = true;
    setTimeout(() => {
      this.transPush(`CFI_${dt.getDate()}${dt.getMonth()+1}${dt.getFullYear()}.xlsx`);
      this._show_spinner = false;
    }, 2000);
  }

  filtrarTransaccionesDentroDeRango(): void {
    this.transaccionesDentroDeRango = [];
    let di: any = this.exportdateform.controls['dateini'].value;
    let df: any = this.exportdateform.controls['datefin'].value;

    let hi: any = this.exportdateform.controls['horaini'].value;
    let hf: any = this.exportdateform.controls['horafin'].value;

    let inicio  = new Date(di);
    let fin     = new Date(df);

    // Dividir las horas en horas y minutos
    const [inicioHoras, inicioMinutos] = hi.split(':').map(Number);
    const [finHoras, finMinutos] = hf.split(':').map(Number);

    // Establecer la hora y minutos en las fechas de inicio y fin
    inicio.setHours(inicioHoras, inicioMinutos, 0, 0);
    fin.setHours(finHoras, finMinutos, 0, 0);

    // Añadir un día a la fecha de inicio y fin
    inicio.setDate(inicio.getDate() + 1);
    fin.setDate(fin.getDate() + 1);

    this.dataExportarExcel.forEach((machine: any) => {
      const transaccionesEnRango = machine.transacciones.filter( (transaccion: any) => {
        const fechaTransaccion = new Date(transaccion.fechaTransaccion);
        return fechaTransaccion >= inicio && fechaTransaccion <= fin;
      });
      if ( transaccionesEnRango.length > 0 ) {
        this.transaccionesDentroDeRango.push({
            machine_Sn: machine.machine_Sn,
            localidad: machine.localidad,
            transacciones: transaccionesEnRango
          }
        );
      }
    });
    this.exportToExcel();
  }

  bodyExcel = (item: any, transaccion: any) => {
    return [ item.localidad,
      format(new Date(transaccion.fechaTransaccion), 'dd-MM-yyyy'),
      transaccion.hora,
      transaccion.nombreCliente,
      transaccion.nombreTienda,
      transaccion.machine_Sn + '-' +transaccion.transaccion_No,
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

  async exportToExcelConsolidadoGeneral(): Promise<void> {
    try {
      const fecha         = new Date();
      const workbook      = new ExcelJS.Workbook();
      const worksheet     = workbook.addWorksheet('Base'); //Agregar una nueva hoja al libro
      const dateIniString = this.exportdateform.controls['dateini'].value;
      const horaIniString = this.exportdateform.controls['horaini'].value;
      let dateIni:        any;
      let horaIni:        any;
      let formatNumber:  any;

      // Agregar encabezados de columnas para transacciones
      const headerRow = worksheet.addRow(this.headerExcel);

      // Aplicar estilos al encabezado
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '2929AB' }, // Fondo azul
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' }, // Letras blancas
          bold: true,
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      // Ancho de las celdas
      worksheet.getColumn(1).width = 20; //Localidad
      worksheet.getColumn(2).width = 12; //Fecha
      worksheet.getColumn(4).width = 27; //Cliente
      worksheet.getColumn(5).width = 30; //Tienda
      worksheet.getColumn(6).width = 15; //N. Trans.
      worksheet.getColumn(9).width = 31; //Establecimiento
      worksheet.getColumn(11).width = 12; //Cod. Establ.
      worksheet.getColumn(12).width = 20; //Nom. Banco
      worksheet.getColumn(14).width = 16; //Cta. Bancaria
      worksheet.getColumn(28).width = 12; //Total
      worksheet.getColumn(29).width = 13; //T. T.

      this.dataExportarExcel.sort((a: any, b: any) => {
        const localidadComparison = a.localidad.localeCompare(b.localidad);
        if (localidadComparison !== 0) return localidadComparison;
        return a.machine_Sn.localeCompare(b.machine_Sn);
      });
      
      (dateIniString != null) ? dateIni = new Date(dateIniString): dateIni = new Date();
      (horaIniString != null) ? horaIni = horaIniString.split(':'): horaIni = new Date().getHours();
      dateIni.setHours(parseInt(horaIni[0], 10), parseInt(horaIni[1], 10), 0, 0);
      dateIni.setDate(dateIni.getDate() + 1);

      this.dataExportarExcel.forEach((item: any) => {
        if (item.transacciones) { // Iterar sobre las transacciones del equipo
          item.transacciones.forEach((transaccion: any) => {
            // Data
            let row = worksheet.addRow(this.bodyExcel(item, transaccion));
            this.numericColumns.forEach((colIndex: any) => {
              formatNumber = (colIndex === 28) ? '#,##0.00' : '#,##0';
              row.getCell(colIndex).numFmt = formatNumber;
            });
            if (new Date(transaccion.fechaTransaccion) < dateIni) {
              row.eachCell((cell) => {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FEFFA8' },
                };
              });
            }
          });
        }
      });
      const buf = await workbook.xlsx.writeBuffer(); 
      this.downloadExcelFile(buf,`CFI_${fecha.getDate()}${fecha.getMonth()+1}${fecha.getFullYear()}.xlsx`);
    } catch (error) {
      //console.log("No se puede crear el archivo Excel: "+error);
    }
  }

  async exportToExcel(): Promise<void> {
    // Esperar a que se complete la obtención del consolidado
    let di: any = this.exportdateform.controls['dateini'].value;
    let df: any = this.exportdateform.controls['datefin'].value;
    let hi: any = this.exportdateform.controls['horaini'].value;
    let hf: any = this.exportdateform.controls['horafin'].value;
    const inicio = new Date(di);
    const fin    = new Date(df);
    let formatNumber:  any;

    this.transaccionesRecoleccionesSolo();

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
            let row = transaccionesSheet.addRow(this.bodyExcel(item,transaccion));
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
          type:    'pattern',
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
                  fgColor: { argb: 'FFFFD700' }, // Fondo amarillo
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
            totalGeneral += currentTotal; // Añadir el total de la tienda al total general
            // Resetear el nombre de la tienda y la suma total
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
        
          // Aplicar estilo a la primera columna
          row.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E8E8E8' }, // Fondo gris claro
          };
        
          row.getCell(1).font = {
            color: { argb: '3E3E3E' }, // Letras blancas
          };
        
          // Si es el último elemento, añadir la fila de total también
          if (index === array.length - 1) {
            const totalRow = consolidadosSheet.addRow(['', '', '', '', '', '', currentTotal]);
            consolidadosSheet.mergeCells(`A${totalRow.number}:F${totalRow.number}`);
            totalRow.getCell('A').value = `Total de ${currentTienda}`;
            totalRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
              if (colNumber >= 1 && colNumber <= 7) {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFD700' }, // Fondo amarillo
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
            totalGeneral += currentTotal; // Añadir el total de la tienda al total general
          }
        });
      
        // Añadir la fila de total general
        const totalGeneralRow = consolidadosSheet.addRow([ '', '', '', '', '', '', totalGeneral ]);
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
    const data: Blob      = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const downloadLink    = document.createElement('a');
    const url             = window.URL.createObjectURL(data);
    downloadLink.href     = url;
    downloadLink.download = fileName;
    downloadLink.click();
    window.URL.revokeObjectURL(url);
    downloadLink.remove();
  }

  formatDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11, por lo que se le suma 1
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  async exportToExcelRezagadas(): Promise<void> {
    // Esperar a que se complete la obtención del consolidado
    let di: any = this.exportdateform.controls['dateini'].value;
    let df: any = this.exportdateform.controls['dateini'].value;
    let hi: any = this.exportdateform.controls['horaini'].value;
    let formatNumber:  any;

    const inicio = new Date(di);
    inicio.setDate(inicio.getDate() - 4); // Modifica el objeto 'inicio' restándole 4 días
    const formattedInicio = this.formatDate(inicio);

    const fin = new Date(df);
    fin.setDate(fin.getDate() + 1);
    const formattedfin = this.formatDate(fin);
    // Crear un objeto para agrupar las localidades con sus equipos y transacciones
    const localidadesMap: { [key: string]: any[] } = {};

    // Iterar sobre los datos para agrupar por localidad
    this.RezagadasTran.forEach((item: any) => {
      let localidad = item.localidad;
      if (!localidadesMap[localidad]) {
        localidadesMap[localidad] = [];
      }
      localidadesMap[localidad].push(item);
    });

    // Agrupar los consolidados por localidad
    const consolidadosMap: { [key: string]: any[] } = {};
    this.listaConsolidadosRezagadas.forEach((item: any) => {
      const localidad = item.localidad;
      if (!consolidadosMap[localidad]) {
        consolidadosMap[localidad] = [];
      }
      consolidadosMap[localidad].push(item);
    });

  
    // Iterar sobre las localidades para crear un archivo por cada una
    for (const [localidad, items] of Object.entries(localidadesMap)) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`Transacciones Rezagadas de ${localidad}`);
  
      // Agregar encabezados de columnas para transacciones
      const headerRow = worksheet.addRow(this.headerExcel);

      // Aplicar estilos al encabezado
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E1CC55' }, // Fondo azul
        };
        cell.font = {
          color: { argb: '46422C' }, // Letras negras no tanto es como gris
          bold: true,
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
  
      // Iterar sobre los equipos dentro de la localidad
      items.forEach((item: any) => {
        // Iterar sobre las transacciones del equipo
        if (item.transacciones) {
          item.transacciones.forEach((transaccion: any) => {
            let row = worksheet.addRow(this.bodyExcel(item,transaccion));
            this.numericColumns.forEach((colIndex: any) => {
              formatNumber = (colIndex === 28) ? '#,##0.00' : '#,##0';
              row.getCell(colIndex).numFmt = formatNumber;
            });
          });
        }
      });
  
      // Crear la hoja para los consolidados
      const consolidadosSheet = workbook.addWorksheet('Consolidado Rezagadas');
      // Añadir título
      const titleRow = consolidadosSheet.addRow(['DETALLE DE ACREDITACIONES REZAGADAS FORTICASH']);
      titleRow.font = { bold: true, size: 17 };
      titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
      consolidadosSheet.mergeCells('A1:G1');
      titleRow.getCell(1).fill = {
          type:    'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD3D3D3' },
      };

      consolidadosSheet.addRow([]);// Fila de separación

      // Fecha "Desde"
      const desdeRow = consolidadosSheet.addRow(['Desde:', formattedInicio]);
      desdeRow.getCell(1).font = { bold: true };
      desdeRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };

      // Fecha "Hasta"
      const hastaRow = consolidadosSheet.addRow(['Hasta:', formattedfin]);
      hastaRow.getCell(1).font = { bold: true };
      hastaRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };

      // Hora "Desde y Hasta"
      const CorteRow = consolidadosSheet.addRow(['Corte:', '00:01 - ' + hi]);
      CorteRow.getCell(1).font = { bold: true };
      CorteRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };

      consolidadosSheet.addRow([]);// Fila de separación

      const localidadRow = consolidadosSheet.addRow(['Localidad:', localidad.toUpperCase()]);
      localidadRow.getCell(1).font = { bold: true };
      localidadRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };

      consolidadosSheet.addRow([]);// Fila de separación

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
                  fgColor: { argb: 'FFFFD700' }, // Fondo amarillo
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

          // Aplicar estilo a la primera columna
          row.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E8E8E8' }, // Fondo gris claro
          };

          row.getCell(1).font = {
            color: { argb: '3E3E3E' }, // Letras blancas
          };

          // Si es el último elemento, añadir la fila de total también
          if (index === array.length - 1) {
            const totalRow = consolidadosSheet.addRow(['', '', '', '', '', '', currentTotal]);
            consolidadosSheet.mergeCells(`A${totalRow.number}:F${totalRow.number}`);
            totalRow.getCell('A').value = `Total de ${currentTienda}`;
            totalRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
              if (colNumber >= 1 && colNumber <= 7) {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFD700' }, // Fondo amarillo
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
            totalGeneral += currentTotal; // Añadir el total de la tienda al total general
          }
        });

        // Añadir la fila de total general
        const totalGeneralRow = consolidadosSheet.addRow([ '', '', '', '', '', '', totalGeneral ]);
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
        consolidadosSheet.addRow(['No hay datos consolidados para esta localidad.']);
      }
      const buffer = await workbook.xlsx.writeBuffer();
      this.downloadExcelFile(buffer, `Rezagadas_transacciones_${localidad}.xlsx`);
    }
  }

  transPush(nombreArchivo: any) {
    if (this.exportdateform.controls['acreditada'].value) {
      let xtoken: any = sessionStorage.getItem('usuario');
      let totalTransacciones = 0;   
      this.tran = []; 
      this.dataExportarExcel.forEach((element: any) => {
        element.transacciones.filter((transaccion: any) => {
          const arr = {
            noTransaction:    transaccion.transaccion_No,
            machineSn:        transaccion.machine_Sn,
            fechaTransaction: transaccion.fechaTransaccion,
            fechaIni:         this.exportdateform.controls['dateini'].value + ' ' + this.exportdateform.controls['horaini'].value,
            fechaFin:         this.exportdateform.controls['datefin'].value + ' ' + this.exportdateform.controls['horafin'].value,
            nombreArchivo:    nombreArchivo,
            usuarioRegistro:  xtoken,
          };
          this.tran.push(arr);
        });
        totalTransacciones = this.tran.length;
      });
      if (totalTransacciones > 0) {
        interval(5).pipe(
          takeWhile(() => this.countTransaction < totalTransacciones),
          finalize(() => {
            this.countTransaction = totalTransacciones;
            this.guardarTransaccionesAc(this.tran);
          })
        ).subscribe(() => {
          this.countTransaction++;
          this.porcentaje = ( this.countTransaction / totalTransacciones ) * 100;
          if( this.porcentaje == 100 ) {
            this._show_spinner = true;
            setTimeout(() => {   
              this._show_spinner = false;
              this.moduleChange.emit(true);
            }, 2500);
          }
        });
      }
    }
  }

  guardarTransaccionesAc(model: any[]) {
    this._show_spinner = true;
    this.conttransaccion = true;
    this.transacciones.GuardarTransaccionesAcreditadas(model).subscribe({
      next: (x) => {
        Toast.fire({ icon: 'success', title: 'Transacciones generadas, en espera de acreditación ', position: 'center' });
      },
      error: (e) => {
        this._show_spinner = false;
        Toast.fire({ 
          icon: 'error',
          title: 'Algo ha pasado, no hemos podido generar la acreditación'
        });
      },
      complete: () => {
        this._show_spinner = false;
        this.conttransaccion = false;
        this.limpiar();
      },
    });
  }

  validateDateIni() {
    this.validateDateRange(this.dateini?.nativeElement.value, this.datefin?.nativeElement.value, 'start');
  }

  validateDatefin() {
    this.validateDateRange(this.dateini?.nativeElement.value, this.datefin?.nativeElement.value, 'end');
  }

  validateDateRange(startValue: string, endValue: string, changed: 'start' | 'end') {
    if (startValue && endValue) {
      const fechaInicio = new Date(startValue);
      const fechaFin = new Date(endValue);
      const diferenciaEnDias = Math.abs((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      if (diferenciaEnDias > this.diasEncontrar) {
        Swal.fire({
          text: "El rango de fechas no puede ser mayor a un mes!",
          icon: "info"
        });
        if (changed === 'start') {
          this.datefin!.nativeElement.value = this.calculateMaxEndDate(fechaInicio);
        } else {
          this.dateini!.nativeElement.value = this.calculateMinIniDate(fechaFin);
        }
      }
      if (this.dateini!.nativeElement.value > this.datefin!.nativeElement.value) {
        Swal.fire({
          text: "La fecha inicial no puede ser mayor a la fecha final!",
          icon: "info"
        });
        this.datefin!.nativeElement.value = this.dateini!.nativeElement.value;
      }
      this._transaction_show = true;
    }
  }

  calculateMaxEndDate(startDate: Date): string {
    startDate.setDate(startDate.getDate() + this.diasEncontrar);
    return startDate.toISOString().split('T')[0];
  }

  calculateMinIniDate(endDate: Date): string {
    endDate.setDate(endDate.getDate() - this.diasEncontrar);
    return endDate.toISOString().split('T')[0];
  }

  validateTime() {
    const dateiniValue = this.dateini?.nativeElement.value;
    const datefinValue = this.datefin?.nativeElement.value;
    const horainiValue = this.horaini?.nativeElement.value;
    const horafinValue = this.horafin?.nativeElement.value;
    if ( dateiniValue == datefinValue ) {
      if( horainiValue > horafinValue ) {
        Swal.fire({
          text: "La hora inicial no puede ser mayor a la hora final.",
          icon: "info"
        });
      } else if ( datefinValue < dateiniValue ) {
        Swal.fire({
          text: "La hora final no puede ser menor a la hora inicial.",
          icon: "info"
        });
      }
    }
    if (horainiValue && horafinValue) this.disButton = false;
  }

  eliminarEquiposDeReporteria(equipos:any, i:any) {
    this.maquinasEscogidasDialog.splice(i, 1);
    this.totalSubstract = 0;
    this.sumatoriaTransacciones = this.sumatoriaTransacciones - equipos.longitud;
    this.dataExportarExcel.splice(i, 1);
    this.dataExportarExcelGhost.splice(i, 1);
    if( equipos.transacciones ) {
      equipos.transacciones.filter( (tran:any) => {
        this.totalSubstract += tran.total;
      })
      this.cantidadTransacciones = this.cantidadTransacciones - this.totalSubstract;
    }
    if( this.maquinasEscogidasDialog.length == 0 ) this.limpiar();
  }

  getHeaderRow(): string[] {
    const headers = Object.keys(this.listaDataExportExcelNewFormat[0].transacciones[0]);
    return headers.filter(header => header !== 'T$0.01' && header !== 'T$0.05' && header !== 'T$0.10' && header !== 'T$0.25' && header !== 'T$0.50' &&  header !== 'observacion' && header !== 'fechaRecoleccion' && header !== 'totalRecoleccion' && header !== 'color' && header !== 'fecha' );
  }

  acredit(): number {
    this.val = (this.exportdateform.controls['acreditada'].value == true) ? 1 : 2;
    return this.val;
  }

  openDataEquiposDialog() {
    let arr: any = [];
    let excelData: any = null;
    if( this.dataExportarExcel ) {
      excelData = this.dataExportarExcel;
    } else {
      excelData = null;
    }

    arr = {
      acreditado:        this.acredit(),
      fecchaIni:         this.exportdateform.controls['dateini'].value + ' ' + this.exportdateform.controls['horaini'].value,
      fechaFin:          this.exportdateform.controls['datefin'].value + ' ' + this.exportdateform.controls['horafin'].value,
      codigocliente:     this.idCli,
      codigoTienda:      this.exportdateform.controls['codigoTiendaidFk'].value,
      equiposExistentes: excelData,
      cuadradas:         this.listaCuadradas,
      repetidas:         this.listaRepetidas,
      noRegistradas:     this.listaResagadas
    }

    console.log(arr)

    const dialogRef = this.dialog.open( ModalDataEquiposComponent, {
      height: '100%',
      width:  '60%',
      data:   arr,
    });

    console.log('>>>>>>>>>>>>>>>>>>>>>>>')
    console.log(arr);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>');

    dialogRef.afterClosed().subscribe( (result:any) => {      
      if( result ) {
        this.exportdateform.controls['acreditada'].disable();
        this._cancel_button    = true;
        this.disbutton_obtener = true;
        if( this.maquinasEscogidasDialog.length == 0 ) {
          this.maquinasEscogidasDialog = result;
          this.maquinasEscogidasDialogGhost = result;
        } else {
          result.filter( (equipos: any) => {
            this.maquinasEscogidasDialog.push(equipos);
            this.maquinasEscogidasDialogGhost.push(equipos);
          })
        }
        this.maquinasEscogidasDialog.filter( ( element:any ) => {
          this.dataExportarExcel     .push(element);
          this.dataExportarExcelGhost.push(element);
        });
      } else {
        this._show_spinner = false;
      }
      this.obtenerTransacTabla();
      this.visibleDataTable();
    });
  }

  filterTransaccos() {
    let filtertTrans: any = this.filterTransaccForm.controls['filterTransacc'].value;
    this.maquinasEscogidasDialog = this.maquinasEscogidasDialogGhost.filter( (item:any) => 
      item.machine_Sn             .toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.localidad              .toLowerCase().includes(filtertTrans.toLowerCase()) 
    )
    let arrlongitud: any        = [];
    this.cantidadTransacciones  = 0;
    this.sumatoriaTransacciones = 0;
    this.maquinasEscogidasDialog.filter( (element:any) => {
      if( element.transacciones != null || element.transacciones != undefined ) {
        element.transacciones = element.transacciones.filter( (x:any) => x.tipoTransaccion !== 'Recolección'  );
        element.longitud = element.transacciones.length;
        element.transacciones.filter( (y:any) => {
          if( y.total == null || y.total == undefined ) y.total = 0;
          this.cantidadTransacciones += y.total;
        })
        this.sumatoriaTransacciones += element.longitud;
      }
    })
  }

  eliminarObjetosDuplicados() {
    const uniqueObjects = this.dataExportarExcel.reduce((unique:any, currentObject:any) => {
      const exists = unique.some((obj:any) => obj.nserie === currentObject.nserie);
      if (!exists) {
        unique.push(currentObject);
      }
      return unique;
    }, []);
    const uniqueObjects2 = this.dataExportarExcelGhost.reduce((unique:any, currentObject:any) => {
      const exists = unique.some((obj:any) => obj.nserie === currentObject.nserie);
      if (!exists) {
        unique.push(currentObject);
      }
      return unique;
    }, []);
    this.dataExportarExcel      = uniqueObjects;
    this.dataExportarExcelGhost = uniqueObjects2;
  }
  
  obtenerCliente() {
    this.clientelista = [];
    this._show_spinner = true;

    this.clienteserv.ObtenerClienteSelect().subscribe({
      next: (cliente) => {
        this.clientelista = cliente;
        this._show_spinner = false;
      },
      error: (e) => {
        this._show_spinner = false;
        console.error(e);
      }
    });
  }

  obtenerIDCLiente() {
    this.idcliente = ( this.exportdateform.controls['codigoClienteidFk'].value == undefined || this.exportdateform.controls['codigoClienteidFk'].value == null ) ?
      this.clientelista[0].id : this.exportdateform.controls['codigoClienteidFk'].value;
    // console.log('Este es el ID del Cliente')
    // console.log(this.idcliente)
    if ( this.exportdateform.controls['acreditada'].value == true ) {
      this.obtenerEquipos(this.idcliente);
    }
  }

  obtenerTiendas() {    
    this.tiendalista      = [];
    this.tiendaListaGhost = [];
    this.tiendaservs.obtenerTiendas().subscribe({
      next: (tienda) => {
        this.tiendaListaGhost = tienda;
      }, complete: () => {
        this.obtenerIDCLiente();
        this.tiendaListaGhost.filter( (element:any) => {
          if( element.codigoClienteidFk == this.idcliente ) this.tiendalista.push(element);
          })
        
          if ( this.exportdateform.controls['acreditada'].value == true ) {
            this.show_cuadre = true;
          }
      }
      }
    )
  }

  menuAction() {
    this.items = [{
      label: 'Opciones',
      items: [
        {
          label: 'Índices guía',
          // icon: 'pi pi-refresh',
          command: () => this.indices_show = !this.indices_show,
        },
        {
          label: 'Colores por transacciones',
          // icon: 'pi pi-times',
          command: () => {
          this.colorguia = !this.colorguia;
          this.changeColorsTransac();
          }
        }
      ]}
    ];
  }

  // transaccionesManuealesSolo() { 
  //   let a:boolean = this.transac.controls['manualTransactions'].value;  
  //   switch(a) {
  //     case true:
  //       this.dataExportarExcel.forEach((element:any)=>{
  //         element.transacciones.push(...this.transaccionesManuales.filter((transaccionManual) => transaccionManual.idElemento == element.id && transaccionManual.machine_Sn == element.nserie ));
  //         element.transacciones.sort((a:any, b:any) => {
  //           let dateA = new Date(a.fechaTransaccion + 'T' + a.hora);
  //           let dateB = new Date(b.fechaTransaccion + 'T' + b.hora);
  //           return dateB.getTime() - dateA.getTime();
  //         });
  //         element.longitud = element.transacciones.length;
  //       });
  //       this.transaccionesManuales = [];
  //       break;
  //     case false:
  //       this.dataExportarExcel.forEach( (element:any) => {
  //         let transaccionesManualesElemento = element.transacciones.filter((elementTra:any) => elementTra.tipoTransaccion == 'Manual');
  //         this.transaccionesManuales.push(...transaccionesManualesElemento);
  //         element.transacciones = element.transacciones.filter((elementTra:any) => elementTra.tipoTransaccion != 'Manual');
  //         element.longitud = element.transacciones.length;
  //       });
  //       break;
  //   }
  //   this.sumatoriaTotalTransacciones();
  // }

  // transaccionesAutomaticasSolo() {
  //   let a:boolean = this.transac.controls['automaticTransactions'].value;
  //   switch(a) {
  //     case true:
  //       this.dataExportarExcel.forEach((element:any)=>{
  //         element.transacciones.push(...this.transaccionesAutomaticas.filter((transaccionAuto) => transaccionAuto.idElemento == element.id && transaccionAuto.machine_Sn == element.nserie));
  //         element.transacciones.sort( ( a:any, b:any ) => {
  //           let dateA = new Date(a.fechaTransaccion + 'T' + a.hora);
  //           let dateB = new Date(b.fechaTransaccion + 'T' + b.hora);
  //           return dateB.getTime() - dateA.getTime();
  //         });
  //         element.longitud = element.transacciones.length;
  //       });
  //       this.transaccionesAutomaticas = [];
  //       break;
  //     case false:
  //       this.dataExportarExcel.forEach((element:any)=>{
  //         let transaccionesAutomaticasElemento = element.transacciones.filter((elementTra:any) => elementTra.tipoTransaccion == 'Automático');
  //         this.transaccionesAutomaticas.push(...transaccionesAutomaticasElemento);
  //         element.transacciones = element.transacciones.filter((elementTra:any) => elementTra.tipoTransaccion != 'Automático');
  //         element.longitud = element.transacciones.length;
  //       });
  //       break;
  //   }
  //   this.sumatoriaTotalTransacciones();
  // }

  transaccionesRecoleccionesSolo() {
    this.transaccionesRecolecciones = [];
    let a:boolean = this.transac.controls['recolecciones'].value;
    switch(a) {
      case true:
        this.dataExportarExcel.forEach((element:any) => {          
          element.transacciones
                 .push(...this.transaccionesRecolecciones.filter((transaccionRecol:any) => transaccionRecol.idElemento == element.id && transaccionRecol.machine_Sn == element.nserie));
          element.transacciones
                 .sort((a:any, b:any) => {
            let dateA = new Date(a.fechaTransaccion + 'T' + a.hora);
            let dateB = new Date(b.fechaTransaccion + 'T' + b.hora);
            return dateB.getTime() - dateA.getTime();
          });
          element.longitud = element.transacciones.length;
        });
        this.transaccionesRecolecciones = [];
        break;
      case false:
        this.dataExportarExcel.forEach( ( element:any ) => {
          let transaccionesRecoleccionElemento = element.transacciones.filter((elementTra:any) => elementTra.tipoTransaccion == 'Recolección');
          this.transaccionesRecolecciones.push(...transaccionesRecoleccionElemento);
          element.transacciones = element.transacciones.filter((elementTra:any) => elementTra.tipoTransaccion != 'Recolección');
          element.longitud = element.transacciones.length;
        });
        break;
    }
    this.sumatoriaTotalTransacciones();
  }

  limpiar() {
    this.countTransaction        = 0;
    this.validExportExcel        = true;
    this.conttransaccion         = false;
    this.porcentaje              = 0;
    this.dataExportarExcel       = [];
    this.maquinasEscogidasDialog = [];
    this.maquinasEscogidasDialogGhost = [];
    this.dataExportarExcelGhost  = [];
    this.sumatoriaTransacciones  = 0;
    this.exportdateform.controls['acreditada'].enable();
    this._cancel_button          = false;
    this.dis_exp_excel           = true;
    this.listaDataExportExcelNewFormat = [];
    this.cantidadTransacciones   = 0;
    this.transac       .controls['recolecciones'].enable();
    this.exportdateform.controls['dateini'].enable();
    this.exportdateform.controls['datefin'].enable();
    this.exportdateform.controls['horaini'].enable();
    this.exportdateform.controls['horafin'].enable();
    this.exportdateform.controls['codigoClienteidFk'].enable();
    this.disbutton_obtener = false;
  }

  obtenerTransacTabla() {
    let x = 0;
    x = (this.exportdateform.controls['acreditada'].value) ? 2 : 1;  
    if (this.dataExportarExcel.length > 0) {
      this._show_spinner = true;
      let dini = this.exportdateform.controls['dateini'].value + ' ' + this.exportdateform.controls['horaini'].value;
      let dfin = this.exportdateform.controls['datefin'].value + ' ' + this.exportdateform.controls['horafin'].value;
      Promise.all(this.dataExportarExcel.map((element: any) => {
        return new Promise<void>((resolve, reject) => {
          let modelRange:any = {
            "tipo":        x,
            "Machine_Sn":  element.machine_Sn,
            "FechaInicio": dini,
            "FechaFin":    dfin
          };          
          this.transacciones.filtroTransaccionesRango(modelRange).subscribe({            
            next: (z) => {
              element.transacciones = z;
              element.longitud = element.transacciones.length;
              // this.obterSaldoTransac(element.nserie);
              resolve();
            },            
            error: (e) => reject(e),
          });          
        });
      })).then(() => {
        this.detectaTransaccionesRezagadas(dini, dfin, 1);
      }).catch((error) => console.error(error))
      .finally(() => {
        this._show_spinner = false;
        if( this.cantidadRezagadas > 0 ) {
          Swal.fire({
            title: "Tienes "+ this.cantidadRezagadas + " transacciones Rezagadas, ¿deseas agregar a la data para su preacreditación, para ser exportada a excel?",
            showDenyButton: true,
            confirmButtonText: "Sí, guardar",
            denyButtonText: `No`
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire("Estas transacciones han sido agregadas", "", "success");
            } else if (result.isDenied) {
              this.detectaTransaccionesRezagadas(dini, dfin, 2);
              Swal.fire("Se han quitado las transacciones Rezagadas", "", "info");
            }
          });
        } 
      });
    }
  }

  detectaTransaccionesRezagadas(dateIni: any, dateFin: any, type: number) {
    this.cantidadRezagadas = 0;
    switch (type) {
      case 1:
        this.dataExportarExcel.forEach((x: any) => {
          if (x.transacciones != undefined && x.transacciones != null) this.cantidadRezagadas += x.transaccionesRezagadas;
        });
        this.sumatoriaTotalTransacciones();
        break;  
      case 2:
        let fechaINI: any = dateIni.toString().split(' ')[0];
        let fechaFIN: any = dateFin.toString().split(' ')[0];
        let indexH:   any = null;
        const filterAndRemove = () => {
          return new Promise<void>((resolve, reject) => {
            this.dataExportarExcel.forEach((x: any, index: number) => {
              if ( x.transacciones != undefined && x.transacciones != null ) {
                x.transacciones = x.transacciones.filter( ( tran: any ) => {
                  return tran.fechaTransaccion.toString().split('T')[0] === fechaINI || tran.fechaTransaccion.toString().split('T')[0] === fechaFIN;
                });
                x.longitud = x.transacciones.length;
                if (x.longitud === 0) {
                  indexH = index;
                  this.maquinasEscogidasDialog.splice(index, 1);
                }
                x.Rezagadas = 0;
              }
            });
            resolve();
          });
        };
        filterAndRemove().then(() => {
          if (indexH !== null) {
            this.dataExportarExcel.splice(indexH, 1);
          }
          this.sumatoriaTotalTransacciones();  
        }).catch((error) => {
          console.error('Ocurrió un error:', error);
        });  
        break;
    }
  }

  sumatoriaTotalTransacciones() {
    this.cantidadTransacciones  = 0;
    this.sumatoriaTransacciones = 0;
    switch(this.transac.controls['recolecciones'].value) {
      case false:
        this.dataExportarExcel.filter((element: any) => {
          if( element.transacciones != null || element.transacciones != undefined ) {
            element.transacciones = element.transacciones.filter( (x:any) => x.tipoTransaccion !== 'Recolección'  );
            element.longitud = element.transacciones.length;
            element.transacciones.filter((y:any) => {
              if( y.total == null || y.total == undefined ) y.total = 0;
                this.cantidadTransacciones += y.total;
            })
            this.sumatoriaTransacciones += element.longitud;
          }});
        this.transac.controls['recolecciones'].disable()
        break;
      case true:
        this.dataExportarExcel.filter((element: any) => {
          element.transacciones.filter( (x:any) => {              
          if( x.total == null || x.total == undefined ) x.total = 0;
            this.cantidadTransacciones += x.total;
          });
          this.sumatoriaTransacciones += element.longitud;
          });
          this.transac.controls['recolecciones'].disable()
        break;
      }

    if( this.sumatoriaTransacciones > 0 ) {
      this.dis_exp_excel = false;
      this.exportdateform.controls['dateini'].disable();
      this.exportdateform.controls['datefin'].disable();
      this.exportdateform.controls['horaini'].disable();
      this.exportdateform.controls['horafin'].disable();
      this.exportdateform.controls['codigoClienteidFk'].disable();
    }
  }
  
  changeColorsTransac() {
    this.dataExportarExcel.filter( (element:any) => {  
      element.transacciones.filter( (elementTra:any) => {
        switch( this.colorguia ) {
          case true:
            if( elementTra.tipoTransaccion == "Automático" ) {
              elementTra.color = '#EBE5FF !important;';
            }
            else if ( elementTra.tipoTransaccion == "Manual" ) {
              elementTra.color = '#E5FAFF !important;';
            }
            else if (elementTra.tipoTransaccion == "Recolección") {
              elementTra.color = '#FFE4DA !important;';
            }
            break;  
          case false:
            elementTra.color = 'whitesmoke !important;';
            break;
        }
      })
    })
  }

  respladoDataTran() {
    this._show_spinner = true;
    this.dataExportarExcelGhost.filter( (element:any) => {
      this.transacciones.obtenerTransaccionesTienda(element.nserie, 2).subscribe({
        next: ( transacciones ) => {
          element.transacciones = transacciones;
          element.transacciones.filter((elementtr:any)=> {
            let xdate = elementtr.fechaTransaccion.toString().split('T');
            elementtr.fechaTransaccion = xdate[0];
            elementtr.hora = xdate[1].slice(0,8);
          })
          this._show_spinner = false;
        }, error: (e) => {
          this._show_spinner = false;
          console.log(console.log(e));
        }
      })
    })
  }

  validarRangoFechas() {
    let valorFechaInicial = this.exportdateform.controls['dateini'].value;
    let valorFechaFinal = this.exportdateform.controls['datefin'].value;
    if (valorFechaInicial && valorFechaFinal) {
      let fechaInicial = new Date(valorFechaInicial);
      let fechaFinal = new Date(valorFechaFinal);
      let diferencia = Math.floor((fechaFinal.getTime() - fechaInicial.getTime()) / (1000 * 60 * 60 * 24));
      if (diferencia == 1) this.mostrarCiclo = true;
    }
  }

  recuperarData() {
    this.respladoDataTran();
    const datenow = new Date();
    this.exportdateform.controls['dateini'].setValue(datenow.toDateString());
    this.exportdateform.controls['datefin'].setValue(datenow.toDateString());
    this.exportdateform.controls['horaini'].setValue('');
    this.exportdateform.controls['horafin'].setValue('');
    this.transac.controls['recolecciones'].setValue(true);
    this.transac.controls['automaticTransactions'].setValue(true);
    this.transac.controls['manualTransactions'].setValue(true);
    this.mostrarCiclo = false;
  }

  busquedaPorRango() {
    const fechaInicial = this.exportdateform.controls['dateini'].value;
    const fechaFinal   = this.exportdateform.controls['datefin'].value;
    if (fechaInicial && fechaFinal) {
      this.dataExportarExcel = this.dataExportarExcel.map((element: any) => {      
      element.transacciones = element.transacciones.filter((transaccion: any) => {
        const fechaTransaccion = new Date(transaccion.fechaTransaccion).toISOString().split('T')[0];
        return fechaTransaccion >= fechaInicial && fechaTransaccion <= fechaFinal;
      });
      element.longitud = element.transacciones.length;
      return element;
    });
    } else {
      console.error("Ingrese ambas fechas para filtrar.");
    }
  }

  filtrarPorRangoDeFechasYHoras() {
    this._show_spinner = true;
    const fechaInicial = this.exportdateform.controls['dateini'].value;
    const fechaFinal = this.exportdateform.controls['datefin'].value;
    const horaInicial = this.exportdateform.controls['horaini'].value;
    const horaFinal = this.exportdateform.controls['horafin'].value;
    if (fechaInicial && fechaFinal && horaInicial && horaFinal) {
      this.dataExportarExcel = this.dataExportarExcel.map((element: any) => {
        element.transacciones = element.transacciones.filter((transaccion: any) => {
          const fechaTransaccion = new Date(transaccion.fechaTransaccion + 'T' + transaccion.hora).toISOString();
          const fechaIni = new Date(fechaInicial + 'T' + horaInicial).toISOString();
          const fechaFin = new Date(fechaFinal + 'T' + horaFinal).toISOString();
          return fechaTransaccion >= fechaIni && fechaTransaccion <= fechaFin;
        });
        element.longitud = element.transacciones.length;
        return element;
      });
      this._show_spinner = false;
    } else {
      console.error("Ingrese fechas y horas para filtrar.");
      this._show_spinner = false;
    }
  }

  filtrarPorRangoDeHoras(data: any, horaInicial: string, horaFinal: string): any {
    return data.map((element: any) => {
      element.transacciones = element.transacciones.filter((transaccion: any) => {
        const horaTransaccion = transaccion.hora;
        return this.estaEnRangoDeHoras(horaTransaccion, horaInicial, horaFinal);
      });
      element.longitud = element.transacciones.length;
      return element;
    });
  }

  estaEnRangoDeHoras(hora: string, horaInicial: string, horaFinal: string): boolean {
    const horaTransaccion  =  new Date(`1970-01-01T${hora}`);
    const horaInicio       =  new Date(`1970-01-01T${horaInicial}`);
    const horaFin          =  new Date(`1970-01-01T${horaFinal}`);
    return horaTransaccion >= horaInicio && horaTransaccion <= horaFin;
  }
  
  filtrarPorHoras() {
    const horaInicial:any = this.exportdateform.controls['horaini'].value;
    const horaFinal:any = this.exportdateform.controls['horafin'].value;
    switch(this.exportdateform.controls['ciclo'].value) {
      case false:
        this.dataExportarExcel = this.filtrarPorRangoDeHoras(this.dataExportarExcel, horaInicial, horaFinal);
        break;
      case true:
        this.filtrarPorRangoDeFechasYHoras();
        break;
    }
  }

  checkFiltrarCliente(checktienda: boolean){
    if(!checktienda) this.exportdateform.controls['codigoClienteidFk'].setValue(null);
  }

}