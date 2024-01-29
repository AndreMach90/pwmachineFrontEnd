import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepodashComponent } from './repodash.component';

describe('RepodashComponent', () => {
  let component: RepodashComponent;
  let fixture: ComponentFixture<RepodashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepodashComponent]
    });
    fixture = TestBed.createComponent(RepodashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
