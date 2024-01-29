import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectiongraphComponent } from './collectiongraph.component';

describe('CollectiongraphComponent', () => {
  let component: CollectiongraphComponent;
  let fixture: ComponentFixture<CollectiongraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectiongraphComponent]
    });
    fixture = TestBed.createComponent(CollectiongraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
