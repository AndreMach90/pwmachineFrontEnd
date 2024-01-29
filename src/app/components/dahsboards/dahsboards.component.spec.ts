import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DahsboardsComponent } from './dahsboards.component';

describe('DahsboardsComponent', () => {
  let component: DahsboardsComponent;
  let fixture: ComponentFixture<DahsboardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DahsboardsComponent]
    });
    fixture = TestBed.createComponent(DahsboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
