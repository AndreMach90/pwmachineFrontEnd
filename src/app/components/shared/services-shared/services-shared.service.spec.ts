import { TestBed } from '@angular/core/testing';

import { ServicesSharedService } from './services-shared.service';

describe('ServicesSharedService', () => {
  let service: ServicesSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
