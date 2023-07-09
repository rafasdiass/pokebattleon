import { TestBed } from '@angular/core/testing';

import { CardPokemonService } from './card-pokemon.service';

describe('CardPokemonService', () => {
  let service: CardPokemonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardPokemonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
