import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BussDashboardComponent } from './buss-dashboard.component';

describe('BussDashboardComponent', () => {
  let component: BussDashboardComponent;
  let fixture: ComponentFixture<BussDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BussDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BussDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
