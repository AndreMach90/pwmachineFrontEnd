import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClientesService } from '../cliente/services/clientes.service';
import { MonitoreoIndividualService } from './services/monitoreo-individual.service';
import { MonitoreoService } from '../monitoreo-equipos/services/monitoreo.service';
import { Environments } from '../../environments/environments';
import { TransaccionesTiendaService } from '../monitoreo-equipos/modal/services/transacciones-tienda.service';
import * as ExcelJS from 'exceljs';
import jwt_decode from 'jwt-decode';
import { EncryptService } from '../../shared/services/encrypt.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAyudaComponent } from '../../shared/modal-ayuda/modal-ayuda.component';

export interface Transac {total: number; colorRow: string; isSelected?: boolean;}

@Component({
  selector: 'app-monitorear-equipo',
  templateUrl: './monitorear-equipo.component.html',
  styleUrls: ['./monitorear-equipo.component.scss']
})

export class MonitorearEquipoComponent implements OnInit {
  @Output() listaTransaccionesEmitGrafica: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() listaTransaccionesEmitTabla: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() typeFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() modBusqueda: EventEmitter<any> = new EventEmitter<any>();
  @Input() listenNserie!: any;

  listaTransacciones: any = [];
  listaTransaccionesGhost: any = [];
  show_trans: boolean = false;
  trans_detail: boolean = false;
  _show_spinner: boolean = false;
  clientelista: any = [];
  clienteListaGhost: any = [];
  listaEquipo: any = [];
  listaEquipoGhost: any = [];
  showEquipos: boolean = false;
  height_box: string = '82vh';
  height: string = '86.5vh';
  min_box_A: boolean = true;
  width_box: any = '50%'
  delete: any = this.env.apiUrlIcon() + 'delete.png';
  edit: any = this.env.apiUrlIcon() + 'edit.png';
  crear: any = this.env.apiUrlIcon() + 'accept.png';
  cancel: any = this.env.apiUrlIcon() + 'cancel.png';
  search: any = this.env.apiUrlIcon() + 'search.png';
  bill: any = this.env.apiUrlIcon() + 'dollar.png';
  coin: any = this.env.apiUrlIcon() + 'monedas.png';

  dias_estimados: string = '';
  dis_execel_export: boolean = true;
  disButton: boolean = true;
  color_alert: string = 'green';
  show_alert_msj: boolean = false;
  icon_alert: string = 'done';

  title_msj: any;
  importantatr: boolean = true;
  show_button_exportar_excel: boolean = false;
  nserie: any = '';
  showCuadre: boolean = false;
  colorValidateCuadre: any;
  primaryLista: any = [];
  totalBilletesCantidadM: number = 0;
  totalBilletesMontoM: number = 0;
  totalMonedasCantidadM: number = 0;
  totalMonedasMontoM: number = 0;
  totalBilletesCantidadT: number = 0;
  totalBilletesMontoT: number = 0;
  totalMonedasCantidadT: number = 0;
  totalMonedasMontoT: number = 0;
  arrtransacproblemas: any = [];
  xloader: boolean = false;
  error: boolean = false;
  diasEncontrar: number = 31;
  listaTrsansaccionesTablaGhost: any = [];
  listaTrsansaccionesTabla: any = [];
  sumatoriaNoRecollect: number = 0;
  numlist: boolean = false;
  totalSum: number = 0;

  firstSelectedIndex: number | null = null;
  isCtrlPressed: boolean = false;

  public filterTransaccForm = new FormGroup({
    filterTransacc: new FormControl('')
  })

  public filterDateForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl()
  })

  public tiendaForm = new FormGroup({
    codigoClienteidFk: new FormControl(''),
    codigoEquipo: new FormControl(''),
    filterEquipo: new FormControl('')
  });
  role: any;

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    let xdateNow: Date = new Date();
    let xdateNowFormatting: string = this.formatDate(xdateNow);

    if (this.filterDateForm && this.filterDateForm.controls['startDate']) {
      this.filterDateForm.controls['startDate'].setValue(xdateNowFormatting);
    }
    if (this.filterDateForm && this.filterDateForm.controls['endDate']) {
      this.filterDateForm.controls['endDate'].setValue(xdateNowFormatting);
    }

    let xtoken: any = sessionStorage.getItem('token');
    const xtokenDecript: any = this.ncrypt.decryptWithAsciiSeed(xtoken, this.env.es, this.env.hash);

    if (xtokenDecript != null || xtokenDecript != undefined) {
      var decoded: any = jwt_decode(xtokenDecript);
      this.role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (this.role == 'R001' || this.role == 'R002') {
        this.obtenerCliente(1);
      } else if (this.role == 'R005') {
        this.obtenerCliente(0);
      }

      this.filterDateForm.controls['startDate'].disable();
      this.filterDateForm.controls['endDate'].disable();
    }
  }

  constructor(private transacciones: TransaccionesTiendaService,
    private env: Environments,
    public dialog: MatDialog,
    private ncrypt: EncryptService,
    private clienteserv: ClientesService,
    private mequipo: MonitoreoIndividualService,
    private monitoreo: MonitoreoService) { }


  openDialogAyuda(data: any): void {
    const dialogRef = this.dialog.open(ModalAyudaComponent, {
      height: '430px',
      width: '20%',
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  @HostListener('document:keydown.control', ['$event'])
  @HostListener('document:keyup.control', ['$event'])
  onCtrlKey(event: KeyboardEvent) {
    this.isCtrlPressed = event.type === 'keydown';
  }

  toggleSelection(transac: Transac, index: number) {
    if (this.isCtrlPressed) {
      if (this.firstSelectedIndex === null) {
        // Selección inicial
        this.firstSelectedIndex = index;
        transac.isSelected = !transac.isSelected;
        this.totalSum += transac.isSelected ? transac.total : -transac.total;
      } else {
        // Selección de rango
        const start = Math.min(this.firstSelectedIndex, index);
        const end = Math.max(this.firstSelectedIndex, index);

        this.totalSum = 0;
        this.listaTrsansaccionesTabla.forEach((t: any, i: any) => {
          if (i >= start && i <= end) {
            t.isSelected = true;
            this.totalSum += t.total;
          } else {
            t.isSelected = false;
          }
        });
        // Resetear para una nueva selección de rango
        this.firstSelectedIndex = null;
      }
    } else {
      // Selección individual sin Ctrl
      transac.isSelected = !transac.isSelected;
      this.totalSum += transac.isSelected ? transac.total : -transac.total;
    }
  }

  obtenerEquipos() {
    let cli = this.tiendaForm.controls['codigoClienteidFk'].value;
    if (cli) {
      this.mequipo.obtenerEquiposCliente(cli).subscribe({
        next: (x: any) => {
          this.listaEquipo = x;
          this.listaEquipoGhost = x;
        }, error: (e) => {
          console.error(e);
        }, complete: () => {
          this.showEquipos = true;
          this.nserie = '';
          this.tiendaForm.controls['filterEquipo'].setValue('');
          this.filterDateForm.controls['startDate'].enable();
          this.filterDateForm.controls['endDate'].enable();
          this.limpiarData();
        }
      })
    }
  }

  width_title: string = '250px;';
  obtenerCliente(opt: number) {
    this.clientelista = [];
    this._show_spinner = true;
    this.clienteserv.ObtenerClienteSelect().subscribe({
      next: (cliente) => {
        this.clienteListaGhost = cliente;
        this._show_spinner = false;
      },
      error: (e) => {
        this._show_spinner = false;
        console.error(e);
      },
      complete: () => {
        if (opt == 1) {
          this.clienteListaGhost.filter((element: any) => {
            let arr: any = {
              id: element.id,
              codigoCliente: element.codigoCliente,
              nombreCliente: element.nombreCliente,
              ruc: element.ruc,
              direccion: element.direccion,
              telefcontacto: element.telefcontacto,
              emailcontacto: element.emailcontacto,
              nombrecontacto: element.nombrecontacto,
            };
            this.clientelista.unshift(arr);
            this.title_msj = 'Escoge el';
            this.importantatr = true;
            this.width_title = '250px';
          });
        } else if (opt == 0) {
          this.clienteListaGhost.filter((element: any) => {
            if (element.codigoCliente == this.env.codCerveceria) {
              let arr: any = {
                id: element.id,
                codigoCliente: element.codigoCliente,
                nombreCliente: element.nombreCliente,
                ruc: element.ruc,
                direccion: element.direccion,
                telefcontacto: element.telefcontacto,
                emailcontacto: element.emailcontacto,
                nombrecontacto: element.nombrecontacto,
              };
              this.clientelista.unshift(arr);
              this.tiendaForm.controls['codigoClienteidFk'].setValue(element.codigoCliente);
              this.tiendaForm.controls['codigoClienteidFk'].disable();
              this.title_msj = '';
              this.importantatr = false;
              this.width_title = '120px';
              this.obtenerEquipos();
            }
          });
        }
      },
    });
  }

  filterEquipos() {
    let filter: any = this.tiendaForm.controls['filterEquipo'].value;
    this.listaEquipo = this.listaEquipoGhost.filter((item: any) =>
      item.serieEquipo.toLowerCase().includes(filter.toLowerCase()) ||
      item.nombreTienda.toLowerCase().includes(filter.toLowerCase())
    );
  }

  /** Filtro de transacciones tanto para la gráfica como para la tabla de transacciones */
  filterTransaccos() {
    this.listaTrsansaccionesTablaGhost.filter((item: any) => {
      if (item.transaccion_No == undefined || item.transaccion_No == null) item.transaccion_No = '--';
      if (item.acreditada == undefined || item.acreditada == null) item.acreditada = '--';
      if (item.establecimiento == undefined || item.establecimiento == null) item.establecimiento = '--';
      if (item.nombreCliente == undefined || item.nombreCliente == null) item.nombreCliente = '--';
      if (item.nombreTienda == undefined || item.nombreTienda == null) item.nombreTienda = '--';
      if (item.numerocuenta == undefined || item.numerocuenta == null) item.numerocuenta = '--';
      if (item.observacion == undefined || item.observacion == null) item.observacion = '--';
      if (item.tipoCuenta == undefined || item.tipoCuenta == null) item.tipoCuenta = '--';
      if (item.tipoTransaccion == undefined || item.tipoTransaccion == null) item.tipoTransaccion = '--';
      if (item.nombanco == undefined || item.nombanco == null) item.nombanco = '--';
    })
    let filtertTrans: any = this.filterTransaccForm.controls['filterTransacc'].value;
    this.listaTrsansaccionesTabla = this.listaTrsansaccionesTablaGhost.filter((item: any) =>
      item.transaccion_No.toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.acreditada.toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.establecimiento.toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.nombreCliente.toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.nombreTienda.toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.numerocuenta.toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.observacion.toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.tipoCuenta.toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.tipoTransaccion.toString().toLowerCase().includes(filtertTrans.toLowerCase()) ||
      item.nombanco.toString().toLowerCase().includes(filtertTrans.toLowerCase())
    )
  }

  // #region [VARIABLES PARA EL CUEADRO DE VALORES]
  public machineSn: number = 0;
  public ipEquipo: number = 0;
  public depositoCant100: number = 0;
  public depositoCant50: number = 0;
  public depositoCant20: number = 0;
  public depositoCant10: number = 0;
  public depositoCant5: number = 0;
  public depositoCant2: number = 0;
  public depositoCant1: number = 0;
  public depositoMont100: number = 0;
  public depositoMont50: number = 0;
  public depositoMont20: number = 0;
  public depositoMont10: number = 0;
  public depositoMont5: number = 0;
  public depositoMont2: number = 0;
  public depositoMont1: number = 0;
  public manualCant100: number = 0;
  public manualCant50: number = 0;
  public manualCant20: number = 0;
  public manualCant10: number = 0;
  public manualCant5: number = 0;
  public manualCant2: number = 0;
  public manualCant1: number = 0;
  public manualMont100: number = 0;
  public manualMont50: number = 0;
  public manualMont20: number = 0;
  public manualMont10: number = 0;
  public manualMont5: number = 0;
  public manualMont2: number = 0;
  public manualMont1: number = 0;
  public manualCantCoin100: number = 0;
  public manualCantCoin50: number = 0;
  public manualCantCoin25: number = 0;
  public manualCantCoin10: number = 0;
  public manualCantCoin5: number = 0;
  public manualCantCoin1: number = 0;
  public manualMontCoin100: number = 0;
  public manualMontCoin50: number = 0;
  public manualMontCoin25: number = 0;
  public manualMontCoin10: number = 0;
  public manualMontCoin5: number = 0;
  public manualMontCoin1: number = 0;
  public totalDepositoCant: number = 0;
  public totalDepositoMont: number = 0;
  public totalManualBillCant: number = 0;
  public totalManualBillMont: number = 0;
  public totalManualCoinCant: number = 0;
  public totalManualCoinMont: number = 0;
  public mensajeEstatusTransac: string = '';
  show_alert: boolean = false;
  // #endregion

  // #region [ASIGNACION A VARIABLES PARA EL CUADRO DE VALORES]
  asignacionDeDatosTablaCuadre(model: any) {
    this.show_alert = false;
    model.forEach((x: any) => {
      this.machineSn = x.machineSn || 0;
      this.depositoCant100 = x.depositoCant100 || 0;
      this.depositoCant50 = x.depositoCant50 || 0;
      this.depositoCant20 = x.depositoCant20 || 0;
      this.depositoCant10 = x.depositoCant10 || 0;
      this.depositoCant5 = x.depositoCant5 || 0;
      this.depositoCant2 = x.depositoCant2 || 0;
      this.depositoCant1 = x.depositoCant1 || 0;
      this.depositoMont100 = x.depositoMont100 || 0;
      this.depositoMont50 = x.depositoMont50 || 0;
      this.depositoMont20 = x.depositoMont20 || 0;
      this.depositoMont10 = x.depositoMont10 || 0;
      this.depositoMont5 = x.depositoMont5 || 0;
      this.depositoMont2 = x.depositoMont2 || 0;
      this.depositoMont1 = x.depositoMont1 || 0;
      this.manualCant100 = x.manualCant100 || 0;
      this.manualCant50 = x.manualCant50 || 0;
      this.manualCant20 = x.manualCant20 || 0;
      this.manualCant10 = x.manualCant10 || 0;
      this.manualCant5 = x.manualCant5 || 0;
      this.manualCant2 = x.manualCant2 || 0;
      this.manualCant1 = x.manualCant1 || 0;
      this.manualMont100 = x.manualMont100 || 0;
      this.manualMont50 = x.manualMont50 || 0;
      this.manualMont20 = x.manualMont20 || 0;
      this.manualMont10 = x.manualMont10 || 0;
      this.manualMont5 = x.manualMont5 || 0;
      this.manualMont2 = x.manualMont2 || 0;
      this.manualMont1 = x.manualMont1 || 0;
      this.manualCantCoin100 = x.manualCantCoin100 || 0;
      this.manualCantCoin50 = x.manualCantCoin50 || 0;
      this.manualCantCoin25 = x.manualCantCoin25 || 0;
      this.manualCantCoin10 = x.manualCantCoin10 || 0;
      this.manualCantCoin5 = x.manualCantCoin5 || 0;
      this.manualCantCoin1 = x.manualCantCoin1 || 0;
      this.manualMontCoin100 = x.manualMontCoin100 || 0;
      this.manualMontCoin50 = x.manualMontCoin50 || 0;
      this.manualMontCoin25 = x.manualMontCoin25 || 0;
      this.manualMontCoin10 = x.manualMontCoin10 || 0;
      this.manualMontCoin5 = x.manualMontCoin5 || 0;
      this.manualMontCoin1 = x.manualMontCoin1 || 0;
      this.totalDepositoCant = x.totalDepositoCant || 0;
      this.totalDepositoMont = x.totalDepositoMont || 0;
      this.totalManualBillCant = x.totalManualBillCant || 0;
      this.totalManualBillMont = x.totalManualBillMont || 0;
      this.totalManualCoinCant = x.totalManualCoinCant || 0;
      this.totalManualCoinMont = x.totalManualCoinMont || 0;
    });
  }

  limpiarData() {
    this.depositoCant100 = 0;
    this.depositoCant50 = 0;
    this.depositoCant20 = 0;
    this.depositoCant10 = 0;
    this.depositoCant5 = 0;
    this.depositoCant2 = 0;
    this.depositoCant1 = 0;
    this.depositoMont100 = 0;
    this.depositoMont50 = 0;
    this.depositoMont20 = 0;
    this.depositoMont10 = 0;
    this.depositoMont5 = 0;
    this.depositoMont2 = 0;
    this.depositoMont1 = 0;
    this.manualCant100 = 0;
    this.manualCant50 = 0;
    this.manualCant20 = 0;
    this.manualCant10 = 0;
    this.manualCant5 = 0;
    this.manualCant2 = 0;
    this.manualCant1 = 0;
    this.manualMont100 = 0;
    this.manualMont50 = 0;
    this.manualMont20 = 0;
    this.manualMont10 = 0;
    this.manualMont5 = 0;
    this.manualMont2 = 0;
    this.manualMont1 = 0;
    this.manualCantCoin100 = 0;
    this.manualCantCoin50 = 0;
    this.manualCantCoin25 = 0;
    this.manualCantCoin10 = 0;
    this.manualCantCoin5 = 0;
    this.manualCantCoin1 = 0;
    this.manualMontCoin100 = 0;
    this.manualMontCoin50 = 0;
    this.manualMontCoin25 = 0;
    this.manualMontCoin10 = 0;
    this.manualMontCoin5 = 0;
    this.manualMontCoin1 = 0;
    this.totalDepositoCant = 0;
    this.totalDepositoMont = 0;
    this.totalManualBillCant = 0;
    this.totalManualBillMont = 0;
    this.totalManualCoinCant = 0;
    this.totalManualCoinMont = 0;
    this.listaTrsansaccionesTabla = [];
    this.totalSum = 0;
  }
  // #endregion

  nombreTienda: string = 'No seleccionado';
  obtenerDetalleEquipos(data: any) {
    // console.warn('Esta es la data obtenida!!');
    // console.warn(data);
    this._show_spinner = true;
    this.nserie = data.serieEquipo;
    this.nombreTienda = data.nombreTienda;
    localStorage.setItem('equipoMonitoreando', this.nserie);
    this.showCuadre = true;
    this.colorValidateCuadre = 'steelblue';
    this.monitoreo.obtenerDetalleEquipos(this.nserie).subscribe({
      next: (x) => {
        this.primaryLista = x;
        // console.warn(this.primaryLista)
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }, complete: () => {
        this.asignacionDeDatosTablaCuadre(this.primaryLista);
        this.listaTrsansaccionesTabla = [];
        this.totalSum = 0;
      }
    })
  }

  validarRangoDeFechas() {
    let startDate: any = this.filterDateForm.controls['startDate'].value;
    let endDate: any = this.filterDateForm.controls['endDate'].value;
    const fechaInicio = new Date(startDate);
    const fechaFin = new Date(endDate);
    if (fechaFin < fechaInicio) {
      this.dias_estimados = 'La fecha final no puede ser menor a la fecha inicial';
      this.color_alert = 'red';
      this.icon_alert = 'cancel';
      this.show_alert_msj = true;
      this.disButton = true;
      setInterval(() => { this.dias_estimados = ''; this.show_alert_msj = false; }, 4500);
    } else {
      const diferenciaEnDias = Math.abs((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      if (diferenciaEnDias > this.diasEncontrar) {
        this.dias_estimados = 'El rango de fechas no puede ser mayor a un mes';
        this.disButton = true;
        this.icon_alert = 'cancel';
        this.color_alert = 'red';
        this.show_alert_msj = true;
      } else {
        this.dias_estimados = `Diferencia: ${diferenciaEnDias} días`;
        this.disButton = false;
        this.icon_alert = 'done';
        this.color_alert = 'green';
        this.show_alert_msj = true;
      }
    }
  }

  exportarTablaAExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transacciones');
    // Agregar encabezados de las columnas
    worksheet.columns = [
      { header: 'Fecha', key: 'fechaTransaccion', width: 15 },
      { header: 'Hora', key: 'hora', width: 10 },
      { header: 'Cliente', key: 'nombreCliente', width: 20 },
      { header: 'Tienda', key: 'nombreTienda', width: 20 },
      { header: 'N. Trans.', key: 'transaccion_No', width: 15 },
      { header: 'N. Serie Equipo', key: 'machine_Sn', width: 20 },
      { header: 'Usuario', key: 'usuarios_idFk', width: 15 },
      { header: 'Establecimiento', key: 'establecimiento', width: 20 },
      { header: 'Cod. Establecimiento', key: 'codigoEstablecimiento', width: 20 },
      { header: 'Actividad', key: 'observacion', width: 20 },
      { header: 'Cta. Bancaria', key: 'numerocuenta', width: 20 },
      { header: 'Nom. Banco', key: 'nombanco', width: 20 },
      { header: 'T. Cuenta', key: 'tipoCuenta', width: 20 },
      { header: '$1', key: 'deposito_Bill_1', width: 10 },
      { header: '$2', key: 'deposito_Bill_2', width: 10 },
      { header: '$5', key: 'deposito_Bill_5', width: 10 },
      { header: '$10', key: 'deposito_Bill_10', width: 10 },
      { header: '$20', key: 'deposito_Bill_20', width: 10 },
      { header: '$50', key: 'deposito_Bill_50', width: 10 },
      { header: '$100', key: 'deposito_Bill_100', width: 10 },
      { header: '$0.01', key: 'manual_Deposito_Coin_1', width: 10 },
      { header: '$0.05', key: 'manual_Deposito_Coin_5', width: 10 },
      { header: '$0.10', key: 'manual_Deposito_Coin_10', width: 10 },
      { header: '$0.25', key: 'manual_Deposito_Coin_25', width: 10 },
      { header: '$0.50', key: 'manual_Deposito_Coin_50', width: 10 },
      { header: '$1.00', key: 'manual_Deposito_Coin_100', width: 10 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'T.T.', key: 'tipoTransaccion', width: 15 },
    ];

    // Agregar filas con los datos y aplicar estilo basado en la condición
    this.listaTrsansaccionesTabla.forEach((transac: any) => {
      let fechatran: any = transac.fechaTransaccion.toString().split('T');
      const row = worksheet.addRow({
        fechaTransaccion: fechatran[0],
        hora: transac.hora,
        nombreCliente: transac.nombreCliente,
        nombreTienda: transac.nombreTienda,
        transaccion_No: transac.transaccion_No,
        machine_Sn: transac.machine_Sn,
        usuarios_idFk: transac.usuarios_idFk,
        establecimiento: transac.establecimiento,
        codigoEstablecimiento: transac.codigoEstablecimiento,
        observacion: transac.observacion,
        numerocuenta: transac.numerocuenta,
        nombanco: transac.nombanco,
        tipoCuenta: transac.tipoCuenta,
        deposito_Bill_1: transac.deposito_Bill_1,
        deposito_Bill_2: transac.deposito_Bill_2,
        deposito_Bill_5: transac.deposito_Bill_5,
        deposito_Bill_10: transac.deposito_Bill_10,
        deposito_Bill_20: transac.deposito_Bill_20,
        deposito_Bill_50: transac.deposito_Bill_50,
        deposito_Bill_100: transac.deposito_Bill_100,
        manual_Deposito_Coin_1: transac.manual_Deposito_Coin_1,
        manual_Deposito_Coin_5: transac.manual_Deposito_Coin_5,
        manual_Deposito_Coin_10: transac.manual_Deposito_Coin_10,
        manual_Deposito_Coin_25: transac.manual_Deposito_Coin_25,
        manual_Deposito_Coin_50: transac.manual_Deposito_Coin_50,
        manual_Deposito_Coin_100: transac.manual_Deposito_Coin_100,
        total: transac.total,
        tipoTransaccion: transac.tipoTransaccion,
      });

      // Aplicar estilos al encabezado
      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0000FF' },  // Color azul
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },  // Letras blancas
          bold: true
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };  // Alineación
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Aplicar color de fondo naranja si el tipo de transacción es "Recolección"
      if (transac.tipoTransaccion === 'Recolección') {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFA500' }, // Naranja
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }
      else if (transac.tipoTransaccion === 'Automático') {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E6F0EE' },
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }
      else if (transac.tipoTransaccion === 'Manual') {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'CCDFDC' },
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }
    });
    // Guardar el archivo Excel utilizando la función downloadExcelFile
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      this.downloadExcelFile(buffer, 'transacciones_historial.xlsx');
    });
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

  filterByDateRange() {
    this._show_spinner = true;
    this.listaTrsansaccionesTabla = [];
    const fechaFin = new Date(this.filterDateForm.controls['endDate'].value);
    fechaFin.setDate(fechaFin.getDate() + 1);
    let modelRange: any = {
      "tipo": "1",
      "Machine_Sn": this.nserie,
      "FechaInicio": this.filterDateForm.controls['startDate'].value,
      "FechaFin": fechaFin
    }
    this.transacciones.filtroTransaccionesRango(modelRange).subscribe({
      next: (x) => {
        this.listaTransacciones = x;
        this.listaTrsansaccionesTablaGhost = x;
        console.log('}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}filtroTransaccionesRango');
        console.log(this.listaTrsansaccionesTablaGhost);
        console.log('}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}');
      }, error: (e) => console.error(e), 
      complete: () => {
        this.show_button_exportar_excel = (this.listaTrsansaccionesTablaGhost.length > 0) ? true : false;
        this.listaTrsansaccionesTablaGhost.filter((element: any) => {
          let xdate = element.fechaTransaccion.toString().split('T');
          element.hora = xdate[1].slice(0, 8);
          if (element.acreditada == 'A') element.colorRow = '#B5FED8';
          if (element.acreditada == 'E') element.colorRow = '#F1F090';
          if (element.acreditada == 'N') element.colorRow = '#DBE8E8';
          if (element.acreditada == 'R') element.colorRow = '#F1C590';
          this.listaTrsansaccionesTabla.push(element);
        })

        this._show_spinner = false;

        let x: any = localStorage.getItem('equipoMonitoreando')
        this.monitoreo.obtenerDetalleEquipos(x).subscribe({
          next: (x) => {
            this.primaryLista = x;
            this._show_spinner = false;
          }, error: (e) => {
            console.error(e);
            this._show_spinner = false;
          }, complete: () => {
            // this.asignacionDeDatosTablaCuadre(this.primaryLista);
            // this.listaTrsansaccionesTabla = [];
            this.totalSum = 0;
          }
        })
      }
    })
  }

  transaccionesDataTabla: any = [];
  recibirTransaccionesTabla(transacciones: any) {
    this.transaccionesDataTabla = transacciones;
    //// console.warn('Estas son las transacciones enviadas a la tabla');
    //// console.warn(this.transaccionesDataTabla);
    this.arrtransacproblemas = [];
    this.transaccionesDataTabla.filter((element: any) => {
      if (element.repetido > 1) {
        this.error = true;
        element.colorRepetido = '#F7C1C1 !important';
        this.arrtransacproblemas.push(element.transaccion_No);
      }
    })
  }

  /** Obtiene la data de las Transacciones para la Tabla transaccional */
  obtenerTransacTabla(id: any) {
    this.listaTrsansaccionesTablaGhost = [];
    this.listaTrsansaccionesTabla = [];
    this.transacciones.obtenerTransaccionesTienda(id, 2).subscribe({
      next: (transactab: any) => this.listaTrsansaccionesTablaGhost = transactab,
      error: (e) => console.error(e),
      complete: () => {
        this.sumatoriaNoRecollect = 0;
        this.listaTrsansaccionesTablaGhost.filter((element: any) => {
          let xdate = element.fechaTransaccion.toString().split('T');
          element.hora = xdate[1].slice(0, 8);
          if (element.acreditada == 'A') element.colorRow = '#D8F1EC';
          if (element.acreditada == 'E') element.colorRow = '#F1F090';
          if (element.acreditada == 'N') element.colorRow = '#F1E3D8';
          if (element.acreditada == 'R') element.colorRow = '#F1C590';
          this.listaTrsansaccionesTabla.push(element);
        })
      }
    });
  }
}
