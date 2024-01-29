import { TestBed } from '@angular/core/testing';

import { ControlinputsService } from './controlinputs.service';

describe('ControlinputsService', () => {
  let service: ControlinputsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlinputsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
