import { TestBed } from '@angular/core/testing';

import { MonitoreoIndividualService } from './monitoreo-individual.service';

describe('MonitoreoIndividualService', () => {
  let service: MonitoreoIndividualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitoreoIndividualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
