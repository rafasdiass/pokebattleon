import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonSelectionPage } from './pokemon-selection.page';

describe('PokemonSelectionPage', () => {
  let component: PokemonSelectionPage;
  let fixture: ComponentFixture<PokemonSelectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PokemonSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
