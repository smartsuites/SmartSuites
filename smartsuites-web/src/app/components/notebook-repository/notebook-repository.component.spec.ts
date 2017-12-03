import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookRepositoryComponent } from './notebook-repository.component';

describe('NotebookRepositoryComponent', () => {
  let component: NotebookRepositoryComponent;
  let fixture: ComponentFixture<NotebookRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotebookRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
