import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { App.MenuComponent } from './app.menu.component';

describe('App.MenuComponent', () => {
  let component: App.MenuComponent;
  let fixture: ComponentFixture<App.MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ App.MenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(App.MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
