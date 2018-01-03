import { TestBed, inject } from '@angular/core/testing';

import { SaveAsService } from './save-as.service';

describe('SaveAsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaveAsService]
    });
  });

  it('should be created', inject([SaveAsService], (service: SaveAsService) => {
    expect(service).toBeTruthy();
  }));
});
