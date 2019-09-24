import { TestBed } from '@angular/core/testing';

import { ThirdsService } from './thirds.service';

describe('ThirdsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThirdsService = TestBed.get(ThirdsService);
    expect(service).toBeTruthy();
  });
});
