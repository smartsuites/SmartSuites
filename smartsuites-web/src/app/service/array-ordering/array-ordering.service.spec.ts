import { TestBed, inject } from '@angular/core/testing';

import { ArrayOrderingService } from './array-ordering.service';

describe('ArrayOrderingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArrayOrderingService]
    });
  });

  it('should be created', inject([ArrayOrderingService], (service: ArrayOrderingService) => {
    expect(service).toBeTruthy();
  }));
});
