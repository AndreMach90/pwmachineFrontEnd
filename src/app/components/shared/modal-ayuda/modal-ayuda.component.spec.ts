import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAyudaComponent } from './modal-ayuda.component';

describe('ModalAyudaComponent', () => {
  let component: ModalAyudaComponent;
  let fixture: ComponentFixture<ModalAyudaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAyudaComponent]
    });
    fixture = TestBed.createComponent(ModalAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
