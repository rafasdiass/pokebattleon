import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BattleResultPage } from './battle-result.page';

describe('BattleResultPage', () => {
  let component: BattleResultPage;
  let fixture: ComponentFixture<BattleResultPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BattleResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
