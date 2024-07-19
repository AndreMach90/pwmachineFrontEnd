import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClientesService } from '../cliente/services/clientes.service';
import { MonitoreoIndividualService } from './services/monitoreo-individual.service';

@Component({
  selector: 'app-monitorear-equipo',
  templateUrl: './monitorear-equipo.component.html',
  styleUrls: ['./monitorear-equipo.component.scss']
})
export class MonitorearEquipoComponent implements OnInit {

  _show_spinner: boolean = false;
  clientelista: any = [];
  clienteListaGhost: any = [];
  listaEquipo: any = [];
  listaEquipoGhost: any = [];
  showEquipos: boolean = false;

  public tiendaForm = new FormGroup({
    codigoClienteidFk: new FormControl(''),
    codigoEquipo: new FormControl(''),
    filterEquipo: new FormControl('')
  });

  ngOnInit(): void {
    this.obtenerCliente()    
  }

  constructor(private clienteserv: ClientesService, private mequipo: MonitoreoIndividualService ) {}


  obtenerEquipos() {

    let cli = this.tiendaForm.controls['codigoClienteidFk'].value;

    if (cli) {
      this.mequipo.obtenerEquiposCliente(cli).subscribe({
        next: (x:any) => {
          this.listaEquipo      = x;
          this.listaEquipoGhost = x;
          console.warn(this.listaEquipo);
        }, error: (e) => {
          console.error(e);
        }, complete: () => {
          this.showEquipos = true;
        }
      })
    }

  }

  obtenerCliente() {
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
        });
      },
    });
  }

  filterEquipos () {

    let filter: any = this.tiendaForm.controls['filterEquipo'].value;

    console.warn(filter)

    this.listaEquipo = this.listaEquipoGhost.filter( (item:any) =>
      item.serieEquipo.toLowerCase().includes(filter.toLowerCase()) ||
      item.nombreTienda.toLowerCase().includes(filter.toLowerCase())
    );
    
  }

}
