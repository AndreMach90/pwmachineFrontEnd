import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosTemporalesMaquinaComponent } from './usuarios-temporales-maquina.component';

describe('UsuariosTemporalesMaquinaComponent', () => {
  let component: UsuariosTemporalesMaquinaComponent;
  let fixture: ComponentFixture<UsuariosTemporalesMaquinaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuariosTemporalesMaquinaComponent]
    });
    fixture = TestBed.createComponent(UsuariosTemporalesMaquinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
