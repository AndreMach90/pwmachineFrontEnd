import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrotransaccionalComponent } from './filtrotransaccional.component';

describe('FiltrotransaccionalComponent', () => {
  let component: FiltrotransaccionalComponent;
  let fixture: ComponentFixture<FiltrotransaccionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltrotransaccionalComponent]
    });
    fixture = TestBed.createComponent(FiltrotransaccionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
