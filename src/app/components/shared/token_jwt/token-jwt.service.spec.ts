import { TestBed } from '@angular/core/testing';

import { TokenJWTService } from './token-jwt.service';

describe('TokenJWTService', () => {
  let service: TokenJWTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenJWTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
