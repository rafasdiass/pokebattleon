import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComputerplayerPage } from './computerplayer.page';

describe('ComputerplayerPage', () => {
  let component: ComputerplayerPage;
  let fixture: ComponentFixture<ComputerplayerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ComputerplayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
