import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoEquiposComponent } from './monitoreo-equipos.component';

describe('MonitoreoEquiposComponent', () => {
  let component: MonitoreoEquiposComponent;
  let fixture: ComponentFixture<MonitoreoEquiposComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoreoEquiposComponent]
    });
    fixture = TestBed.createComponent(MonitoreoEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
