import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDataEquiposComponent } from './modal-data-equipos.component';

describe('ModalDataEquiposComponent', () => {
  let component: ModalDataEquiposComponent;
  let fixture: ComponentFixture<ModalDataEquiposComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDataEquiposComponent]
    });
    fixture = TestBed.createComponent(ModalDataEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
