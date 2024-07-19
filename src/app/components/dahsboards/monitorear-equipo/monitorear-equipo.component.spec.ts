import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorearEquipoComponent } from './monitorear-equipo.component';

describe('MonitorearEquipoComponent', () => {
  let component: MonitorearEquipoComponent;
  let fixture: ComponentFixture<MonitorearEquipoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitorearEquipoComponent]
    });
    fixture = TestBed.createComponent(MonitorearEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
