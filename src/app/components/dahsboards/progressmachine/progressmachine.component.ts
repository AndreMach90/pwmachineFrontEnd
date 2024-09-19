import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Swal from 'sweetalert2';
import { MonitoreoService } from '../monitoreo-equipos/services/monitoreo.service';

@Component({
  selector:    'app-progressmachine',
  templateUrl: './progressmachine.component.html',
  styleUrls:   ['./progressmachine.component.scss']
})

export class ProgressmachineComponent implements OnChanges {
  @Input() listenNserie!:     any;
  listaEsquipo:               any = [];
  listaEsquipoGhost:          any = [];
  listaIndicadores:           any = [];
  a:                          number = 0;
  b:                          number = 0;
  c:                          number = 0;
  count:                      number = 1;
  porcentaje:                 number = 0;
  countPorcentajealert:       number = 1;
  countPorcentajealertAs:     number = 1;
  porcentajeAs:               number = 0;
  _show_spinner:              boolean = false;
  textoCapacidadBilletes:     string = 'Vacío...';
  colorBarProgressBilletes:   string = 'progress-bar bg-success text-light';
  colorBarProgressBilletesAs: string = 'progress-bar bg-success text-light';
  
  constructor( private monitoreo: MonitoreoService ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if( changes ) this.obtenerIndicadores(this.listenNserie);
  }

  obtenerIndicadores(nserie: string) {
    this._show_spinner = true;
    this.listaEsquipo = [];
    this.listaEsquipoGhost = [];
      this.monitoreo.obtenerIndicadores(nserie, 2).subscribe({
      next: (equipo) => {
        this.listaEsquipo = equipo;
        this.listaEsquipoGhost = equipo;
        this._show_spinner = false;
      }, error: (e) => {
        this._show_spinner = false;
      }, complete: () => {
        this.listaEsquipo.filter((element:any) => {
          if( element.estadoPing == 0 ) {
            this.a = element.estadoPing;
            this.count ++;
            localStorage.setItem( 'ping'+this.count+'-'+nserie+'-'+element.serieEquipo, element.estadoPing );
            let a: any = localStorage.getItem( 'ping1-'+nserie+'-'+element.serieEquipo );
            let b: any = localStorage.getItem( 'ping2-'+nserie+'-'+element.serieEquipo );
            let c: any = localStorage.getItem( 'ping3-'+nserie+'-'+element.serieEquipo );
            if( a == 0 && b ==0 && c == 0  ) {
              element.color      = 'orangered';
              element.mensaje    = 'Se ha perdido conexión';
              element.colorTexto = 'whitesmoke';
            }
            if( this.count > 3 ) {
              localStorage.removeItem( 'ping1-'+nserie+'-'+element.serieEquipo );
              localStorage.removeItem( 'ping2-'+nserie+'-'+element.serieEquipo );
              localStorage.removeItem( 'ping3-'+nserie+'-'+element.serieEquipo );
              this.count = 0;
            }
          } else if ( element.estadoPing == 1 ) {
            element.color      = '#16C427';
            element.mensaje    = 'Conexión establecida';
            element.colorTexto = 'whitesmoke';
            this.b = element.estadoPing;
            localStorage.removeItem ('ping1-'+nserie+'-'+element.serieEquipo);
            localStorage.removeItem ('ping2-'+nserie+'-'+element.serieEquipo);
            localStorage.removeItem ('ping3-'+nserie+'-'+element.serieEquipo);
          } else if ( element.estadoPing == 2 ) {
            element.color      = 'yellow';
            element.mensaje    = 'Latencia';
            element.colorTexto = 'black';
            this.c = element.estadoPing;
          }
          this.calcularPorcentaje( element.capacidadBilletes, element.capacidadMaximaBilletes );
          this.calcularPorcentajeAs( element.totalAsegurado, element.totalMaxAsegurado );
          if ( element.marca == 1 || element.modelo == 1 ) {
            element.imagen = 'http://192.168.100.12:5208/equipos/KD-20.png';
          }
          if ( element.totalAsegurado == null || element.totalAsegurado == undefined ) element.totalAsegurado = 0;
        })
      }
    }) 
  }

  calcularPorcentajeAs( capacidadBilletes: number, capacidadMaximoBilletes: number ) {
    this.porcentajeAs = ( capacidadBilletes / capacidadMaximoBilletes ) * 100;
    if ( this.porcentajeAs <= 30 ) {
      this.colorBarProgressBilletesAs = 'progress-bar bg-success text-light';
    } else if ( this.porcentajeAs > 30 && this.porcentajeAs <= 49 ) {
      this.colorBarProgressBilletesAs = 'progress-bar bg-success text-light';
    } else if ( this.porcentajeAs > 49 && this.porcentajeAs <= 90 ) {
      this.colorBarProgressBilletesAs = 'progress-bar bg-warning text-dark';
    } else if ( this.porcentajeAs > 90 ) {
      this.colorBarProgressBilletesAs = 'progress-bar bg-danger text-light';
      if( this.countPorcentajealertAs == 1) {
        this.countPorcentajealertAs = this.countPorcentajealertAs - 1;
        Swal.fire(
          'Advertencia:',
          'Haz llegando al límite de la capacidad asegurada del equipo.',
          'error'
        )
      } else if ( this.countPorcentajealert == 0 ) {
        this.countPorcentajealert = 0
      }
    }
  }

  calcularPorcentaje( capacidadBilletes: number, capacidadMaximoBilletes: number ) {
    this.porcentaje = ( capacidadBilletes / capacidadMaximoBilletes ) * 100;
    if ( this.porcentaje <= 30 ) {
      this.colorBarProgressBilletes = 'progress-bar bg-sucess text-light';
    } else if ( this.porcentaje > 30 && this.porcentaje <= 49 ) {
      this.colorBarProgressBilletes = 'progress-bar bg-success text-light';
    } else if ( this.porcentaje > 49 && this.porcentaje <= 90 ) {
      this.colorBarProgressBilletes = 'progress-bar bg-warning text-dark';
    } else if ( this.porcentaje > 90 ) {
      this.colorBarProgressBilletes = 'progress-bar bg-danger text-light';      
      if( this.countPorcentajealert == 1) {
        this.countPorcentajealert = this.countPorcentajealert - 1;
        Swal.fire(
          'Advertencia:',
          'Haz llegando al límite de la capacidad del equipo.',
          'error'
        )
      } else if ( this.countPorcentajealert == 0 ) {
        this.countPorcentajealert = 0
      }
    }
  }
}
