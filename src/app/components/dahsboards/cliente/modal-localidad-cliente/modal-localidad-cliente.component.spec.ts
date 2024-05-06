import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLocalidadClienteComponent } from './modal-localidad-cliente.component';

describe('ModalLocalidadClienteComponent', () => {
  let component: ModalLocalidadClienteComponent;
  let fixture: ComponentFixture<ModalLocalidadClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalLocalidadClienteComponent]
    });
    fixture = TestBed.createComponent(ModalLocalidadClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
