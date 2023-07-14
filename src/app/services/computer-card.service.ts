import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';
import { ApipokemonService } from './apipokemon.service';

@Injectable({
  providedIn: 'root'
})
export class ComputerCardService {

  constructor(private apiPokemonService: ApipokemonService) {}

  async getRandomPokemon(count: number = 1): Promise<Card[]> {
    const pokemons: Card[] = [];

    for (let i = 0; i < count; i++) {
      const pokemon = await this.apiPokemonService.getRandomPokemon();
      pokemons.push(pokemon);
    }

    return pokemons;
  }
}
