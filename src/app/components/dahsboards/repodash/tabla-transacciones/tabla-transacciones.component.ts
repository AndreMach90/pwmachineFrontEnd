import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';
import { TransaccionesTiendaService } from '../../monitoreo-equipos/modal/services/transacciones-tienda.service';
import { ServicesSharedService } from 'src/app/components/shared/services-shared/services-shared.service';

@Component({
  selector: 'app-tabla-transacciones',
  templateUrl: './tabla-transacciones.component.html',
  styleUrls: ['./tabla-transacciones.component.scss']
})

export class TablaTransaccionesComponent implements OnInit, OnChanges {

  ascendente:               boolean = true;
  listaTransacciones:           any = [];
  sumatoriaTotales:          number = 0;
  manual_Deposito_Coin_100:  number = 0;
  manual_Deposito_Coin_50:   number = 0;
  manual_Deposito_Coin_20:   number = 0;
  manual_Deposito_Coin_10:   number = 0;
  manual_Deposito_Coin_5:    number = 0;
  manual_Deposito_Coin_1:    number = 0;
  deposito_Bill_100:         number = 0;
  deposito_Bill_50:          number = 0;
  deposito_Bill_20:          number = 0;
  deposito_Bill_10:          number = 0;
  deposito_Bill_5:           number = 0;
  deposito_Bill_2:           number = 0;
  deposito_Bill_1:           number = 0;


  sumatoriaTotalesLastRecol: number = 0;

  @Input() transaccionesDataTabla: any = [];
  @Input() listenNserie!:          any;

  @Input() transaccionAutoHub:       any = [];
  @Input() transaccionManualHub:     any = [];
  @Input() transaccionRecollHub:     any = [];

  @Input() tipoFiltro: any;

  startDate: Date = new Date();
  endDate:   Date = new Date();

  delete:   any = this.env.apiUrlIcon() + 'delete.png';
  edit:     any = this.env.apiUrlIcon() + 'edit.png';
  crear:    any = this.env.apiUrlIcon() + 'accept.png';
  cancel:   any = this.env.apiUrlIcon() + 'cancel.png';
  search:   any = this.env.apiUrlIcon() + 'search.png';
  calendar: any = this.env.apiUrlIcon() + 'calendar.png';
  excel:    any = this.env.apiUrlIcon() + 'excel.png';
  ordenar:  any = this.env.apiUrlIcon() + 'ordenar.png';

  _edit_btn:      boolean = false;
  _delete_show:   boolean = true;
  _edit_show:     boolean = true;
  _create_show:   boolean = true;
  _form_create:   boolean = true;
  calendar_show:  boolean = false;
  _action_butto:  string  = 'Crear';
  _show_spinner:  boolean = false;
  _icon_button:   string  = 'add';
  _cancel_button: boolean = false;
  selectedTime:   any;
  primary:        any;
  secondary:      any;
  secondary_a:    any;
  secondary_b:    any;
  home:           any;
  nombreTienda:   string  = '';
  finsumat:       boolean = false;

  lanzadorFiltro: boolean = false;

  constructor(private env: Environments) {}

  ngOnInit(): void {
    this.startDate      = new Date();
    this.endDate        = new Date();
    this.primary        = this.env.appTheme.colorPrimary;
    this.secondary      = this.env.appTheme.colorSecondary_C;
    this.secondary_a    = this.env.appTheme.colorSecondary_A;
    this.secondary_b    = this.env.appTheme.colorSecondary_B;
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if(changes) {

      if ( this.transaccionAutoHub.length > 0 ) {
        if ( this.listenNserie == this.transaccionAutoHub[0].machine_Sn ) {             

            console.log('HUB AUTO');
            console.log(this.transaccionAutoHub);

             this.listaTransacciones.unshift( this.transaccionAutoHub[0] );
             if(this.tipoFiltro) this.listaTransacciones.splice( this.listaTransacciones.length - 1, 1 );

             if(this.transaccionAutoHub[0].acreditada == 'A') {
              this.transaccionAutoHub[0].colorRow = '#D8F1EC';
             }  
             
             if(this.transaccionAutoHub[0].acreditada == 'E') {
                this.transaccionAutoHub[0].colorRow = '#F1F090';
             }  

             else if(this.transaccionAutoHub[0].acreditada == 'N') {
              this.transaccionAutoHub[0].colorRow = '#F1E3D8';
             }  

             this.transaccionAutoHub   = [];
             this.transaccionManualHub = [];
             this.transaccionRecollHub = [];
             this.finsumat = false;
        }
      }

      if (this.transaccionManualHub.length > 0) {
        if ( this.listenNserie == this.transaccionManualHub[0].machine_Sn ) {
             this.listaTransacciones.unshift( this.transaccionManualHub[0] );
             if(this.tipoFiltro) this.listaTransacciones.splice( this.listaTransacciones.length - 1, 1 );     
             
             if(this.transaccionManualHub[0].acreditada == 'A') {
              this.transaccionManualHub[0].colorRow = '#D8F1EC';
             }  
             
             if(this.transaccionManualHub[0].acreditada == 'E') {
                this.transaccionManualHub[0].colorRow = '#F1F090';
             }  

             else if(this.transaccionManualHub[0].acreditada == 'N') {
              this.transaccionManualHub[0].colorRow = '#F1E3D8';
             }

             this.transaccionManualHub = [];
             this.transaccionAutoHub   = [];
             this.transaccionRecollHub = [];
             this.finsumat             = false;
        }
      }

      if (this.transaccionRecollHub.length > 0) {
        if ( this.listenNserie == this.transaccionRecollHub[0].machine_Sn ) {
             this.listaTransacciones.unshift( this.transaccionRecollHub[0] );
             if(this.tipoFiltro) this.listaTransacciones.splice( this.listaTransacciones.length - 1, 1 );
             if(this.transaccionRecollHub[0].acreditada == 'R') {
              this.transaccionRecollHub[0].colorRow = '#F1C590';
             }  
             this.finsumat = true;
             setTimeout( () => {
               this.sumatoriaTotalesLastRecol = 0;
             }, 1000);
          }
      }

      this.listaTransacciones = this.transaccionesDataTabla;

      this.transaccionesDataTabla.filter( (list:any) => {
        if(list.acreditada == 'A') {
            list.colorRow = '#D8F1EC';
         }         
         if(list.acreditada == 'E') {
            list.colorRow = '#F1F090';
         }
         else if(list.acreditada == 'N') {
            list.colorRow = '#F1E3D8';
         }
         else if(list.acreditada == 'R') {
            list.colorRow = '#F1C590';
         }
      })

      this.listaTransacciones.filter( ( element:any ) => {
        element.colorRepetido = '#FFFAE3';
        if( element.repetido > 1 ) {
          element.colorRepetido = '#F7C1C1 !important';
        }
      })

      this.sumatoriaTotal();

    }

  }

  // eliminarObjetosDuplicados(modelo: any[]) {
  //   // Creamos un conjunto (Set) para almacenar objetos únicos
  //   let conjuntoUnico = new Set();
    
  //   // Filtramos el modelo para eliminar duplicados
  //   let modeloFiltrado = modelo.filter(obj => {
    
  //     // Convertimos cada objeto a una cadena JSON y lo añadimos al conjunto
  //     let objetoString = JSON.stringify(obj);
    
      
  //     // Si el conjunto ya contiene la cadena, el objeto es duplicado
  //     // Si no, lo añadimos al conjunto y lo incluimos en el modelo filtrado
  //     if (conjuntoUnico.has(objetoString)) {
    
  //       return false; // Objeto duplicado, no lo incluimos en el resultado
  //     } else {
  //       conjuntoUnico.add(objetoString);
    
  //       return true; // Objeto no duplicado, lo incluimos en el resultado
  //     }
  //   });
    
  //   console.log(6)
    
  //   this.listaTransacciones = [];
  //   console.log(7)
    
  //   this.listaTransacciones = modeloFiltrado;
  //   console.log(8)
  //   console.log(this.listaTransacciones);    

  // }

  sumatoriaTotal() {

    this.sumatoriaTotales          = 0;
    this.sumatoriaTotalesLastRecol = 0;
    this.manual_Deposito_Coin_100  = 0;
    this.manual_Deposito_Coin_50   = 0;
    this.manual_Deposito_Coin_20   = 0;
    this.manual_Deposito_Coin_10   = 0;
    this.manual_Deposito_Coin_5    = 0;
    this.manual_Deposito_Coin_1    = 0;
    this.deposito_Bill_100         = 0;
    this.deposito_Bill_50          = 0;
    this.deposito_Bill_20          = 0;
    this.deposito_Bill_10          = 0;
    this.deposito_Bill_5           = 0;
    this.deposito_Bill_2           = 0;
    this.deposito_Bill_1           = 0;

    this.listaTransacciones.filter( (element:any) => {

      if( element.tipoTransaccion != "Recolección" ) {

        this.sumatoriaTotales         += element.total; 
        this.manual_Deposito_Coin_100 += element.manual_Deposito_Coin_100; 
        this.manual_Deposito_Coin_50  += element.manual_Deposito_Coin_50; 
        this.manual_Deposito_Coin_20  += element.manual_Deposito_Coin_25; 
        this.manual_Deposito_Coin_10  += element.manual_Deposito_Coin_10; 
        this.manual_Deposito_Coin_5   += element.manual_Deposito_Coin_5; 
        this.manual_Deposito_Coin_1   += element.manual_Deposito_Coin_1; 
        this.deposito_Bill_100        += element.deposito_Bill_100; 
        this.deposito_Bill_50         += element.deposito_Bill_50; 
        this.deposito_Bill_20         += element.deposito_Bill_20; 
        this.deposito_Bill_10         += element.deposito_Bill_10; 
        this.deposito_Bill_5          += element.deposito_Bill_5; 
        this.deposito_Bill_2          += element.deposito_Bill_2; 
        this.deposito_Bill_1          += element.deposito_Bill_1;

      }

      if ( element.fechaRecoleccion == null &&
           element.tipoTransaccion != "Recolección" ) {
           this.sumatoriaTotalesLastRecol += Number(element.total.toFixed(2));
      }

    })

  }
  
  alternarOrden() {
    this.ascendente = !this.ascendente;
    this.ordenarPorTransaccionNo(this.ascendente);
  }

  ordenarPorTransaccionNo(ascendente: boolean) {
    this.listaTransacciones.sort( (a:any, b:any) => {
      if (ascendente) { return a.transaccion_No - b.transaccion_No; }
      else { return b.transaccion_No - a.transaccion_No; }
    });
  }

}
