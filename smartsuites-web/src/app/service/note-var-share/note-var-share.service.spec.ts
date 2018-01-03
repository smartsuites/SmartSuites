import { TestBed, inject } from '@angular/core/testing';

import { NoteVarShareService } from './note-var-share.service';

describe('NoteVarShareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteVarShareService]
    });
  });

  it('should be created', inject([NoteVarShareService], (service: NoteVarShareService) => {
    expect(service).toBeTruthy();
  }));
});
