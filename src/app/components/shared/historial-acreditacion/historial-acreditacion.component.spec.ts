import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAcreditacionComponent } from './historial-acreditacion.component';

describe('HistorialAcreditacionComponent', () => {
  let component: HistorialAcreditacionComponent;
  let fixture: ComponentFixture<HistorialAcreditacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialAcreditacionComponent]
    });
    fixture = TestBed.createComponent(HistorialAcreditacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
