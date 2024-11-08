import { ControlinputsService } from './controlinputs.service';
import { TestBed } from '@angular/core/testing';

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
