import { TestBed, inject } from '@angular/core/testing';

import { HeliumService } from './helium.service';

describe('HeliumService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeliumService]
    });
  });

  it('should be created', inject([HeliumService], (service: HeliumService) => {
    expect(service).toBeTruthy();
  }));
});
