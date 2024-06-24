import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Environments } from 'src/app/components/environments/environments';
import { FiltrotransaccionalComponent } from '../filtrotransaccional.component';
import { ModalDataEquiposComponent } from '../modal-data-equipos/modal-data-equipos.component';
import { ClientesService } from '../../../cliente/services/clientes.service';
import { TiendaService } from '../../../tienda/services/tienda.service';
import { MonitoreoService } from '../../../monitoreo-equipos/services/monitoreo.service';
import { TransaccionesTiendaService } from '../../../monitoreo-equipos/modal/services/transacciones-tienda.service';

@Component({
  selector: 'app-modal-config-excel',
  templateUrl: './modal-config-excel.component.html',
  styleUrls: ['./modal-config-excel.component.scss']
})
export class ModalConfigExcelComponent implements OnInit {
  checktiendas:boolean= false;
  choicetiendas:boolean= false;
  _show_spinner:boolean = false;
  // public exportconForm = new FormGroup({

  // })

  public exportdateform = new FormGroup({
    dateini:   new FormControl(''),
    datefin:   new FormControl(''),
    horaini:   new FormControl(''),
    horafin:   new FormControl(''),
    codigoClienteidFk:  new FormControl(),
    codigoTiendaidFk:   new FormControl()
  })

  transac: FormGroup;

  constructor( private formBuilder: FormBuilder, 
               private clienteserv: ClientesService,
               private tiendaservs: TiendaService,
               private monitoreo: MonitoreoService,
               private transacciones: TransaccionesTiendaService,
               public dialog: MatDialog,
              //  public dialogRef: MatDialogRef<FiltrotransaccionalComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any, private env: Environments ) { 

                this.transac = this.formBuilder.group({
                  manualTransactions: true,
                  automaticTransactions: true,
                  recolecciones: true
                });

               }

  dataTablefilter: any = [];
  ngOnInit(): void {
    // this.dataTablefilter = this.data;
    // //// console.table(this.dataTablefilter);
    this.obtenerCliente();
  }

  onSubmitHora() {}
  onSubmitDate() {}

  submitTransacFilter() {
    ////// console.log(this.transac.value);
  }

  dataExportarExcel: any = [];
  dataExportarExcelGhost: any = [];
  openDataEquiposDialog() {
    // this.dataExportarExcel      = [];
    // this.dataExportarExcelGhost = [];
    let arr: any = []
    if( this.dataExportarExcel ) {
      arr = {
        codigocliente: this.exportdateform.controls['codigoClienteidFk'].value,
        codigoTienda: this.exportdateform.controls['codigoTiendaidFk'].value,
        equiposExistentes: this.dataExportarExcel
      }
    } else {
      arr = {
        codigocliente: this.exportdateform.controls['codigoClienteidFk'].value,
        codigoTienda: this.exportdateform.controls['codigoTiendaidFk'].value,
        equiposExistentes: null
      }
    }

    const dialogRef = this.dialog.open( ModalDataEquiposComponent, {
      height: 'auto',
      width:  '300px',
      data:   arr, 
    });

    dialogRef.afterClosed().subscribe( (result:any) => {      
      if( result ) {         
        result.filter( (element:any) => {
          this.dataExportarExcel.push(element);
          this.dataExportarExcelGhost.push(element);
          ////// console.log(this.dataExportarExcel)
        });
      }
      this.obtenerTransacTabla();
    });

  }

  obetenerDetalleDeEquipos() {
    // this.monitoreo.obtenerDetalleEquipos(  )
  }
  
  clienteListaGhost: any = [];
  clientelista:any = []
  obtenerCliente() {
    this.clientelista = [];
    this._show_spinner = true;
    this.clienteserv.obtenerCliente().subscribe({
      next: (cliente) => {
        this.clienteListaGhost = cliente;
        this._show_spinner = false;
      }, error: (e) => {
        this._show_spinner = false;
        // console.error(e);
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

  idcliente: number = 0;
  obtenerIDCLiente() {

    if ( this.exportdateform.controls['codigoClienteidFk'].value == undefined || this.exportdateform.controls['codigoClienteidFk'].value == null ) {
      ////// console.warn('No hay un id');
      this.idcliente = this.clientelista[0].id;
    }
    else {
      this.idcliente = this.exportdateform.controls['codigoClienteidFk'].value;
    }

  }

  tiendalista: any = [];
  tiendaListaGhost: any = [];
  obtenerTiendas() {
    this.tiendalista = [];
    this.tiendaListaGhost = [];
    this.tiendaservs.obtenerTiendas().subscribe({
      next: (tienda) => {
        this.tiendaListaGhost = tienda;
      }, complete: () => {
        this.obtenerIDCLiente();
        this.tiendaListaGhost.filter((element:any) => {
          if( element.codigoClienteidFk == this.idcliente ) {
            this.tiendalista.push(element);
          }
        })
      }
    })
  }


  obtenerTransacTabla() {
    this._show_spinner = true;
    this.dataExportarExcel.filter( (element:any) => {
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
          // console.error(e);
          this._show_spinner = false;
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
          // console.error(e);
          this._show_spinner = false;
        }
      })
    })
  }

  recuperarData() {
    this.respladoDataTran();
    const datenow = new Date();
    this.exportdateform.controls['dateini'].setValue(datenow.toDateString());
    this.exportdateform.controls['datefin'].setValue(datenow.toDateString());
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
      
      return element;

    });
    } else {
      // console.error("Ingrese ambas fechas para filtrar.");
    }

    ////// console.warn(this.dataExportarExcel);

  }

  filtrarPorRangoDeHoras(data: any, horaInicial: string, horaFinal: string): any {
    // Iterar sobre cada elemento en el array
    return data.map((element: any) => {
        // Filtrar las transacciones dentro del rango de horas
        element.transacciones = element.transacciones.filter((transaccion: any) => {
            const horaTransaccion = transaccion.hora;

            // Verificar si la hora de la transacción está en el rango especificado
            return this.estaEnRangoDeHoras(horaTransaccion, horaInicial, horaFinal);
        });
        return element;
    });
  }

  estaEnRangoDeHoras(hora: string, horaInicial: string, horaFinal: string): boolean {
      // Convertir las horas a objetos Date para facilitar la comparación
      const horaTransaccion = new Date(`1970-01-01T${hora}`);
      const horaInicio      = new Date(`1970-01-01T${horaInicial}`);
      const horaFin         = new Date(`1970-01-01T${horaFinal}`);
      // Verificar si la hora de la transacción está en el rango especificado
      return horaTransaccion >= horaInicio && horaTransaccion <= horaFin;
  }
  
  filtrarPorHoras() {
    // Supongamos que tienes las variables horaInicial y horaFinal desde tu formulario
    const horaInicial:any = this.exportdateform.controls['horaini'].value;
    const horaFinal:any = this.exportdateform.controls['horafin'].value;
    // Llamar a la función de filtrado por rango de horas
    this.dataExportarExcel = this.filtrarPorRangoDeHoras(this.dataExportarExcel, horaInicial, horaFinal);
  }

  

}
