import { ComponentFixture, TestBed } from '@angular/core/testing';

import ModalTransaccionesComponent from './modal-transacciones.component';

describe('ModalTransaccionesComponent', () => {
  let component: ModalTransaccionesComponent;
  let fixture: ComponentFixture<ModalTransaccionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalTransaccionesComponent]
    });
    fixture = TestBed.createComponent(ModalTransaccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
