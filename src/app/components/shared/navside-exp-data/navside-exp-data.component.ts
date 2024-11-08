import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Environments } from '../../environments/environments';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navside-exp-data',
  templateUrl: './navside-exp-data.component.html',
  styleUrls: ['./navside-exp-data.component.scss']
})
export class NavsideExpDataComponent implements OnInit {
  @Output() sendModule: EventEmitter<string> = new EventEmitter<string>();
  modimagen:      any = this.env.apiUrlIcon() + 'modulos.png';
  regresarIcon:   any = this.env.apiUrlIcon() + 'regresar.png';
  _show_spinner:  boolean = false;
  estadow:        boolean = true;
  width_menu:     any = '250px';
  height_app:     any = '90vh';
  
  modulosNavSide = [
    {
      nombre: "Exportar datos",
      icon: this.env.apiUrlIcon() + "export-data.png"
    },
    {
      nombre: "Historial de Acreditación",
      icon: this.env.apiUrlIcon() + "acreditacion.png"
    }
  ]

  constructor(private env: Environments, private router: Router) {}

  ngOnInit(): void { }

  controlWidth() {
    switch( this.estadow ) {
      case true:
        this.width_menu = '70px';
        this.height_app = '100vh';
        this.estadow    = false;
        break;
      case false:
        this.width_menu = '250px';
        this.estadow    = true;
        this.height_app = '90vh';
        break;
    }
  }

  enviarModulos(data:any) {
    let nombreModulo = data.nombre;
    this.sendModule.emit(nombreModulo);
  }

  regresar() {
    this._show_spinner = true;
    setTimeout(() => {this.router.navigate(['/dashboard']), this._show_spinner = false }, 1000);
  }
}
