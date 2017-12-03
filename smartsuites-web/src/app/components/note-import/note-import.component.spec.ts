import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteImportComponent } from './note-import.component';

describe('NoteImportComponent', () => {
  let component: NoteImportComponent;
  let fixture: ComponentFixture<NoteImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
