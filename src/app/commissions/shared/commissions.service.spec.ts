import { TestBed } from '@angular/core/testing';

import { CommissionsService } from './commissions.service';

describe('CommissionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommissionsService = TestBed.get(CommissionsService);
    expect(service).toBeTruthy();
  });
});
