import { TestBed, inject } from '@angular/core/testing';

import { NoteListService } from './note-list.service';

describe('NoteListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteListService]
    });
  });

  it('should be created', inject([NoteListService], (service: NoteListService) => {
    expect(service).toBeTruthy();
  }));
});
