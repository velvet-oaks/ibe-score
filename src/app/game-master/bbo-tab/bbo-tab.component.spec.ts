import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BboTabComponent } from './bbo-tab.component';

describe('BboTabComponent', () => {
  let component: BboTabComponent;
  let fixture: ComponentFixture<BboTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BboTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BboTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
