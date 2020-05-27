import { TestBed } from '@angular/core/testing';

import { GuardDroitService } from './guard-droit.service';

describe('GuardDroitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuardDroitService = TestBed.get(GuardDroitService);
    expect(service).toBeTruthy();
  });
});
