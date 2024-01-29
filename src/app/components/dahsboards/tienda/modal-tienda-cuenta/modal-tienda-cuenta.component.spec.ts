import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTiendaCuentaComponent } from './modal-tienda-cuenta.component';

describe('ModalTiendaCuentaComponent', () => {
  let component: ModalTiendaCuentaComponent;
  let fixture: ComponentFixture<ModalTiendaCuentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalTiendaCuentaComponent]
    });
    fixture = TestBed.createComponent(ModalTiendaCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
