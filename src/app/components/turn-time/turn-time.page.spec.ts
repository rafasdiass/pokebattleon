import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TurnTimePage } from './turn-time.page';

describe('TurnTimePage', () => {
  let component: TurnTimePage;
  let fixture: ComponentFixture<TurnTimePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TurnTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
