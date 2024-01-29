import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavsideExpDataComponent } from './navside-exp-data.component';

describe('NavsideExpDataComponent', () => {
  let component: NavsideExpDataComponent;
  let fixture: ComponentFixture<NavsideExpDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavsideExpDataComponent]
    });
    fixture = TestBed.createComponent(NavsideExpDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
