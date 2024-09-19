import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDescargaExcelComponent } from './modal-descarga-excel.component';

describe('ModalDescargaExcelComponent', () => {
  let component: ModalDescargaExcelComponent;
  let fixture: ComponentFixture<ModalDescargaExcelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDescargaExcelComponent]
    });
    fixture = TestBed.createComponent(ModalDescargaExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
