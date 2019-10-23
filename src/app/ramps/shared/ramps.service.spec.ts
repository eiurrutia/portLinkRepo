import { TestBed } from '@angular/core/testing';

import { RampsService } from './ramps.service';

describe('RampsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RampsService = TestBed.get(RampsService);
    expect(service).toBeTruthy();
  });
});
