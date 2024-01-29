import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDataExportComponent } from './dashboard-data-export.component';

describe('DashboardDataExportComponent', () => {
  let component: DashboardDataExportComponent;
  let fixture: ComponentFixture<DashboardDataExportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardDataExportComponent]
    });
    fixture = TestBed.createComponent(DashboardDataExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
