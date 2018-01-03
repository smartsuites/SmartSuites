import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { App.ProfileComponent } from './app.profile.component';

describe('App.ProfileComponent', () => {
  let component: App.ProfileComponent;
  let fixture: ComponentFixture<App.ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ App.ProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(App.ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
