import { TestBed } from '@angular/core/testing';

import { ImportersService } from './importers.service';

describe('ImportersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImportersService = TestBed.get(ImportersService);
    expect(service).toBeTruthy();
  });
});
