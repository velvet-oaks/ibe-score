import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsebioComponent } from './usebio.component';

describe('UsebioComponent', () => {
  let component: UsebioComponent;
  let fixture: ComponentFixture<UsebioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsebioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsebioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
