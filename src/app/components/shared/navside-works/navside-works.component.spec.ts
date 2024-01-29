import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavsideWorksComponent } from './navside-works.component';

describe('NavsideWorksComponent', () => {
  let component: NavsideWorksComponent;
  let fixture: ComponentFixture<NavsideWorksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavsideWorksComponent]
    });
    fixture = TestBed.createComponent(NavsideWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
