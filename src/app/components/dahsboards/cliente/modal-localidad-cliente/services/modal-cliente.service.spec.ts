import { TestBed } from '@angular/core/testing';

import { ModalClienteService } from './modal-cliente.service';

describe('ModalClienteService', () => {
  let service: ModalClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
