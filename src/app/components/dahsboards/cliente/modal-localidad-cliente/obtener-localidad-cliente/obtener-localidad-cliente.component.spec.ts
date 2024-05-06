import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObtenerLocalidadClienteComponent } from './obtener-localidad-cliente.component';

describe('ObtenerLocalidadClienteComponent', () => {
  let component: ObtenerLocalidadClienteComponent;
  let fixture: ComponentFixture<ObtenerLocalidadClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObtenerLocalidadClienteComponent]
    });
    fixture = TestBed.createComponent(ObtenerLocalidadClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
