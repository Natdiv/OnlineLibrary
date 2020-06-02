import { TestBed } from '@angular/core/testing';

import { GuardCountStateService } from './guard-count-state.service';

describe('GuardCountStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuardCountStateService = TestBed.get(GuardCountStateService);
    expect(service).toBeTruthy();
  });
});
