import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { App.TopbarComponent } from './app.topbar.component';

describe('App.TopbarComponent', () => {
  let component: App.TopbarComponent;
  let fixture: ComponentFixture<App.TopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ App.TopbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(App.TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
