import { IndexedDbService } from './indexed-db.service';
import { TestBed } from '@angular/core/testing';

describe('IndexedDbService', () => {
  let service: IndexedDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexedDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
