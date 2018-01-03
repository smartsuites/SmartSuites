import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { App.FooterComponent } from './app.footer.component';

describe('App.FooterComponent', () => {
  let component: App.FooterComponent;
  let fixture: ComponentFixture<App.FooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ App.FooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(App.FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
