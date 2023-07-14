import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonGymPage } from './pokemon-gym.page';

describe('PokemonGymPage', () => {
  let component: PokemonGymPage;
  let fixture: ComponentFixture<PokemonGymPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PokemonGymPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
