import { TestBed } from '@angular/core/testing';

import { LapsService } from './laps.service';

describe('LapsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LapsService = TestBed.get(LapsService);
    expect(service).toBeTruthy();
  });
});
