import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuiltinsComponent } from './builtins.component';

describe('BuiltinsComponent', () => {
  let component: BuiltinsComponent;
  let fixture: ComponentFixture<BuiltinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuiltinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuiltinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
