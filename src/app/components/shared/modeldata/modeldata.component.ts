import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ClientesService } from '../../dahsboards/cliente/services/clientes.service';
import { TiendaService } from '../../dahsboards/tienda/services/tienda.service';
import { MonitoreoService } from '../../dahsboards/monitoreo-equipos/services/monitoreo.service';
import { TransaccionesTiendaService } from '../../dahsboards/monitoreo-equipos/modal/services/transacciones-tienda.service';
import { MatDialog } from '@angular/material/dialog';
import { Environments } from '../../environments/environments';
import { ModalDataEquiposComponent } from '../../dahsboards/repodash/filtrotransaccional/modal-data-equipos/modal-data-equipos.component';
import { MenuItem, MessageService } from 'primeng/api';
import { Observable, elementAt, forkJoin, interval } from 'rxjs';
import { Router } from '@angular/router';
import { takeWhile, finalize } from 'rxjs/operators';
import * as ExcelJS from 'exceljs';
import Swal from 'sweetalert2'
import { HistoriaAcreditacionService } from '../historial-acreditacion/services/historia-acreditacion.service';
import { EncryptService } from '../services/encrypt.service';
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
  selector: 'app-modeldata',
  templateUrl: './modeldata.component.html',
  styleUrls: ['./modeldata.component.scss']
})

export class ModeldataComponent implements OnInit {

  @Output() moduleChange: EventEmitter<any> = new EventEmitter<any>();

  disbutton_obtener: boolean = false;
  totalSubstract: number = 0;
  _cancel_button: boolean = false;
  barprogress: boolean = false;
  modelTransaccionesAc: any = [];
  countTransaction: number = 0;
  porcentaje : number = 0;
  validExportExcel:boolean = false;
  tran: any = [];
  listaDatosTransaccionesAcreditar:any = [];
  maquinasEscogidasDialog:  any   = [];
  transaccionesAutomaticas: any[] = [];
  transaccionesManuales: any[] = [];
  colorguia:boolean = false;
  items: MenuItem[] | undefined;
  clienteListaGhost: any = [];
  clientelista:any = [];
  mostrarCiclo: boolean = false;
  listaDataExportExcelNewFormat: any = [];
  _transaction_show:       boolean = false;
  checked:                 boolean = false;
  delete:                  any  = this.env.apiUrlIcon() + 'delete.png';
  edit:                    any  = this.env.apiUrlIcon() + 'edit.png';
  crear:                   any  = this.env.apiUrlIcon() + 'accept.png';
  cancel:                  any  = this.env.apiUrlIcon() + 'cancel.png';
  search:                  any  = this.env.apiUrlIcon() + 'search.png';
  calendar:                any  = this.env.apiUrlIcon() + 'calendar.png';
  excel:                   any  = this.env.apiUrlIcon() + 'excel.png';
  configblack:             any  = this.env.apiUrlIcon() + 'configblack.png';
  menuicon:                any  = this.env.apiUrlIcon() + 'menu.png';
  transaccionesRecolecciones: any[] = [];
  dataTablefilter:        any     = [];
  sumatoriaTransacciones: number  = 0;
  indices_show:           boolean = false;
  checktiendas:           boolean = false;
  choicetiendas:          boolean = false;
  _show_spinner:          boolean = false;
  transac:                FormGroup;
  dataExportarExcel:      any     = [];
  dataExportarExcelGhost: any     = [];
  idcliente:              number  = 0;
  tiendalista:            any     = [];
  tiendaListaGhost:       any     = [];
  reportVisible: boolean = true;
  dis_exp_excel: boolean = true;
  conttransaccion: boolean = false;

  public exportdateform = new FormGroup({
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
  })

  constructor( private formBuilder: FormBuilder,
    private reouter: Router,
    private tokenGen: SharedService,
    private acreditacion:  HistoriaAcreditacionService,
    private clienteserv:   ClientesService,
    private tiendaservs:   TiendaService,
    private monitoreo:     MonitoreoService,
    public router:         Router,
    private transacciones: TransaccionesTiendaService,
    public dialog:         MatDialog,
    private ncrypt:        EncryptService,
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

    switch (this.exportdateform.controls['spriv'].value) {
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

  submitTransacFilter() {
    console.log(this.transac.value);
  }

  validateSesion() {
    let xtoken:any = sessionStorage.getItem('token');
    if (xtoken == null || xtoken == undefined || xtoken == '') {
      this.router.navigate(['login'])
      // //alert'NO hay token de usuario');
    }
  }

  closeSession() {
    sessionStorage.removeItem('token');
    let xtoken:any = sessionStorage.getItem('token');
    if( xtoken == undefined || xtoken == null || xtoken == '' ) {
      this.router.navigate(['login']);
    }
  }

  exportarExcel(): void {
    
    this.transaccionesRecoleccionesSolo();

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
    this.dataExportarExcel.forEach( (equipo: any) => {      
      const transaccionesTransformadas = equipo.transacciones.map( ( elementTra: any ) => {
        return {
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
          "T$0.01":                elementTra.manual_Deposito_Coin_1*0.01,
          "$0.05":                 elementTra.manual_Deposito_Coin_5,
          "T$0.05":                elementTra.manual_Deposito_Coin_5*0.05,
          "$0.10":                 elementTra.manual_Deposito_Coin_10,
          "T$0.10":                elementTra.manual_Deposito_Coin_10*0.10,
          "$0.25":                 elementTra.manual_Deposito_Coin_25,
          "T$0.25":                elementTra.manual_Deposito_Coin_25*0.25,
          "$0.50":                 elementTra.manual_Deposito_Coin_50,
          "T$0.50":                elementTra.manual_Deposito_Coin_50*0.50,
          "$0.100":                elementTra.manual_Deposito_Coin_100,
          "Total":                 elementTra.total,
          "totalRecoleccion":      elementTra.totalRecoleccion,
          "Tipo de transacción":   elementTra.tipoTransaccion,
          "fechaRecoleccion":      elementTra.fechaRecoleccion,
        };
      });
  
      // Añade la información transformada al nuevo objeto
      this.listaDataExportExcelNewFormat.push({
        ...equipo,
        transacciones: transaccionesTransformadas
      });      
    });
    const worksheet = workbook.addWorksheet('TodasTransacciones');
    this.listaDataExportExcelNewFormat.forEach((equipo: any) => {
      // const worksheet = workbook.addWorksheet(`Transacciones_${equipo.nserie}`); 
      const headers = this.getHeaderRow();
      const numericColumns = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

      // Agrega encabezados de columna solo si es la primera iteración
      if (this.listaDataExportExcelNewFormat.indexOf(equipo) === 0) {
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
            // if (columnIndex === 26) {
            //     j = 777;
            // }
            row.push(Number(j));
        } else {
            row.push(cellValue);
        }
    });

    worksheet.addRow(row);

    let datenow = new Date();
    let timenow = new Date().getHours().toString()+':'+new Date().getMinutes().toString()+':'+new Date().getSeconds().toString();

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

        const totalRow = worksheet.addRow(
          [datenow, timenow, clientes,tiendas,'   ***   ',
           equipos,usuario,establecimiento,codestablecimiento,
           '    ','    ','    ',$1*1,
           $2*2,$5*5,$10*10,$20*20,$50*50,$100*100,
           $001.toFixed(2),$005.toFixed(2),$010.toFixed(2),$025.toFixed(2),$050.toFixed(2),
           $0100*1, res, 'Total']);

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
  
    let dateData = new Date();
    let tokenDocs: any = this.tokenGen.generateRandomString(5).replace(' ', '_');
    let nombreArchivo: any = 'Transacciones_' + dateData.getDate() + '-' + (dateData.getMonth() + 1) + '-' + dateData.getFullYear() + 'T' + dateData.getHours() + 'H' + dateData.getMinutes() + 'm' + '_' + tokenDocs + '.xlsx';
    this.transPush(nombreArchivo);
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo;
      a.click();
      window.URL.revokeObjectURL(url);
      this.exportdateform.controls['acreditada'].enable();
      setTimeout(() => {
        this.limpiar();
      }, 3000);
    });

  }

  transPush(nombreArchivo: any) {
    if (this.exportdateform.controls['acreditada'].value) {
      let xtoken: any = sessionStorage.getItem('usuario');
      let totalTransacciones = 0;   
      // Paso 1: Recopilar transacciones en this.tran
      this.dataExportarExcel.forEach((element: any) => {
        element.transacciones.filter((transaccion: any) => {
        
          const arr = {
            noTransaction: transaccion.transaccion_No,
            machineSn: transaccion.machine_Sn,
            fechaTransaction: transaccion.fechaTransaccion,
            fechaIni: this.exportdateform.controls['dateini'].value + ' ' + this.exportdateform.controls['horaini'].value,
            fechaFin: this.exportdateform.controls['datefin'].value + ' ' + this.exportdateform.controls['horafin'].value,
            nombreArchivo: nombreArchivo,
            usuarioRegistro: xtoken,
          }
        
          this.tran.push(arr);
        
        });
    
        totalTransacciones = this.tran.length;

      });
    
      // Paso 2: Ejecutar el primer bloque paso a paso usando RxJS
      if (totalTransacciones > 0) {
        interval(5) // Emitir un valor cada 5 milisegundos
          .pipe(
            takeWhile(() => this.countTransaction < totalTransacciones),
            finalize(() => {
              this.countTransaction = totalTransacciones;
              // console.log('Intervalo detenido');
              // Paso 3: Ejecutar la función guardarTransaccionesAc
              this.guardarTransaccionesAc(this.tran);
            })
          )
          .subscribe(() => {
            this.countTransaction++;
            this.porcentaje = ( this.countTransaction / totalTransacciones ) * 100;

            if( this.porcentaje == 100 ) {
              this._show_spinner = true;
              setTimeout(() => {
     
     
     
     
                this._show_spinner = false;
                this.moduleChange.emit(true);
              }, 2000);
            }

          });
      }
    }
  }

  @ViewChild('dateini') dateini: ElementRef | undefined;
  @ViewChild('datefin') datefin: ElementRef | undefined;
  @ViewChild('horaini') horaini: ElementRef | undefined;
  @ViewChild('horafin') horafin: ElementRef | undefined;
  validateExistDate() {
    const dateiniValue = this.dateini?.nativeElement.value;
    const datefinValue = this.datefin?.nativeElement.value;


    if (dateiniValue && datefinValue) {
      if (dateiniValue > datefinValue) {
        Swal.fire({
          // title: "Es en serio?",
          text: "La fecha inicial no puede ser mayor a la fecha final.",
          icon: "question"
        });
        this.datefin!.nativeElement.value = dateiniValue;
      } else if (datefinValue < dateiniValue) {
        Swal.fire({
          // title: "Es en serio?",
          text: "La fecha final no puede ser menor a la fecha inicial.",
          icon: "question"
        });
        this.dateini!.nativeElement.value = datefinValue;
      }

      this.validateDataExistDate();

    }
  }


  validateTime() {

    // console.log('validando')

    const dateiniValue = this.dateini?.nativeElement.value;
    const datefinValue = this.datefin?.nativeElement.value;
    const horainiValue = this.horaini?.nativeElement.value;
    const horafinValue = this.horafin?.nativeElement.value;

    // console.log(dateiniValue)
    // console.log(datefinValue)
    // console.log(horainiValue)
    // console.log(horafinValue)

    if ( dateiniValue == datefinValue ) {

      if( horainiValue > horafinValue ) {
        Swal.fire({
          // title: "Es en serio?",
          text: "La hora inicial no puede ser mayor a la hora final.",
          icon: "question"
        });
      } else if ( datefinValue < dateiniValue ) {
        Swal.fire({
          // title: "Es en serio?",
          text: "La hora final no puede ser menor a la hora inicial.",
          icon: "question"
        });
      }

    }

  }

  eliminarEquiposDeReporteria(equipos:any, i:any) {    
    this.maquinasEscogidasDialog.splice(i, 1);
    this.totalSubstract = 0;
    this.sumatoriaTransacciones = this.sumatoriaTransacciones - equipos.longitud;
    this.dataExportarExcel.splice(i, 1);
    this.dataExportarExcelGhost.splice(i, 1);
    equipos.transacciones.filter( (tran:any) => {
      this.totalSubstract += tran.total;
    })

    this.cantidadTransacciones = this.cantidadTransacciones - this.totalSubstract;

    if( this.maquinasEscogidasDialog.length == 0 ) {
      this.limpiar();
    }

  }

  getHeaderRow(): string[] {    
    const headers = Object.keys(this.listaDataExportExcelNewFormat[0].transacciones[0]);
    return headers.filter(header => header !== 'T$0.01' && header !== 'T$0.05' && header !== 'T$0.10' && header !== 'T$0.25' && header !== 'T$0.50' &&  header !== 'observacion' && header !== 'fechaRecoleccion' && header !== 'totalRecoleccion' && header !== 'color' && header !== 'fecha' );
  }

  val:number = 0;
  acredit(): number {

    if(this.exportdateform.controls['acreditada'].value == true) {
      this.val = 1
    } else {
      this.val = 2
    }

    return this.val;

  }

  recol() {
    
  }

  openDataEquiposDialog() {

    let arr: any = [];
    if( this.dataExportarExcel ) {
      arr = {
        acreditado:        this.acredit(),
        fecchaIni:         this.exportdateform.controls['dateini'].value + ' ' + this.exportdateform.controls['horaini'].value,
        fechaFin:          this.exportdateform.controls['datefin'].value + ' ' + this.exportdateform.controls['horafin'].value,
        codigocliente:     this.exportdateform.controls['codigoClienteidFk'].value,
        codigoTienda:      this.exportdateform.controls['codigoTiendaidFk'].value,
        equiposExistentes: this.dataExportarExcel
      }
    } else {
      arr = {
        acreditado:        this.acredit(),
        fecchaIni:         this.exportdateform.controls['dateini'].value + ' ' + this.exportdateform.controls['horaini'].value,
        fechaFin:          this.exportdateform.controls['datefin'].value + ' ' + this.exportdateform.controls['horafin'].value,
        codigocliente:     this.exportdateform.controls['codigoClienteidFk'].value,
        codigoTienda:      this.exportdateform.controls['codigoTiendaidFk'].value,
        equiposExistentes: null
      }
    }

    const dialogRef = this.dialog.open( ModalDataEquiposComponent, {
      height: 'auto',
      width:  '400px',
      data:   arr,
    });

    dialogRef.afterClosed().subscribe( (result:any) => {
      
      if( result ) {
        this.exportdateform.controls['acreditada'].disable();
        this._cancel_button    = true;
        this.disbutton_obtener = true;
        if( this.maquinasEscogidasDialog.length == 0 ) {
          this.maquinasEscogidasDialog = result; 
        }

        else {
          result.filter( (equipos: any) => {
            this.maquinasEscogidasDialog.push(equipos);  
          })
        }

        this.maquinasEscogidasDialog.filter( ( element:any ) => {
          this.dataExportarExcel.push( element );
          this.dataExportarExcelGhost.push( element );
          this.eliminarObjetosDuplicados();
        });

      }
      else {
        this._show_spinner = false;
      }

      this.obtenerTransacTabla();
      this.visibleDataTable();

    });

  }

  eliminarObjetosDuplicados() {
    const uniqueObjects = this.dataExportarExcel.reduce((unique:any, currentObject:any) => {
      // Verificar si el objeto ya existe en uniqueObjects por la propiedad nserie
      const exists = unique.some((obj:any) => obj.nserie === currentObject.nserie);

      // Si no existe, agregarlo a uniqueObjects
      if (!exists) {
        unique.push(currentObject);
      }

      return unique;
    }, []);
    const uniqueObjects2 = this.dataExportarExcelGhost.reduce((unique:any, currentObject:any) => {
      // Verificar si el objeto ya existe en uniqueObjects por la propiedad nserie
      const exists = unique.some((obj:any) => obj.nserie === currentObject.nserie);

      // Si no existe, agregarlo a uniqueObjects
      if (!exists) {
        unique.push(currentObject);
      }

      return unique;
    }, []);

    // Actualizar el array original con los objetos únicos
    this.dataExportarExcel      = uniqueObjects;
    this.dataExportarExcelGhost = uniqueObjects2;
  }

  validateDataExistDate() {
    if( this.exportdateform.controls['datefin'].value != undefined || this.exportdateform.controls['datefin'].value != null || this.exportdateform.controls['datefin'].value != '') {
      this._transaction_show = true;
    }
  }

  obetenerDetalleDeEquipos() {
    // this.monitoreo.obtenerDetalleEquipos(  )
  }
  
  obtenerCliente() {
    this.clientelista = [];
    this._show_spinner = true;
    this.clienteserv.obtenerCliente().subscribe({
      next: (cliente) => {
        this.clienteListaGhost = cliente;
        this._show_spinner = false;
      }, error: (e) => {
        this._show_spinner = false;
        console.error(e);
      }, complete: () => {
        this.clienteListaGhost.filter((element:any) => {

          let arr: any = {
            "id": element.id,
            "codigoCliente": element.codigoCliente,
            "nombreCliente": element.nombreCliente,
            "ruc": element.ruc,
            "direccion": element.direccion,
            "telefcontacto": element.telefcontacto,
            "emailcontacto": element.emailcontacto,
            "nombrecontacto": element.nombrecontacto
          }

          this.clientelista.unshift(arr);

        })
      }
    })
  }

  obtenerIDCLiente() {

    if ( this.exportdateform.controls['codigoClienteidFk'].value == undefined || this.exportdateform.controls['codigoClienteidFk'].value == null ) {
      console.warn('No hay un id');
      this.idcliente = this.clientelista[0].id;
    }
    else {
      this.idcliente = this.exportdateform.controls['codigoClienteidFk'].value;
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
          this.tiendaListaGhost.filter( ( element:any ) => {
            if( element.codigoClienteidFk == this.idcliente ) {
              this.tiendalista.push(element);
            }
          })
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
                command: () => {
                  this.indices_show = !this.indices_show;                   
                }
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

  transaccionesManuealesSolo() { let a:boolean = this.transac.controls['manualTransactions'].value;  
    switch(a) {
      case true:
        this.dataExportarExcel.forEach((element:any)=>{
          element.transacciones.push(...this.transaccionesManuales.filter((transaccionManual) => transaccionManual.idElemento == element.id && transaccionManual.machine_Sn == element.nserie ));
          element.transacciones.sort((a:any, b:any) => {
            let dateA = new Date(a.fechaTransaccion + 'T' + a.hora);
            let dateB = new Date(b.fechaTransaccion + 'T' + b.hora);
            return dateB.getTime() - dateA.getTime();
          });
          element.longitud = element.transacciones.length;
        });
        this.transaccionesManuales = [];
        break;
      case false:
        this.dataExportarExcel.forEach( (element:any) => {
          let transaccionesManualesElemento = element.transacciones.filter((elementTra:any) => elementTra.tipoTransaccion == 'Manual');
          this.transaccionesManuales.push(...transaccionesManualesElemento);
          element.transacciones = element.transacciones.filter((elementTra:any) => elementTra.tipoTransaccion != 'Manual');
          element.longitud = element.transacciones.length;
        });
        break;
    }
    this.sumatoriaTotalTransacciones();
  }

  transaccionesAutomaticasSolo() {
    let a:boolean = this.transac.controls['automaticTransactions'].value;
    switch(a) {
      case true:
        this.dataExportarExcel.forEach((element:any)=>{
          element.transacciones.push(...this.transaccionesAutomaticas.filter((transaccionAuto) => transaccionAuto.idElemento == element.id && transaccionAuto.machine_Sn == element.nserie));
          element.transacciones.sort( ( a:any, b:any ) => {
            let dateA = new Date(a.fechaTransaccion + 'T' + a.hora);
            let dateB = new Date(b.fechaTransaccion + 'T' + b.hora);
            return dateB.getTime() - dateA.getTime();
          });
          element.longitud = element.transacciones.length;
        });
        this.transaccionesAutomaticas = [];
        break;
      case false:
        this.dataExportarExcel.forEach((element:any)=>{
          let transaccionesAutomaticasElemento = element.transacciones.filter((elementTra:any) => elementTra.tipoTransaccion == 'Automático');
          this.transaccionesAutomaticas.push(...transaccionesAutomaticasElemento);
          element.transacciones = element.transacciones.filter((elementTra:any) => elementTra.tipoTransaccion != 'Automático');
          element.longitud = element.transacciones.length;
        });
        break;
    }
    this.sumatoriaTotalTransacciones();
  }

  transaccionesRecoleccionesSolo() {
    this.transaccionesRecolecciones = [];
    let a:boolean = this.transac.controls['recolecciones'].value;
    switch(a) {
      case true:
        this.dataExportarExcel.forEach((element:any) => {          
          element.transacciones.push(...this.transaccionesRecolecciones.filter((transaccionRecol) => transaccionRecol.idElemento == element.id && transaccionRecol.machine_Sn == element.nserie));
          element.transacciones.sort((a:any, b:any) => {
            let dateA = new Date(a.fechaTransaccion + 'T' + a.hora);
            let dateB = new Date(b.fechaTransaccion + 'T' + b.hora);
            return dateB.getTime() - dateA.getTime();
          });

          element.longitud = element.transacciones.length;

        });
        this.transaccionesRecolecciones = [];
        break;
      case false:
        this.dataExportarExcel.forEach((element:any) => {
          let transaccionesRecoleccionElemento = element.transacciones.filter((elementTra:any) => elementTra.tipoTransaccion == 'Recolección');
          this.transaccionesRecolecciones.push(...transaccionesRecoleccionElemento);
          element.transacciones = element.transacciones.filter((elementTra:any) => elementTra.tipoTransaccion != 'Recolección');
          element.longitud = element.transacciones.length;
        });
        break;
    }

    console.warn(this.dataExportarExcel);
    console.warn('Recolecciones recuperadas');
    console.warn(this.transaccionesRecolecciones);
    this.sumatoriaTotalTransacciones();

  }

  guardarTransaccionesAc(model:any []) {
    this._show_spinner = true;
    this.conttransaccion = true;
    this.transacciones.GuardarTransaccionesAcreditadas(model).subscribe({
       next: (x) => {
         console.warn('GUARDADO!');
         Toast.fire({ icon: 'success', title: 'Transacciones generadas, en espera de acreditación ', position: 'center' });
       },
       error: (e) => {
         console.error(e);
         this._show_spinner    = false;
         Toast.fire({ icon: 'error', title: 'Algo ha pasado, no hemos podido generar la acreditación ' });
       },
       complete: () => {
         this._show_spinner    = false;
         this.conttransaccion  = false;
         this.limpiar();
       },
    });
  }

  limpiar() {
    this.countTransaction = 0;
    this.validExportExcel = true;
    this.conttransaccion  = false;
    this.porcentaje       = 0;
    this.maquinasEscogidasDialog = [];
    this.dataExportarExcel = [];
    this.maquinasEscogidasDialog = [];
    this.dataExportarExcelGhost = [];
    this.sumatoriaTransacciones = 0;
    this.exportdateform.controls['acreditada'].enable();
    this._cancel_button = false;
    this.dis_exp_excel = true;
    this.listaDataExportExcelNewFormat = [];
    this.cantidadTransacciones = 0;
    this.transac.controls['recolecciones'].enable();
    this.exportdateform.controls['dateini'].enable();
    this.exportdateform.controls['datefin'].enable();
    this.exportdateform.controls['horaini'].enable();
    this.exportdateform.controls['horafin'].enable();
    this.exportdateform.controls['codigoClienteidFk'].enable();
    this.disbutton_obtener = false;
  }

  obtenerTransacTabla() {
    
    let x = 0;
    
    // opcion 2 acreitada
    // opcion 1 general

    if ( this.exportdateform.controls['acreditada'].value ) x = 2;
    else x = 1;
    if( this.dataExportarExcel.length > 0 ) {
      this._show_spinner = true;
      this.dataExportarExcel.filter( (element:any) => {

        this.obterSaldoTransac(element.nserie);

        let modelRange:any = {
          "tipo":        x,
          "Machine_Sn":  element.nserie,
          "FechaInicio": this.exportdateform.controls['dateini'].value + ' ' + this.exportdateform.controls['horaini'].value,
          "FechaFin":    this.exportdateform.controls['datefin'].value + ' ' + this.exportdateform.controls['horafin'].value
        }
        this.transacciones.filtroTransaccionesRango(modelRange).subscribe({
            next: (z) => {
              element.transacciones = z;
              element.longitud = element.transacciones.length;
              this._show_spinner = false;
            }, error: (e) => {
              this._show_spinner = false;
              console.error(e);
            }, complete: () => {
              this.sumatoriaTotalTransacciones();
            }
        })

      });

    }

  }

  modelDataSaldo: any = [];
  obterSaldoTransac( machineSn:any ) {
    this.transacciones.ObtenerEquiposSaldo(machineSn).subscribe({
      next: (x) => {
        this.modelDataSaldo = x;
        console.log(this.modelDataSaldo);
      }
    })
  }

  cantidadTransacciones: number = 0;
  sumatoriaTotalTransacciones() {
    this.cantidadTransacciones  = 0;
    this.sumatoriaTransacciones = 0;
    // console.log(this.transac.controls['recolecciones'].value)
    switch(this.transac.controls['recolecciones'].value) {
      case false:
          console.table(false);
          this.dataExportarExcel.filter((element: any) => {
            if( element.transacciones != null || element.transacciones != undefined ) {
              element.transacciones = element.transacciones.filter( (x:any) => x.tipoTransaccion !== 'Recolección'  );
              element.longitud = element.transacciones.length;
              element.transacciones.filter((y:any) => {
                if( y.total == null || y.total == undefined ) y.total = 0;
                this.cantidadTransacciones += y.total;
              })
              this.sumatoriaTransacciones += element.longitud;
            }
          });
          this.transac.controls['recolecciones'].disable()
          break;
        case true:
          console.table(true);
          this.dataExportarExcel.filter((element: any) => {
          element.transacciones.filter( (x:any) => {              
              console.log(element.transacciones.length)
              if( x.total == null || x.total == undefined ) x.total = 0;
              this.cantidadTransacciones += x.total;
          });
          console.log(element);
          this.sumatoriaTransacciones += element.longitud;
          });
          console.log(this.dataExportarExcel);
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
        console.warn(elementTra);
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
          console.error(e);
          this._show_spinner = false;
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
  
      // Calcula la diferencia en días
      let diferencia = Math.floor((fechaFinal.getTime() - fechaInicial.getTime()) / (1000 * 60 * 60 * 24));
  
      if (diferencia == 1) {
        // //alert'Existe un día de rango');
        this.mostrarCiclo = true;
      }
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
    console.warn(this.dataExportarExcel);
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
            // Verificar si la hora de la transacción está en el rango especificado
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
    console.warn(this.exportdateform.controls['ciclo'].value)
    switch(this.exportdateform.controls['ciclo'].value) {
      case false:
        this.dataExportarExcel = this.filtrarPorRangoDeHoras(this.dataExportarExcel, horaInicial, horaFinal);
        break;
      case true:
        this.filtrarPorRangoDeFechasYHoras();
        break;
    }
  }

}
