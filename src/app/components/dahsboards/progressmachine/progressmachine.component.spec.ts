import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressmachineComponent } from './progressmachine.component';

describe('ProgressmachineComponent', () => {
  let component: ProgressmachineComponent;
  let fixture: ComponentFixture<ProgressmachineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressmachineComponent]
    });
    fixture = TestBed.createComponent(ProgressmachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
