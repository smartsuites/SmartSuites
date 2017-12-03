import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobmanagerComponent } from './jobmanager.component';

describe('JobmanagerComponent', () => {
  let component: JobmanagerComponent;
  let fixture: ComponentFixture<JobmanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobmanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
