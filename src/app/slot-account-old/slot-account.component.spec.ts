import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotAccountComponent } from './slot-account.component';

describe('SlotAccountComponent', () => {
  let component: SlotAccountComponent;
  let fixture: ComponentFixture<SlotAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
