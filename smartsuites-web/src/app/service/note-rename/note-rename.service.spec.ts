import { TestBed, inject } from '@angular/core/testing';

import { NoteRenameService } from './note-rename.service';

describe('NoteRenameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteRenameService]
    });
  });

  it('should be created', inject([NoteRenameService], (service: NoteRenameService) => {
    expect(service).toBeTruthy();
  }));
});
