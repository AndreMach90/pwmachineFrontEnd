import { TestBed } from '@angular/core/testing';

import { HistoriaAcreditacionService } from './historia-acreditacion.service';

describe('HistoriaAcreditacionService', () => {
  let service: HistoriaAcreditacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriaAcreditacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
