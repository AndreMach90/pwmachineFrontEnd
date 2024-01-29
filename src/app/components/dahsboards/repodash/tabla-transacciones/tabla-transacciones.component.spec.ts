import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaTransaccionesComponent } from './tabla-transacciones.component';

describe('TablaTransaccionesComponent', () => {
  let component: TablaTransaccionesComponent;
  let fixture: ComponentFixture<TablaTransaccionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaTransaccionesComponent]
    });
    fixture = TestBed.createComponent(TablaTransaccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
