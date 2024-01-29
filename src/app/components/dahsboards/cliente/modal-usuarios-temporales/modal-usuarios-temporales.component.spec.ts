import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUsuariosTemporalesComponent } from './modal-usuarios-temporales.component';

describe('ModalUsuariosTemporalesComponent', () => {
  let component: ModalUsuariosTemporalesComponent;
  let fixture: ComponentFixture<ModalUsuariosTemporalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalUsuariosTemporalesComponent]
    });
    fixture = TestBed.createComponent(ModalUsuariosTemporalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
