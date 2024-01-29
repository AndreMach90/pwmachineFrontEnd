import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinariaMonitoreoComponent } from './maquinaria-monitoreo.component';

describe('MaquinariaMonitoreoComponent', () => {
  let component: MaquinariaMonitoreoComponent;
  let fixture: ComponentFixture<MaquinariaMonitoreoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaquinariaMonitoreoComponent]
    });
    fixture = TestBed.createComponent(MaquinariaMonitoreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
