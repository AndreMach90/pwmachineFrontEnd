import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfigExcelComponent } from './modal-config-excel.component';

describe('ModalConfigExcelComponent', () => {
  let component: ModalConfigExcelComponent;
  let fixture: ComponentFixture<ModalConfigExcelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfigExcelComponent]
    });
    fixture = TestBed.createComponent(ModalConfigExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
