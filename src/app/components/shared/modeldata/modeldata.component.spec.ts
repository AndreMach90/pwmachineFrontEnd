import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeldataComponent } from './modeldata.component';

describe('ModeldataComponent', () => {
  let component: ModeldataComponent;
  let fixture: ComponentFixture<ModeldataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModeldataComponent]
    });
    fixture = TestBed.createComponent(ModeldataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
