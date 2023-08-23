import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedSignupComponent } from './extended-signup.component';

describe('ExtendedSignupComponent', () => {
  let component: ExtendedSignupComponent;
  let fixture: ComponentFixture<ExtendedSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedSignupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendedSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
