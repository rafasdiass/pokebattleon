import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApipokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor() { }

  // Get a random pokemon
  async getRandomPokemon() {
    // First, get the total number of pokemons
    const totalPokemonsResponse = await axios.get(`${this.baseUrl}/pokemon`);
    const totalPokemons = totalPokemonsResponse.data.count;

    // Generate a random number between 1 and the total number of pokemons
    const randomPokemonId = Math.floor(Math.random() * totalPokemons) + 1;

    // Get the details of the random pokemon
    const pokemonResponse = await axios.get(`${this.baseUrl}/pokemon/${randomPokemonId}`);
    return pokemonResponse.data;
  }

  // Get a specific pokemon by id
  async getPokemonById(id: number) {
    const response = await axios.get(`${this.baseUrl}/pokemon/${id}`);
    return response.data;
  }
}
