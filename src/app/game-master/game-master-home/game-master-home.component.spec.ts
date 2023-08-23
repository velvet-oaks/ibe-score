import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMasterHomeComponent } from './game-master-home.component';

describe('GameMasterHomeComponent', () => {
  let component: GameMasterHomeComponent;
  let fixture: ComponentFixture<GameMasterHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameMasterHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameMasterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
