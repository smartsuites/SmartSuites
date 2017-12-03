import { TestBed, inject } from '@angular/core/testing';

import { BaseUrlService } from './base-url.service';

describe('BaseUrlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseUrlService]
    });
  });

  it('should be created', inject([BaseUrlService], (service: BaseUrlService) => {
    expect(service).toBeTruthy();
  }));
});
