import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitRepoComponent } from './init-repo.component';

describe('InitRepoComponent', () => {
  let component: InitRepoComponent;
  let fixture: ComponentFixture<InitRepoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InitRepoComponent]
    });
    fixture = TestBed.createComponent(InitRepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
