import { TestBed, inject } from '@angular/core/testing';

import { NoteActionService } from './note-action.service';

describe('NoteActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteActionService]
    });
  });

  it('should be created', inject([NoteActionService], (service: NoteActionService) => {
    expect(service).toBeTruthy();
  }));
});
