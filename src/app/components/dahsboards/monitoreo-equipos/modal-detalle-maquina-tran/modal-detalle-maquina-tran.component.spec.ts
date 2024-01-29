import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleMaquinaTranComponent } from './modal-detalle-maquina-tran.component';

describe('ModalDetalleMaquinaTranComponent', () => {
  let component: ModalDetalleMaquinaTranComponent;
  let fixture: ComponentFixture<ModalDetalleMaquinaTranComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDetalleMaquinaTranComponent]
    });
    fixture = TestBed.createComponent(ModalDetalleMaquinaTranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
