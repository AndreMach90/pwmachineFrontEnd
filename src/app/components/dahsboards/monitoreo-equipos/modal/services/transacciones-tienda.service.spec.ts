import { TestBed } from '@angular/core/testing';

import { TransaccionesTiendaService } from './transacciones-tienda.service';

describe('TransaccionesTiendaService', () => {
  let service: TransaccionesTiendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransaccionesTiendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
