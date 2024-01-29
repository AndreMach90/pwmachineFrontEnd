import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GraficasService } from './services/graficas.service';
import Chart from 'chart.js/auto';
import { setInterval } from 'timers';

@Component({
  selector: 'app-collectiongraph',
  templateUrl: './collectiongraph.component.html',
  styleUrls: ['./collectiongraph.component.scss']
})

export class CollectiongraphComponent implements OnInit, OnChanges {

  selectedDays: number = 3;
  dates: { dia: string, fechacompleta: string }[] = [];
  selectedDate: any;

  _show_spinner: boolean = false;
  @Input() datosgenerales:           any = [];
  @Input() transaccionAutoHub:       any = [];
  @Input() transaccionManualHub:     any = [];
  @Input() transaccionRecollHub:     any = [];
  @Input() transaccionesDataGrafica: any = [];
  @Input() listenNserie!:            any;

  @Input() tipoDeFiltroFechas: any;
  chart: any; 
  inversionRealizada = false;

  constructor( private graf: GraficasService ) {
    this.getDates(this.selectedDays);
    this.selectedDate = this.dates[2];
  }

  ngOnInit() { }

  seleccionarFecha(date: { dia: string, fechacompleta: string }) {
    this.recuperarDatos();
    this.selectedDate = date; 
    this.validarDiaEscogido(); 
  }

  getDates(selectedDays: number) {
    this.dates = [];
    const currentDate = new Date();
    for (let i = 0; i < selectedDays; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      const dayOfWeek = this.getDayOfWeek(date.getDay());
      const formattedDate = this.formatDate(date);
      this.dates.push({ dia: dayOfWeek, fechacompleta: formattedDate });
    }
  }  

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  getDayOfWeek(day: number): string {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return daysOfWeek[day];
  }

  valDateDay: boolean = true;
  tipoFiltroDateVal(value:any) {
    switch(value) {
      case true:
        this.valDateDay = false;
        break;
      case false:
        this.valDateDay = true;
        break;
      default:
        this.valDateDay = true;
        break;
    }
  }

  tienda:any;
  cliente:any;
  reverseOn: boolean = true;
  ngOnChanges(changes: SimpleChanges) {

    if (changes) {
      
      this.tipoFiltroDateVal(this.tipoDeFiltroFechas);

      if (this.transaccionAutoHub.length > 0) {
        if ( this.listenNserie == this.transaccionAutoHub[0].machine_Sn ) {
          this.transaccionesDataGrafica.push(this.transaccionAutoHub[0]);
          this.transaccionAutoHub   = [];
          this.transaccionManualHub = [];
          this.transaccionRecollHub = [];
        }
      }

      if (this.transaccionManualHub.length > 0) {
        if ( this.listenNserie == this.transaccionManualHub[0].machine_Sn ) {
          this.transaccionesDataGrafica.push(this.transaccionManualHub[0]);
          this.transaccionManualHub = [];
          this.transaccionAutoHub   = [];
          this.transaccionRecollHub = [];
        }
      }

      if (this.transaccionRecollHub.length > 0) {
        if ( this.listenNserie == this.transaccionRecollHub[0].machine_Sn ) {
          this.transaccionesDataGrafica.push(this.transaccionRecollHub[0]);
        }
      }
      this.listaGraf      = this.transaccionesDataGrafica;
      this.listaGrafGhost = this.transaccionesDataGrafica;
      this.collectionGraph();

    }

  }

  readTextAloud(text: string) {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.startsWith('es-'));
    if (spanishVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = spanishVoice;
      utterance.lang = 'es-LA';
      synth.speak(utterance);
    } else {
      console.error('No se encontró una voz en español disponible.');
    }
    
  }

  validarDiaEscogido():any {

      if (!this.selectedDate) {
        return [];
      }

      this.getDates(this.selectedDays);
      const selectedDateString = this.selectedDate.fechacompleta.toString().replace(/-/g, '/');
      this.listaGraf = [];
      this.listaGraf = this.listaGrafGhost.filter((transaction: any) => {
        const transactionDateString = new Date(transaction.fechaTransaccion).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year:  'numeric',
        });
        return transactionDateString === selectedDateString;
      });

    this.collectionGraph();

  }


  recuperarDatos() {
     this.listaGraf = this.transaccionesDataGrafica;
     this.$diasShow = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && event.altKey && event.key === '1') {
      // //alert'ejecutandose')
      this.recuperarDatos();
      // this.filterLastThreeDays(2);
    }
  }

  // filterLastThreeDays( days:number ) {
  //   const currentDate = new Date();
  //   const threeDaysAgo = new Date(currentDate);
  //   threeDaysAgo.setDate(currentDate.getDate() - days);
  //   this.listaGraf = [];
  //   this.listaGraf = this.listaGrafGhost.filter( (element: any) => {
  //     const fechaTransaccion = new Date(element.fechaTransaccion);
  //     return fechaTransaccion >= threeDaysAgo && fechaTransaccion <= currentDate;
  //   });
    
  //   return this.listaGraf

  // }

  $diasShow: boolean = true;
  dataAdd: any = [];
  collectionGraph() {

    if (this.chart) {
      this.chart.destroy();
    }
  
    let year         = new Date().getFullYear();
    
    let fechas:  any = [];
    let totales: any = [];

    // if (this.$diasShow) this.filterLastThreeDays(2); 

    this.listaGraf.filter((element: any) => {
      let fechaActual:     any = element.fechaTransaccion;
      let fechaActualDate: any = fechaActual.toString().split('T');
      fechas.push(fechaActualDate[0].slice(5, 10) + ' : ' + fechaActualDate[1].slice(0, 5));
      totales.push(element.totalRecoleccion);
    });
  
    var listaGrafJS = this.listaGraf;
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [
          {
            label: '',
            data: totales,
            borderColor: 'steelblue',
            fill: true,
            tension: 0,
            animation: false
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Fecha y hora correspondiente al año ' + year,
            },
          },
          y: {
            beginAtZero: true,
            // Modifica la función callback para agregar el símbolo de dólar
            ticks: {
              callback: function (value) {
                return '$' + value;
              }
            }
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
            text: 'Gráfico del total de transacciones',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                var label = context.dataset.label || '';
                if (context.parsed.y !== null) {
                  var transaccion = listaGrafJS[context.dataIndex];
                  label += 'Número de Transacción: ' + transaccion.transaccion_No + ' - \n';
                  label += 'Usuario: ' + transaccion.usuarios_idFk + ' - \n';
                  label += 'Tipo: ' + transaccion.tipoTransaccion + ' - \n';
                  label += 'Total: $' + context.parsed.y + '\n'; // Agrega el símbolo de dólar aquí
                }
                return label;
              },
            },
          },
        },
      },
    });
  }
  
  
  listaGraf:any = [];
  listaGrafGhost:any = [];
  obtenerGraficos(serie:string) {
    this.listaGraf = [];
    this.listaGrafGhost = [];
    this._show_spinner = true;
    this.graf.obtenerGraficaCollection(serie).subscribe({
      next: (xgraf:any) => {
        this.listaGrafGhost = xgraf;
        this.listaGraf      = xgraf;
        this.listaGrafGhost;
        this.listaGraf;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }, complete: () => {
        this.collectionGraph();
        this._show_spinner = false;
      }
    })
  }

}
