import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BattleMechanicsPage } from './battle-mechanics.page';

describe('BattleMechanicsPage', () => {
  let component: BattleMechanicsPage;
  let fixture: ComponentFixture<BattleMechanicsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BattleMechanicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
