import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSignupDialogComponent } from './login-signup-dialog.component';

describe('LoginSignupDialogComponent', () => {
  let component: LoginSignupDialogComponent;
  let fixture: ComponentFixture<LoginSignupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginSignupDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginSignupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
