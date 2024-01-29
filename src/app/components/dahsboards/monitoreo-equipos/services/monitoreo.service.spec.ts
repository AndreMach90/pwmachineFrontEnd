import { TestBed } from '@angular/core/testing';

import { MonitoreoService } from './monitoreo.service';

describe('MonitoreoService', () => {
  let service: MonitoreoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitoreoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
