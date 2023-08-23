import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EBUP2PComponent } from './ebu-p2-p.component';

describe('EBUP2PComponent', () => {
  let component: EBUP2PComponent;
  let fixture: ComponentFixture<EBUP2PComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EBUP2PComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EBUP2PComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
