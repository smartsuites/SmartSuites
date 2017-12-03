import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteRenameComponent } from './note-rename.component';

describe('NoteRenameComponent', () => {
  let component: NoteRenameComponent;
  let fixture: ComponentFixture<NoteRenameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteRenameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
