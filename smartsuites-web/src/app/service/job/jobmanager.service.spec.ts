import { TestBed, inject } from '@angular/core/testing';

import { JobmanagerService } from './jobmanager.service';

describe('JobmanagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobmanagerService]
    });
  });

  it('should be created', inject([JobmanagerService], (service: JobmanagerService) => {
    expect(service).toBeTruthy();
  }));
});
