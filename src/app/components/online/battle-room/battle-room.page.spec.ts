import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BattleRoomPage } from './battle-room.page';

describe('BattleRoomPage', () => {
  let component: BattleRoomPage;
  let fixture: ComponentFixture<BattleRoomPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BattleRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
