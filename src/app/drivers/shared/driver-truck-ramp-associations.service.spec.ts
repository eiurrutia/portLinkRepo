import { TestBed } from '@angular/core/testing';

import { DriverTruckRampAssociationsService } from './driver-truck-ramp-associations.service';

describe('DriverTruckRampAssociationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DriverTruckRampAssociationsService = TestBed.get(DriverTruckRampAssociationsService);
    expect(service).toBeTruthy();
  });
});
